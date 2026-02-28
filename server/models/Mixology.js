import mongoose from "mongoose";
import { optimizeUrl } from "../utils/cloudinaryOptimizer.js";

const mixologySchema = mongoose.Schema(
  {
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
    image: {
      type: String,
      required: true,
    },
    ingredients: [
      {
        item: { type: String, required: true },
        measure: { type: String },
      },
    ],
    preparation: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

mixologySchema.set("toJSON", {
  transform: (doc, ret) => {
    if (ret.image) {
      // QUITAMOS el 800. Solo optimizamos formato y calidad.
      ret.image = optimizeUrl(ret.image);
    }
    return ret;
  },
});

const Mixology = mongoose.model("Mixology", mixologySchema);
export default Mixology;
