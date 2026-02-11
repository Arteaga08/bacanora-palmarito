import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    // 🔢 Número de orden público (tracking)
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    // 👤 Datos del cliente (snapshot)
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },

    // 🛒 Productos comprados (snapshot inmutable)
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        slug: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
        quantity: { type: Number, required: true, min: 1 },
        subtotal: { type: Number, required: true, min: 0 },
      },
    ],

    // 💰 Totales calculados en backend
    totals: {
      subtotal: { type: Number, required: true, min: 0 },
      tax: { type: Number, default: 0, min: 0 },
      shipping: { type: Number, default: 0, min: 0 },
      total: { type: Number, required: true, min: 0 },
      currency: { type: String, default: "MXN" },
    },

    // 🚚 Información de envío
    shipping: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zip: { type: String, required: true },
      country: { type: String, default: "México" },
      references: { type: String },

      carrier: { type: String }, // DHL, Estafeta, etc.
      trackingNumber: { type: String },
      shippedAt: Date,
      deliveredAt: Date,
    },

    // 📝 Nota opcional del cliente
    customerNote: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    // 📦 Estado logístico (separado del pago)
    status: {
      type: String,
      enum: ["Pendiente", "Pagado", "Enviado", "Entregado", "Cancelado"],
      default: "Pendiente",
    },
  },
  {
    timestamps: true,
  },
);

/* ===========================
   📌 ÍNDICES PARA PERFORMANCE
   =========================== */

// Tracking rápido por número + email
OrderSchema.index({ orderNumber: 1, "customer.email": 1 });

// Listados y panel admin
OrderSchema.index({ createdAt: -1 });

export default mongoose.model("Order", OrderSchema);
