import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, uppercase: true },
    expiry: { type: String, required: true },
    discount: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Coupon", couponSchema);
