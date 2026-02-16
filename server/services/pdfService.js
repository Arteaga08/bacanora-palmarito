import PDFDocument from "pdfkit";

/**
 * 📄 Genera un recibo profesional en PDF para una orden
 * @param {Object} order - Documento de la orden desde MongoDB
 */
export const generateOrderReceipt = (order) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: "A4" });
    const buffers = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);

    /* =========================
       🟤 HEADER / BRANDING
       ========================= */

    doc
      .font("Helvetica-Bold")
      .fontSize(22)
      .fillColor("#1a202c")
      .text("PALMARITO BACANORA", { align: "center" })
      .moveDown(0.3);

    doc
      .font("Helvetica")
      .fontSize(10)
      .fillColor("#4a5568")
      .text("Bacanora artesanal · Denominación de origen · Sonora, México", {
        align: "center",
      });

    doc.moveDown(1.5);
    doc.moveTo(50, 110).lineTo(545, 110).strokeColor("#e2e8f0").stroke();

    /* =========================
       📦 INFO DE LA ORDEN
       ========================= */

    doc.moveDown(1.5).fillColor("#000");

    doc.font("Helvetica-Bold").fontSize(11).text("RECIBO DE COMPRA", 50, 130);

    doc
      .font("Helvetica")
      .fontSize(10)
      .text(`Número de orden: ${order.orderNumber}`)
      .text(`Fecha: ${new Date(order.createdAt).toLocaleDateString("es-MX")}`)
      .text(`Estado: ${order.status}`)
      .moveDown();

    doc
      .font("Helvetica-Bold")
      .text("Cliente:")
      .font("Helvetica")
      .text(order.customer.name)
      .text(order.customer.email)
      .moveDown();

    /* =========================
       🧾 TABLA DE PRODUCTOS
       ========================= */

    const tableTop = 240;

    doc.font("Helvetica-Bold").fontSize(10);
    doc.text("Producto", 50, tableTop);
    doc.text("Cant.", 300, tableTop, { width: 50, align: "center" });
    doc.text("Precio", 380, tableTop, { width: 80, align: "right" });
    doc.text("Subtotal", 470, tableTop, { width: 75, align: "right" });

    doc
      .moveTo(50, tableTop + 15)
      .lineTo(545, tableTop + 15)
      .strokeColor("#cbd5e0")
      .stroke();

    doc.font("Helvetica").fontSize(10);

    let rowY = tableTop + 30;

    order.items.forEach((item) => {
      doc.text(item.name, 50, rowY, { width: 230 });
      doc.text(item.quantity.toString(), 300, rowY, {
        width: 50,
        align: "center",
      });
      doc.text(`$${item.price.toFixed(2)}`, 380, rowY, {
        width: 80,
        align: "right",
      });
      doc.text(`$${item.subtotal.toFixed(2)}`, 470, rowY, {
        width: 75,
        align: "right",
      });
      rowY += 22;
    });

    /* =========================
       💰 TOTALES
       ========================= */

    rowY += 10;
    doc.moveTo(350, rowY).lineTo(545, rowY).stroke();

    doc
      .font("Helvetica")
      .fontSize(10)
      .text("Subtotal:", 350, rowY + 10, { width: 120, align: "right" })
      .text(`$${order.totals.subtotal.toFixed(2)}`, 470, rowY + 10, {
        width: 75,
        align: "right",
      });

    if (order.totals.shipping > 0) {
      doc
        .text("Envío:", 350, rowY + 28, { width: 120, align: "right" })
        .text(`$${order.totals.shipping.toFixed(2)}`, 470, rowY + 28, {
          width: 75,
          align: "right",
        });
    }

    doc
      .font("Helvetica-Bold")
      .fontSize(13)
      .text("TOTAL:", 350, rowY + 55, { width: 120, align: "right" })
      .text(`$${order.totals.total.toFixed(2)} MXN`, 470, rowY + 55, {
        width: 75,
        align: "right",
      });

    /* =========================
       📍 ENVÍO
       ========================= */

    doc.moveDown(4);

    doc.font("Helvetica-Bold").fontSize(10).text("Dirección de envío:");

    doc
      .font("Helvetica")
      .text(order.shipping.address)
      .text(
        `${order.shipping.city}, ${order.shipping.state}, C.P. ${order.shipping.zip}`,
      )
      .text(order.shipping.country || "México");

    /* =========================
       🟤 FOOTER
       ========================= */

    doc
      .fontSize(9)
      .fillColor("#718096")
      .text(
        "Gracias por tu compra. Si tienes dudas sobre tu pedido, contáctanos.",
        50,
        740,
        {
          align: "center",
          width: 495,
        },
      );

    doc.end();
  });
};
