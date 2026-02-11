import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true,
    },
    provider: {
      type: String,
      enum: ["stripe", "paypal", "mercadopago"],
      required: true,
    },
    intentId: {
      type: String,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "MXN",
    },
    status: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    rawEventId: String,
  },
  { timestamps: true },
);

PaymentSchema.index({ provider: 1, status: 1 });
PaymentSchema.index({ createdAt: -1 });

const Payment = mongoose.model("Payment", PaymentSchema);
export default Payment;
