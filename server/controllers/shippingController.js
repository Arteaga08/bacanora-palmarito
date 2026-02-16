import Order from "../models/Order.js";
import AuditLog from "../models/AuditLog.js"; // 👈 Importamos el log
import { sendShippingEmail } from "../services/notificationService.js";

export const updateTracking = async (req, res) => {
  const { orderNumber } = req.params;
  const { carrier, trackingNumber } = req.body;

  try {
    const order = await Order.findOne({ orderNumber });
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    // 🕵️‍♂️ CAPTURE PREVIOUS STATE (Before update)
    const previousState = {
      carrier: order.shipping.carrier || "None",
      trackingNumber: order.shipping.trackingNumber || "None",
    };

    // Update the order
    order.status = "Enviado";
    order.shipping.carrier = carrier;
    order.shipping.trackingNumber = trackingNumber;
    order.shipping.shippedAt = Date.now();

    const updatedOrder = await order.save();

    // 📝 CREATE AUDIT LOG WITH DIFF
    const auditEntry = await AuditLog.create({
      adminId: req.user._id,
      action: "UPDATE_SHIPPING_GUIDE",
      module: "Shipping",
      targetId: orderNumber,
      details: {
        from: previousState, // Old data
        to: { carrier, trackingNumber }, // New data
      },
      ip: req.ip,
    });

    console.log(
      `✅ Audit Log saved. Changed ${previousState.carrier} -> ${carrier}`,
    );

    await sendShippingEmail(updatedOrder);

    res.json({
      message: "Shipping updated and change recorded.",
      auditId: auditEntry._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
