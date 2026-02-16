import mongoose from "mongoose";

const AuditLogSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdminUser",
      required: true,
    },
    action: { type: String, required: true }, // Ej: "ACTUALIZAR_GUIA", "CAMBIAR_PRECIO", "ELIMINAR_PRODUCTO"
    module: { type: String, required: true }, // Ej: "Envíos", "Productos", "Mixología"
    targetId: { type: String }, // El ID o número de orden afectado
    details: { type: Object }, // Datos técnicos (ej: { precioViejo: 500, precioNuevo: 600 })
    ip: { type: String },
  },
  { timestamps: true },
);

// Índice para buscar rápido por fecha o acción
AuditLogSchema.index({ createdAt: -1 });
AuditLogSchema.index({ action: 1 });

export default mongoose.model("AuditLog", AuditLogSchema);
