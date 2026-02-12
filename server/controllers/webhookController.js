import mongoose from "mongoose";
import stripe from "../config/stripe.js";
import Order from "../models/Order.js";
import Payment from "../models/Payment.js";
import * as inventoryService from "../services/inventoryService.js";
import {
  sendPaymentConfirmationEmail,
  notifyOwnerViaEmail,
  notifyOwnerViaTelegram,
} from "../services/notificationService.js";

export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    return res
      .status(400)
      .json({ message: "Webhook Error", details: err.message });
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
      let payment = await Payment.findOne({
        intentId: paymentIntent.id,
      }).session(session);

      if (!payment) {
        // IntentId no encontrado: intentar localizar por orderId
        payment = await Payment.findOne({ orderId: order._id }).session(
          session,
        );
        if (payment) {
          // Vincular intentId para trazabilidad y futuras idempotencias
          payment.intentId = paymentIntent.id;
          await payment.save({ session });
          console.log(
            `ℹ️ Pago vinculado por orderId. intentId asignado: ${paymentIntent.id}`,
          );
        }
      }

      if (!payment) {
        await session.abortTransaction();
        console.warn(
          `⏳ Pago ${paymentIntent.id} no registrado en BD aún (order: ${orderNumber}).`,
        );
        return res
          .status(404)
          .json({ message: "Registro de pago no encontrado" });
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

        order.status = "Pendiente";
        await order.save({ session });

        await session.commitTransaction();
        console.log("✅ Stock actualizado y pago registrado.");
        try {
          console.log("📨 Iniciando envío de notificaciones...");

          // Ejecutamos en paralelo para que el fallo de uno no detenga al otro
          const resultados = await Promise.allSettled([
            sendPaymentConfirmationEmail(order), // #0
            notifyOwnerViaEmail(order), // #1
            notifyOwnerViaTelegram(order), // #2
          ]);

          const nombresTareas = ["Email Cliente", "Email Admin", "Telegram"];

          resultados.forEach((res, i) => {
            if (res.status === "rejected") {
              console.error(`⚠️ FALLÓ ${nombresTareas[i]}:`, {
                motivo: res.reason?.message || res.reason,
              });
            } else {
              console.log(`✅ ÉXITO ${nombresTareas[i]}`);
            }
          });

          console.log("🔔 Proceso de notificaciones finalizado.");
        } catch (errorNotif) {
          // Atrapa errores de sintaxis en el bloque, no de los envíos en sí
          console.error(
            "❌ Error inesperado en el bloque de notificaciones:",
            errorNotif.message,
          );
        }
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
