import mongoose from "mongoose";
import stripe from "../config/stripe.js";
import Order from "../models/Order.js";
import Payment from "../models/Payment.js";
import * as inventoryService from "../services/inventoryService.js";
import { generateOrderReceipt } from "../services/pdfService.js"; // 👈 1. IMPORTANTE
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

      // 2. Buscar el Pago
      let payment = await Payment.findOne({
        intentId: paymentIntent.id,
      }).session(session);

      if (!payment) {
        payment = await Payment.findOne({ orderId: order._id }).session(
          session,
        );
        if (payment) {
          payment.intentId = paymentIntent.id;
          await payment.save({ session });
        }
      }

      if (!payment) {
        await session.abortTransaction();
        return res
          .status(404)
          .json({ message: "Registro de pago no encontrado" });
      }

      // 🛡️ SEGURIDAD: Solo si el pago NO es 'paid', procesamos
      if (payment.status !== "paid") {
        console.log(`📉 Restando stock para orden: ${orderNumber}`);

        await inventoryService.deductStock(order.items, session);

        payment.status = "paid";
        payment.rawEventId = event.id;
        await payment.save({ session });

        // Actualizamos estado de la orden a PAGADO para que refleje la realidad
        order.status = "Pagado"; // 👈 Actualizamos esto también
        order.isPaid = true; // 👈 Y esto
        order.paidAt = new Date();
        await order.save({ session });

        await session.commitTransaction();
        console.log(
          "✅ Stock actualizado, orden pagada y transacción cerrada.",
        );

        // --- 🚀 ZONA DE NOTIFICACIONES (FUERA DE TRANSACCIÓN) ---
        try {
          console.log("📄 Generando recibo PDF...");

          // 2. GENERAMOS EL PDF AQUÍ
          // Lo hacemos fuera de la transacción para no bloquear la BD si tarda
          const pdfBuffer = await generateOrderReceipt(order);

          console.log("📨 Iniciando envío de notificaciones...");

          const resultados = await Promise.allSettled([
            // 3. PASAMOS EL BUFFER AL CORREO DEL CLIENTE
            sendPaymentConfirmationEmail(order, pdfBuffer),
            notifyOwnerViaEmail(order),
            notifyOwnerViaTelegram(order),
          ]);

          const nombresTareas = [
            "Email Cliente (+PDF)",
            "Email Admin",
            "Telegram",
          ];

          resultados.forEach((res, i) => {
            if (res.status === "rejected") {
              console.error(`⚠️ FALLÓ ${nombresTareas[i]}:`, {
                motivo: res.reason?.message || res.reason,
              });
            } else {
              console.log(`✅ ÉXITO ${nombresTareas[i]}`);
            }
          });
        } catch (errorNotif) {
          console.error(
            "❌ Error generando PDF o enviando correos:",
            errorNotif,
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
