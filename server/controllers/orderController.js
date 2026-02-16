import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Order from "../models/Order.js";
import Payment from "../models/Payment.js";
import Product from "../models/Product.js";
import stripe from "../config/stripe.js";

import { generateOrderReceipt } from "../services/pdfService.js";

/* ==================================================
   🛒 CREAR ORDEN
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
          totals: { subtotal, shipping: shippingCost, total, currency: "MXN" },
          shipping,
          customerNote,
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

    // 🔥 ELIMINAMOS EL PASO 5 (RESERVAR STOCK)
    // Ya no restamos aquí. Esperaremos al Webhook de Stripe.

    await session.commitTransaction();
    console.log(
      `✅ Orden ${orderNumber} y registro de pago creados (Stock intacto).`,
    );
  } catch (error) {
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

// @desc    Obtener estadísticas de ventas para el Dashboard
// @route   GET /api/orders/stats
// @access  Private/Admin
export const getDashboardStats = asyncHandler(async (req, res) => {
  const now = new Date();

  // 🕒 Preparación de fechas
  const startOfToday = new Date(now.setHours(0, 0, 0, 0));
  const start12MonthsAgo = new Date();
  start12MonthsAgo.setMonth(start12MonthsAgo.getMonth() - 11);

  const [orderStats, lowStockProducts] = await Promise.all([
    Order.aggregate([
      {
        $facet: {
          // 📉 Tendencia de 12 meses (Filtro previo para precisión)
          monthlyTrend: [
            {
              $match: {
                createdAt: { $gte: start12MonthsAgo },
                status: { $ne: "Cancelado" },
              },
            },
            {
              $group: {
                _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                revenue: { $sum: "$totals.total" },
                orders: { $sum: 1 },
              },
            },
            { $sort: { _id: 1 } },
          ],

          // 🍶 Top 5 Productos (Por ID para evitar conflictos de nombres)
          products: [
            { $match: { status: { $nin: ["Cancelado", "Pago Pendiente"] } } },
            { $unwind: "$items" },
            {
              $group: {
                _id: "$items.product",
                name: { $first: "$items.name" },
                totalQty: { $sum: "$items.quantity" },
                totalRevenue: { $sum: "$items.subtotal" },
              },
            },
            { $sort: { totalQty: -1 } },
            { $limit: 5 },
          ],

          // 📦 Control de Estados (Sin cancelados)
          operations: [
            { $match: { status: { $ne: "Cancelado" } } },
            { $group: { _id: "$status", count: { $sum: 1 } } },
          ],

          // ⚡ Órdenes de HOY
          today: [
            {
              $match: {
                createdAt: { $gte: startOfToday },
                status: { $ne: "Cancelado" },
              },
            },
            { $count: "count" },
          ],

          // 💎 Top Clientes (Gasto real)
          topCustomers: [
            { $match: { status: "Pagado" } },
            {
              $group: {
                _id: "$customer.email",
                name: { $first: "$customer.name" },
                totalSpent: { $sum: "$totals.total" },
              },
            },
            { $sort: { totalSpent: -1 } },
            { $limit: 5 },
          ],

          // 💰 Resumen Global
          global: [
            { $match: { status: { $nin: ["Cancelado", "Pago Pendiente"] } } },
            {
              $group: {
                _id: null,
                totalRevenue: { $sum: "$totals.total" },
                totalOrders: { $sum: 1 },
              },
            },
          ],
        },
      },
    ]),
    // 🚨 Alerta de inventario (Stock <= 5)
    Product.find({ countInStock: { $lte: 5 } }).select("name countInStock"),
  ]);

  const results = orderStats[0];
  const global = results.global[0] || { totalRevenue: 0, totalOrders: 0 };

  res.json({
    cards: {
      todayOrders: results.today[0]?.count || 0,
      totalRevenue: global.totalRevenue,
      totalOrders: global.totalOrders,
      lowStockAlerts: lowStockProducts.length,
    },
    charts: {
      salesTrend: results.monthlyTrend,
      topProducts: results.products.map((p) => ({
        ...p,
        share:
          global.totalRevenue > 0
            ? ((p.totalRevenue / global.totalRevenue) * 100).toFixed(2) + "%"
            : "0%",
      })),
    },
    customers: results.topCustomers,
    inventory: { atRisk: lowStockProducts },
    operations: { statusDistribution: results.operations },
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
