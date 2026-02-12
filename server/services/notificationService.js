import nodemailer from "nodemailer";
import axios from "axios";

// Configuración del transporte de Outlook
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    ciphers: "SSLv3",
    rejectUnauthorized: false,
  },
  family: 4, // Fuerza IPv4 para evitar ECONNREFUSED ::1
});

/**
 * 📧 Envía correo de confirmación al cliente
 */
export const sendPaymentConfirmationEmail = async (order) => {
  const mailOptions = {
    from: `"Palmarito Bacanora" <${process.env.EMAIL_USER}>`,
    to: order.customer.email,
    subject: `Confirmación de tu pedido ${order.orderNumber}`,
    html: `<h1>¡Gracias por tu compra, ${order.customer.name}!</h1>
           <p>Hemos recibido tu pago de $${order.totalPrice} MXN.</p>
           <p>Pronto te enviaremos los detalles del envío.</p>`,
  };

  return transporter.sendMail(mailOptions);
};

/**
 * 📧 Notifica al dueño por correo
 */
export const notifyOwnerViaEmail = async (order) => {
  const mailOptions = {
    from: `"Sistema Bacanora" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `💰 NUEVA VENTA - ${order.orderNumber}`,
    text: `Se ha registrado una nueva venta por $${order.totalPrice} MXN del cliente ${order.customer.name}.`,
  };

  return transporter.sendMail(mailOptions);
};

/**
 * 📱 Notifica al dueño por Telegram (SOLO TELEGRAM)
 */
export const notifyOwnerViaTelegram = async (order) => {
  const message =
    `💰 *¡NUEVA VENTA!*\n\n` +
    `🆔 *Orden:* ${order.orderNumber}\n` +
    `👤 *Cliente:* ${order.customer.name}\n` +
    `💵 *Total:* $${order.total} MXN\n` +
    `📍 *Estado:* ${order.shipping?.state || "N/A"}`;

  const telegramUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;

  try {
    const response = await axios.post(telegramUrl, {
      chat_id: process.env.TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: "Markdown",
    });
    console.log("✅ Respuesta de Telegram API:", response.data.ok);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error en Telegram API:",
      error.response?.data || error.message,
    );
    throw error; // Para que Promise.allSettled detecte el fallo
  }
};
