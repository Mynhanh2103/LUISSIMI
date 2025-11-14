import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  name: String,
  price: Number,
  quantity: Number,
  image: String,
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  items: [orderItemSchema],
  shippingAddress: {
    fullName: String,
    address: String,
    city: String,
    postalCode: String,
    country: String,
  },
  totalPrice: Number,
  paymentResult: {
    id: String,
    status: String,
    update_time: String,
    email_address: String,
  },
  status: { type: String, default: "pending" }, // pending, paid, shipped, completed, cancelled
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Order", orderSchema);
