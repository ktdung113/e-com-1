import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true, lowercase: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: mongoose.Types.ObjectId, ref: "ProductCategory" },
    brand: { type: mongoose.Types.ObjectId, ref: "Brand" },
    quantity: { type: Number, required: true },
    sold: { type: Number, default: 0 },
    images: [],
    color: { type: Array, required: true },
    ratings: [
      {
        star: { type: Number },
        comment: { type: String },
        postedby: { type: mongoose.Types.ObjectId, ref: "User" },
      },
    ],
    totalrating: { type: String, default: 0 },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Product", productSchema);
