import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Order from "../models/Order.js";
import Payment from "../models/Payment.js";
import Product from "../models/Product.js";
import stripe from "../config/stripe.js";

/* ==================================================
   🛒 CREAR ORDEN + INICIAR PAGO (BLINDADO)
   ================================================== */
export const addOrderItems = asyncHandler(async (req, res) => {
  console.log("🚀 Iniciando creación de orden...");

  const { customer, items, shipping, customerNote } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    res.status(400);
    throw new Error("La orden no tiene productos");
  }

  // 1. Verificación de precios e inventario (Pre-check)
  let subtotal = 0;
  const verifiedItems = [];

  for (const item of items) {
    const product = await Product.findById(item.productId);

    if (!product) {
      res.status(404);
      throw new Error(`Producto no encontrado: ${item.productId}`);
    }

    if (product.countInStock < item.quantity) {
      res.status(400);
      throw new Error(`Stock insuficiente para ${product.name}`);
    }

    const itemSubtotal = product.price * item.quantity;
    subtotal += itemSubtotal;

    verifiedItems.push({
      productId: product._id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
      subtotal: itemSubtotal,
    });
  }

  const shippingCost = subtotal > 2000 ? 0 : 150;
  const total = subtotal + shippingCost;

  // 2. Generar número de orden único
  const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, "");
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
  const orderNumber = `PAL-${dateStr}-${randomStr}`;

  // 3. Crear el Intent en Stripe (fuera de la sesión de BD)
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(total * 100),
    currency: "mxn",
    metadata: { orderNumber },
    automatic_payment_methods: { enabled: true },
  });

  // 4. Operación Atómica en Base de Datos
  const session = await mongoose.startSession();
  let order;

  try {
    session.startTransaction();

    // Crear la Orden
    [order] = await Order.create(
      [
        {
          orderNumber,
          customer,
          items: verifiedItems,
          totals: {
            subtotal,
            shipping: shippingCost,
            total,
            currency: "MXN",
          },
          shipping,
          customerNote,
          status: "Pendiente",
        },
      ],
      { session },
    );

    // 🛡️ SEGURIDAD: Crear el registro de pago DENTRO de la transacción
    // Ahora usamos la sesión para que el Webhook lo encuentre con seguridad.
    await Payment.create(
      [
        {
          orderId: order._id,
          provider: "stripe",
          intentId: paymentIntent.id,
          amount: total,
          currency: "MXN",
          status: "pending",
        },
      ],
      { session },
    );

    // 5. Reservar stock: decrementar `countInStock` en cada producto dentro
    // de la misma sesión/transacción para mantener consistencia.
    for (const item of verifiedItems) {
      const { productId, quantity, name } = item;

      const result = await Product.updateOne(
        { _id: productId, countInStock: { $gte: quantity } },
        { $inc: { countInStock: -quantity } },
        { session },
      );

      if (result.modifiedCount === 0) {
        throw new Error(`Stock insuficiente al reservar ${name}`);
      }
    }

    // Si todo sale bien, confirmamos ambos documentos
    await session.commitTransaction();
    console.log(
      `✅ Orden ${orderNumber} y registro de pago creados exitosamente.`,
    );
  } catch (error) {
    // Si algo falla, no se crea ni la orden ni el pago
    await session.abortTransaction();
    console.error("❌ Error en la transacción de orden:", error.message);
    throw error;
  } finally {
    session.endSession();
  }

  res.status(201).json({
    order,
    clientSecret: paymentIntent.client_secret,
  });
});

/* ==================================================
   🔍 OBTENER ORDEN POR ID (INCLUYE PAGO)
   ================================================== */
export const getOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("ID inválido");
  }

  const order = await Order.findById(id).lean();
  if (!order) {
    res.status(404);
    throw new Error("Orden no encontrada");
  }

  const payment = await Payment.findOne({ orderId: order._id }).lean();

  res.json({
    ...order,
    payment: payment
      ? {
          status: payment.status,
          provider: payment.provider,
          amount: payment.amount,
          paidAt: payment.paidAt,
        }
      : null,
  });
});

/* ==================================================
   📦 TRACKING POR NÚMERO
   ================================================== */
export const getOrderByOrderNumber = asyncHandler(async (req, res) => {
  const { orderNumber } = req.params;

  const order = await Order.findOne({ orderNumber }).lean();
  if (!order) {
    res.status(404);
    throw new Error("Orden no encontrada");
  }

  const payment = await Payment.findOne({ orderId: order._id }).lean();

  res.json({
    ...order,
    payment: payment
      ? {
          status: payment.status,
          provider: payment.provider,
        }
      : null,
  });
});

/* ==================================================
   📋 LISTAR ÓRDENES (ADMIN)
   ================================================== */
export const getOrders = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 20, 100);
  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    Order.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Order.countDocuments(),
  ]);

  res.json({
    page,
    pages: Math.ceil(total / limit),
    total,
    orders,
  });
});

/* ==================================================
   🚚 ACTUALIZAR ESTADO (ADMIN)
   ================================================== */
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, carrier, trackingNumber } = req.body;

  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Orden no encontrada");
  }

  if (status) order.status = status;
  if (carrier) order.shipping.carrier = carrier;
  if (trackingNumber) order.shipping.trackingNumber = trackingNumber;

  const updated = await order.save();
  res.json(updated);
});
