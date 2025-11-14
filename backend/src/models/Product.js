import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema({
  url: String,
  publicId: String,
  alt: String,
});

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true },
  description: String,
  price: { type: Number, required: true },
  currency: { type: String, default: "VND" },
  images: [{ url: String, public_id: String }], // lưu url và public_id Cloudinary
  category: String,
  tags: [String],
  stock: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ["draft", "published", "active"],
    default: "draft",
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Product", ProductSchema);
