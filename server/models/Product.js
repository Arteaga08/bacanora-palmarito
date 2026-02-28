import mongoose from "mongoose";
import { optimizeUrl } from "../utils/cloudinaryOptimizer.js";

const productSchema = mongoose.Schema(
  {
    // El admin que creó el producto (referencia al único usuario)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    images: {
      cardPrimary: { type: String, required: true }, // Imagen principal
      cardHover: { type: String }, // Efecto hover en el catálogo
      displayDetail: { type: String }, // Imagen en alta resolución para detalle
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    ingredients: [{ type: String }],
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    volume: {
      type: String,
      required: true,
      default: "750 ML",
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
    isAvailable: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

productSchema.set("toJSON", {
  transform: (doc, ret) => {
    if (ret.images) {
      // Optimizamos cada imagen según su uso
      ret.images.cardPrimary = optimizeUrl(ret.images.cardPrimary);
      ret.images.cardHover = optimizeUrl(ret.images.cardHover);
      ret.images.displayDetail = optimizeUrl(ret.images.displayDetail);
    }
    return ret;
  },
});

const Product = mongoose.model("Product", productSchema);
export default Product;
