import mongoose from "mongoose";

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

const Mixology = mongoose.model("Mixology", mixologySchema);
export default Mixology;
