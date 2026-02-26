import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Order from "../models/Order.js";
import Payment from "../models/Payment.js";
import Product from "../models/Product.js";
import Mixology from "../models/Mixology.js";
import stripe from "../config/stripe.js";

import { generateOrderReceipt } from "../services/pdfService.js";

/* ==================================================
   🛒 CREAR ORDEN
   ================================================== */
export const addOrderItems = asyncHandler(async (req, res) => {
  const { customer, items, shipping, customerNote, legalAgeConfirmed } =
    req.body;

  if (legalAgeConfirmed !== true && String(legalAgeConfirmed) !== "true") {
    res.status(400);
    throw new Error(
      "Confirmación de mayoría de edad requerida para proceder con la compra."
    );
  }

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
          totals: { subtotal, shipping: shippingCost, total, currency: "MXN" },
          shipping,
          customerNote,
          legalAgeConfirmed: true,
          status: "Pendiente",
        },
      ],
      { session },
    );

    // Crear el registro de pago
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

    await session.commitTransaction();
    console.log(
      `✅ Orden ${orderNumber} y registro de pago creados (Stock intacto).`,
    );
  } catch (error) {
    await session.abortTransaction();
    console.error(`❌ Error al crear la orden ${orderNumber}:`, error.message);
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

// @desc    Obtener estadísticas de ventas para el Dashboard
// @route   GET /api/orders/stats
// @access  Private/Admin
export const getDashboardStats = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  let dateQuery = {};
  if (startDate && endDate) {
    dateQuery = {
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    };
  }

  const now = new Date();
  const startOfToday = new Date(now.setHours(0, 0, 0, 0));

  // 💰 Definimos qué estatus representan dinero real en caja
  const paidStatuses = ["Pagado", "Enviado", "Entregado"];

  // 3. CONSULTA PARALELA: AGREGACIÓN + PRODUCTOS + MIXOLOGÍA
  const [orderStats, lowStockProducts, allBacanoras, totalRecipes] =
    await Promise.all([
      Order.aggregate([
        {
          $facet: {
            // 💰 Resumen Global (Filtrado por pagos reales)
            global: [
              {
                $match: {
                  ...dateQuery,
                  status: { $in: paidStatuses }, // 🚀 Solo sumamos lo cobrado
                },
              },
              {
                $group: {
                  _id: null,
                  totalRevenue: { $sum: "$totals.total" },
                  totalOrders: { $sum: 1 },
                },
              },
            ],

            // ⚡ Órdenes de HOY (Volumen de trabajo)
            today: [
              {
                $match: {
                  createdAt: { $gte: startOfToday },
                  status: { $ne: "Cancelado" },
                },
              },
              {
                $group: {
                  _id: null,
                  count: { $sum: 1 },
                  // Revenue de hoy filtrado por pago
                  revenue: {
                    $sum: {
                      $cond: [
                        { $in: ["$status", paidStatuses] },
                        "$totals.total",
                        0,
                      ],
                    },
                  },
                },
              },
            ],

            // 📊 RENDIMIENTO POR PRODUCTO (Solo ventas pagadas)
            productSales: [
              {
                $match: {
                  ...dateQuery,
                  status: { $in: paidStatuses },
                },
              },
              { $unwind: "$items" },
              {
                $group: {
                  _id: "$items.name",
                  qty: { $sum: "$items.quantity" },
                  revenue: { $sum: "$items.subtotal" },
                },
              },
            ],

            // 📦 Distribución por Estado
            operations: [
              {
                $match: {
                  ...dateQuery,
                  status: { $exists: true },
                },
              },
              { $group: { _id: "$status", count: { $sum: 1 } } },
            ],
          },
        },
      ]),

      Product.find({ countInStock: { $lte: 5 } }).select("name countInStock"),
      Product.find({ category: "Bacanora" }).select("name"),
      Mixology.countDocuments({ isActive: { $ne: false } }), // 👈 Cambio 2: Conteo de recetas
    ]);

  const results = orderStats[0];
  const global = results.global[0] || { totalRevenue: 0, totalOrders: 0 };
  const today = results.today[0] || { count: 0, revenue: 0 };

  const salesMap = results.productSales.reduce((acc, item) => {
    acc[item._id] = item;
    return acc;
  }, {});

  const productPerformance = allBacanoras.map((p) => ({
    name: p.name,
    qty: salesMap[p.name]?.qty || 0,
    revenue: salesMap[p.name]?.revenue || 0,
  }));

  res.json({
    cards: {
      todayOrders: today.count,
      totalRevenue: global.totalRevenue,
      totalOrders: global.totalOrders,
      lowStockAlerts: lowStockProducts.length,
      totalRecipes: totalRecipes, // 👈 Enviamos el dato al Front
    },
    productPerformance,
    operations: { statusDistribution: results.operations },
    inventory: { atRisk: lowStockProducts },
  });
});

export const downloadReceipt = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ orderNumber: req.params.orderNumber });

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  const pdfBuffer = await generateOrderReceipt(order);
  // Configuramos los headers para que el navegador sepa que es un PDF
  res.set({
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename=receipt-${order.orderNumber}.pdf`,
    "Content-Length": pdfBuffer.length,
  });

  res.send(pdfBuffer);
});
