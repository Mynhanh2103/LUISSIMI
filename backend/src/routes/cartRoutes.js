import express from "express";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get user's cart
router.get("/", authMiddleware, async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate(
    "items.product"
  );
  res.json(cart || { items: [] });
});

// Add / update item
router.post(
  "/add",
  /*authMiddleware*/ async (req, res) => {
    const { productId, quantity = 1 } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const index = cart.items.findIndex(
      (i) => i.product.toString() === productId
    );
    if (index > -1) {
      cart.items[index].quantity += Number(quantity);
    } else {
      cart.items.push({
        product: productId,
        quantity: Number(quantity),
        priceAtAdd: product.price,
      });
    }
    cart.updatedAt = Date.now();
    await cart.save();
    res.json({ message: "Added to cart", cart });
  }
);
router.put("/:productId", authMiddleware, async (req, res) => {
  try {
    const { quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Giỏ hàng trống" });

    const item = cart.items.find(
      (i) => i.product.toString() === req.params.productId
    );
    if (!item)
      return res
        .status(404)
        .json({ message: "Không tìm thấy sản phẩm trong giỏ" });

    item.quantity = quantity; // cập nhật số lượng mới
    await cart.save();

    res.json({ message: "Cập nhật giỏ hàng thành công", cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// Remove item
router.delete("/remove/:productId", authMiddleware, async (req, res) => {
  const { productId } = req.params;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return res.status(404).json({ message: "Cart not found" });

  cart.items = cart.items.filter((i) => i.product.toString() !== productId);
  await cart.save();
  res.json({ message: "Removed", cart });
});

// Clear cart
router.delete("/clear", authMiddleware, async (req, res) => {
  await Cart.findOneAndDelete({ user: req.user._id });
  res.json({ message: "Cart cleared" });
});

export default router;
