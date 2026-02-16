import nodemailer from "nodemailer";
import axios from "axios";

// Configuración del transporte de Outlook
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  family: 4, // Fuerza IPv4 para evitar ECONNREFUSED ::1
});

/**
 * 📧 Envía correo de confirmación al cliente
 */
export const sendPaymentConfirmationEmail = async (order, pdfBuffer) => {
  const {
    orderNumber,
    createdAt,
    customer,
    items,
    totals,
    shipping,
    customerNote,
  } = order;

  const formattedDate = new Date(createdAt).toLocaleString("es-MX");

  const itemsHtml = items
    .map(
      (item) => `
        <tr>
          <td style="padding:8px 0;">${item.quantity}x ${item.name}</td>
          <td style="text-align:right;">$${item.price.toLocaleString()}</td>
          <td style="text-align:right;">$${item.subtotal.toLocaleString()}</td>
        </tr>
      `,
    )
    .join("");

  const mailOptions = {
    from: `"Palmarito Bacanora" <${process.env.EMAIL_USER}>`,
    to: customer.email,
    subject: `Confirmación de pedido ${orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; color:#333;">
        
        <h2 style="text-align:center;">🍶 Palmarito Bacanora</h2>
        <hr/>

        <h3>¡Gracias por tu compra, ${customer.name}!</h3>

        <p>Hemos recibido tu pago correctamente. <strong>Adjunto a este correo encontrarás tu recibo oficial en formato PDF.</strong></p>

        <p>
          <strong>Número de orden:</strong> ${orderNumber}<br/>
          <strong>Fecha:</strong> ${formattedDate}
        </p>

        <h4>📦 Resumen de tu pedido</h4>
        <table width="100%" style="border-collapse: collapse;">
          <thead>
            <tr>
              <th align="left">Producto</th>
              <th align="right">Precio</th>
              <th align="right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <hr/>

        <p>
          <strong>Subtotal:</strong> $${totals.subtotal.toLocaleString()}<br/>
          <strong>Envío:</strong> $${totals.shipping.toLocaleString()}<br/>
          <strong>Impuestos:</strong> $${totals.tax.toLocaleString()}<br/>
          <strong style="font-size:18px;">Total pagado: $${totals.total.toLocaleString()} ${totals.currency}</strong>
        </p>

        <hr/>

        <h4>🚚 Dirección de envío</h4>
        <p>
          ${shipping.address}<br/>
          ${shipping.city}, ${shipping.state}, ${shipping.country}<br/>
          CP: ${shipping.zip}
        </p>

        ${
          customerNote
            ? `<h4>📝 Nota del cliente</h4>
               <p>${customerNote}</p>`
            : ""
        }

        <hr/>

        <h4>⏱ Próximos pasos</h4>
        <p>
          Tu pedido será preparado y enviado en las próximas 24–48 horas hábiles.
          Recibirás un correo adicional con tu número de guía.
        </p>

        <hr/>

        <p style="font-size:12px; color:#777;">
          Si tienes alguna duda, contáctanos:<br/>
          📧 soporte@palmaritobacanora.com<br/>
          📱 WhatsApp: +52 644 000 0000<br/>
          🌐 www.palmaritobacanora.com
        </p>

      </div>
    `,
    attachments: [
      {
        filename: `Recibo-${orderNumber}.pdf`,
        content: Buffer.isBuffer(pdfBuffer)
          ? pdfBuffer
          : Buffer.from(pdfBuffer),
        contentType: "application/pdf",
        encoding: "base64",
      },
    ],
  };

  return transporter.sendMail(mailOptions);
};

/**
 * 📧 Notificación para el Dueño (Admin)
 */
export const notifyOwnerViaEmail = async (order) => {
  const {
    _id,
    orderNumber,
    createdAt,
    customer,
    items,
    totals,
    shipping,
    status,
    customerNote,
  } = order;

  const formattedDate = new Date(createdAt).toLocaleString("es-MX");

  const itemsHtml = items
    .map(
      (item) => `
        <tr>
          <td>${item.quantity}x ${item.name}</td>
          <td style="text-align:right;">$${item.price.toLocaleString()}</td>
          <td style="text-align:right;">$${item.subtotal.toLocaleString()}</td>
        </tr>
      `,
    )
    .join("");

  const mailOptions = {
    from: `"Sistema Bacanora" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `💰 NUEVA VENTA - ${orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width:650px; margin:auto;">
        
        <h2 style="color:#2c3e50;">💰 Nueva Venta Recibida</h2>
        <hr/>

        <p>
          <strong>Orden:</strong> ${orderNumber}<br/>
          <strong>ID Interno:</strong> ${_id}<br/>
          <strong>Fecha:</strong> ${formattedDate}<br/>
          <strong>Estado:</strong> ${status}
        </p>

        <hr/>

        <h3>👤 Cliente</h3>
        <p>
          <strong>Nombre:</strong> ${customer.name}<br/>
          <strong>Email:</strong> ${customer.email}<br/>
          <strong>Teléfono:</strong> ${customer.phone}
        </p>

        <hr/>

        <h3>📦 Productos</h3>
        <table width="100%" style="border-collapse: collapse;">
          <thead>
            <tr>
              <th align="left">Producto</th>
              <th align="right">Precio</th>
              <th align="right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <hr/>

        <h3>💰 Totales</h3>
        <p>
          Subtotal: $${totals.subtotal.toLocaleString()}<br/>
          Envío: $${totals.shipping.toLocaleString()}<br/>
          Impuestos: $${totals.tax.toLocaleString()}<br/>
          <strong style="font-size:18px;">TOTAL: $${totals.total.toLocaleString()} ${totals.currency}</strong>
        </p>

        <hr/>

        <h3>🚚 Dirección de Envío</h3>
        <p>
          ${shipping.address}<br/>
          ${shipping.city}, ${shipping.state}, ${shipping.country}<br/>
          CP: ${shipping.zip}
        </p>

        ${
          shipping.references
            ? `<p><strong>Referencias:</strong> ${shipping.references}</p>`
            : ""
        }

        ${
          customerNote
            ? `<hr/>
               <h3>📝 Nota del Cliente</h3>
               <p>${customerNote}</p>`
            : ""
        }

        <hr/>

        <p style="font-size:12px; color:#777;">
          Este correo fue generado automáticamente por el sistema de ventas.
        </p>

      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

/**
 * 📱 Notificación vía Telegram
 */
export const notifyOwnerViaTelegram = async (order) => {
  const {
    _id,
    orderNumber,
    createdAt,
    customer,
    items,
    totals,
    shipping,
    customerNote,
  } = order;

  const formattedDate = new Date(createdAt).toLocaleString("es-MX");

  const itemsList = items
    .map((i) => `• ${i.quantity}x ${i.name} — $${i.subtotal.toLocaleString()}`)
    .join("\n");

  const message =
    `💰 *NUEVA VENTA*\n` +
    `━━━━━━━━━━━━━━\n` +
    `🆔 Orden: \`${orderNumber}\`\n` +
    `📅 Fecha: ${formattedDate}\n` +
    `💵 Total: *$${totals.total.toLocaleString()} ${totals.currency}*\n\n` +
    `👤 *Cliente*\n` +
    `Nombre: ${customer.name}\n` +
    `Tel: ${customer.phone}\n` +
    `Email: ${customer.email}\n\n` +
    `📦 *Productos*\n${itemsList}\n\n` +
    `📍 *Envío*\n` +
    `${shipping.address}\n` +
    `${shipping.city}, ${shipping.state}\n` +
    `CP: ${shipping.zip}\n\n` +
    (customerNote ? `📝 *Nota del cliente*\n${customerNote}\n\n` : "") +
    `🗂 ID Interno: ${_id}`;

  const telegramUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;

  return axios.post(telegramUrl, {
    chat_id: process.env.TELEGRAM_CHAT_ID,
    text: message,
  });
};

/**
 * 📧 Envía correo de confirmación de ENVÍO con número de guía
 */

export const sendShippingEmail = async (order) => {
  const { orderNumber, customer, shipping } = order;

  let trackingUrl = "#";
  const carrier = shipping.carrier?.toLowerCase() || "";

  if (carrier.includes("dhl")) {
    trackingUrl = `https://www.dhl.com/en/express/tracking.html?AWB=${shipping.trackingNumber}`;
  } else if (carrier.includes("fedex")) {
    trackingUrl = `https://www.fedex.com/apps/fedextrack/?tracknumbers=${shipping.trackingNumber}`;
  } else if (carrier.includes("estafeta")) {
    trackingUrl = `https://www.estafeta.com/Herramientas/Rastreo?waybill=${shipping.trackingNumber}`;
  }

  const mailOptions = {
    from: `"Palmarito Bacanora" <${process.env.EMAIL_USER}>`,
    to: customer.email,
    subject: `🚚 Tu pedido ${orderNumber} ya va en camino`,
    html: `
  <div style="font-family: Arial, Helvetica, sans-serif; background-color:#f4f4f4; padding:30px 0;">
    <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,0.05);">

      <!-- HEADER -->
      <div style="background:#111827; padding:25px; text-align:center;">
        <h1 style="color:#ffffff; margin:0; font-size:24px;">🍶 Palmarito Bacanora</h1>
        <p style="color:#9ca3af; margin-top:8px; font-size:14px;">
          Tradición que se envía hasta tu puerta
        </p>
      </div>

      <!-- BODY -->
      <div style="padding:30px; color:#333;">
        <h2 style="margin-top:0; color:#1f2937;">¡Tu pedido va en camino!</h2>

        <p>Hola <strong>${customer.name}</strong>,</p>

        <p>
          Nos complace informarte que tu pedido
          <strong>#${orderNumber}</strong>
          ya fue despachado y se encuentra en manos de la paquetería.
        </p>

        <!-- SHIPPING INFO -->
        <div style="background:#f9fafb; border:1px solid #e5e7eb; border-radius:8px; padding:20px; margin:25px 0; text-align:center;">
          <p style="margin:0; font-size:13px; color:#6b7280;">Paquetería</p>
          <p style="margin:6px 0 14px; font-size:18px; font-weight:bold;">
            ${shipping.carrier?.toUpperCase()}
          </p>

          <p style="margin:0; font-size:13px; color:#6b7280;">Número de guía</p>
          <p style="margin:6px 0; font-size:22px; font-weight:bold; letter-spacing:1px;">
            ${shipping.trackingNumber}
          </p>
        </div>

        <!-- CTA -->
        <div style="text-align:center; margin:35px 0;">
          <a href="${trackingUrl}" target="_blank"
            style="background:#111827; color:#ffffff; padding:14px 32px; border-radius:6px; text-decoration:none; font-size:16px; font-weight:bold; display:inline-block;">
            Rastrear mi pedido
          </a>
          <p style="font-size:12px; color:#6b7280; margin-top:12px;">
            El movimiento puede reflejarse en las próximas 24–48 horas
          </p>
        </div>

        <p style="margin-top:30px;">
          Gracias por apoyar un producto artesanal mexicano 🇲🇽  
          Esperamos que disfrutes cada copa.
        </p>

        <p style="margin-top:25px;">
          — Equipo <strong>Palmarito Bacanora</strong>
        </p>
      </div>

      <!-- FOOTER -->
      <div style="background:#f9fafb; padding:20px; text-align:center; font-size:12px; color:#9ca3af;">
        <p style="margin:0;">
          ¿Tienes dudas? Responde este correo o contáctanos por WhatsApp.
        </p>
        <p style="margin-top:8px;">
          © ${new Date().getFullYear()} Palmarito Bacanora
        </p>
      </div>

    </div>
  </div>
  `,
  };
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Correo enviado correctamente. ID:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Error real en Nodemailer:", error);
    throw error;
  }
};

/**
 * 📱 Alerta de inventario bajo vía Telegram
 */
export const notifyLowStock = async (product) => {
  const isExhausted = product.countInStock <= 0;

  const message = isExhausted
    ? `🚫 *¡PRODUCTO AGOTADO!*\n` +
      `━━━━━━━━━━━━━━\n` +
      `🍶 Producto: *${product.name}*\n` +
      `❌ Stock actual: \`0\` unidades\n\n` +
      `❗ *URGENTE:* El producto ya no está disponible para la venta.`
    : `⚠️ *ALERTA DE STOCK BAJO*\n` +
      `━━━━━━━━━━━━━━\n` +
      `🍶 Producto: *${product.name}*\n` +
      `📉 Stock actual: \`${product.countInStock}\` unidades\n\n` +
      `👉 Sugerencia: Reponer pronto.`;

  const telegramUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;

  return axios.post(telegramUrl, {
    chat_id: process.env.TELEGRAM_CHAT_ID,
    text: message,
    parse_mode: "Markdown",
  });
};

export const sendOrderConfirmationEmail = async (order, pdfBuffer) => {
  // 1. Configuración del transporte (usa tus credenciales de Mailtrap, Gmail, etc.)
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: '"Palmarito Bacanora" <ventas@palmaritobacanora.com>',
    to: order.customer.email,
    subject: `Confirmación de tu Orden #${order.orderNumber}`,
    html: `
      <h1>¡Gracias por tu compra, ${order.customer.name}!</h1>
      <p>Hemos recibido tu pago correctamente para la orden <b>${order.orderNumber}</b>.</p>
      <p>Adjunto a este correo encontrarás tu recibo oficial en PDF.</p>
      <br>
      <p>Saludos,<br>El equipo de Palmarito Bacanora</p>
    `,
    // 📎 AQUÍ ESTÁ LA MAGIA:
    attachments: [
      {
        filename: `Recibo-${order.orderNumber}.pdf`,
        content: pdfBuffer, // Aquí pasamos el buffer que generó pdfkit
        contentType: "application/pdf",
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 Correo de confirmación enviado a: ${order.customer.email}`);
  } catch (error) {
    console.error("❌ Error enviando correo:", error);
  }
};
