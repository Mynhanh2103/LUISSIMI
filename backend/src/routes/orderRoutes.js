import express from "express";
import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import {
  authMiddleware,
  adminMiddleware,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// Create order from cart
router.post("/", authMiddleware, async (req, res) => {
  const { shippingAddress, paymentMethod } = req.body;
  const cart = await Cart.findOne({ user: req.user._id }).populate(
    "items.product"
  );
  if (!cart || cart.items.length === 0)
    return res.status(400).json({ message: "Cart empty" });

  const items = cart.items.map((i) => ({
    product: i.product._id,
    name: i.product.name,
    price: i.product.price,
    quantity: i.quantity,
    image: i.product.images?.[0]?.url || "",
  }));

  const totalPrice = items.reduce((s, it) => s + it.price * it.quantity, 0);

  const order = new Order({
    user: req.user._id,
    items,
    shippingAddress,
    totalPrice,
    status: "pending",
  });

  await order.save();
  // Optionally clear cart
  await Cart.findOneAndDelete({ user: req.user._id });

  res.status(201).json({ message: "Order created", order });
});

// Get user's orders
router.get("/", authMiddleware, async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({
    createdAt: -1,
  });
  res.json(orders);
});

// Admin: get all orders
router.get("/admin/all", authMiddleware, adminMiddleware, async (req, res) => {
  const orders = await Order.find()
    .populate("user", "email username")
    .sort({ createdAt: -1 });
  res.json(orders);
});

// Admin: update order status
router.patch(
  "/:id/status",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    order.status = status;
    await order.save();
    res.json({ message: "Order updated", order });
  }
);

export default router;
