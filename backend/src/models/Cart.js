import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, default: 1 },
  priceAtAdd: { type: Number }, // optional snapshot
});

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
  items: [itemSchema],
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Cart", cartSchema);
