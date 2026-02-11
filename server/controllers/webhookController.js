import mongoose from "mongoose";
import stripe from "../config/stripe.js";
import Order from "../models/Order.js";
import Payment from "../models/Payment.js";
import * as inventoryService from "../services/inventoryService.js";

export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).json({ message: "Webhook Error", details: err.message });
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    const { orderNumber } = paymentIntent.metadata;

    console.log("🔔 Stripe webhook recibido:", {
      eventId: event.id,
      intentId: paymentIntent.id,
      orderNumber,
      amount_received: paymentIntent.amount_received,
    });

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 1. Buscar la Orden
      const order = await Order.findOne({ orderNumber }).session(session);
      if (!order) {
        await session.abortTransaction();
        return res.status(404).json({ message: "Orden no encontrada" });
      }

      // 2. Buscar el Pago y VALIDAR ESTADO REAL (con fallback por orderId)
      let payment = await Payment.findOne({ intentId: paymentIntent.id }).session(session);

      if (!payment) {
        // IntentId no encontrado: intentar localizar por orderId
        payment = await Payment.findOne({ orderId: order._id }).session(session);
        if (payment) {
          // Vincular intentId para trazabilidad y futuras idempotencias
          payment.intentId = paymentIntent.id;
          await payment.save({ session });
          console.log(`ℹ️ Pago vinculado por orderId. intentId asignado: ${paymentIntent.id}`);
        }
      }

      if (!payment) {
        await session.abortTransaction();
        console.warn(`⏳ Pago ${paymentIntent.id} no registrado en BD aún (order: ${orderNumber}).`);
        return res.status(404).json({ message: "Registro de pago no encontrado" });
      }

      // 🛡️ SEGURIDAD: Solo si el pago NO es 'paid', restamos stock
      if (payment.status !== "paid") {
        
        console.log(`📉 Restando stock para orden: ${orderNumber}`);
        
        // EJECUTAR RESTA
        await inventoryService.deductStock(order.items, session);

        // Actualizar Pago
        payment.status = "paid";
        payment.rawEventId = event.id; // Aquí se marca como procesado
        await payment.save({ session });

        // Actualizar Orden
        order.status = "Pendiente"; // O el estado que desees post-pago
        // Nota: En tu modelo Order el enum no tiene "Pagado", usa "Pendiente" o actualiza el modelo
        await order.save({ session });

        await session.commitTransaction();
        console.log("✅ Stock actualizado y pago registrado.");
      } else {
        console.log("🔁 Pago ya procesado anteriormente.");
        await session.abortTransaction();
      }

    } catch (error) {
      await session.abortTransaction();
      console.error("❌ Error crítico:", error.message);
      return res.status(500).json({ error: error.message });
    } finally {
      session.endSession();
    }
  }

  res.json({ received: true });
};