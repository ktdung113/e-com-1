import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: mongoose.Types.ObjectId, ref: "BlogCategory" },
    description: { type: String, required: true },
    numViews: { type: Number, default: 0 },
    isLiked: { type: Boolean, default: false },
    likes: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    isDisliked: { type: Boolean, default: false },
    dislikes: [{ type: mongoose.Types.ObjectId, ref: "User" }],

    author: { type: String, default: "admin" },
    images: [],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

export default mongoose.model("Blog", blogSchema);
