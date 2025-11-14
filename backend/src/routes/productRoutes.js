import express from "express";
import Product from "../models/Product.js";
import {
  authMiddleware,
  adminMiddleware,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// 📦 Lấy tất cả sản phẩm
router.get("/", async (req, res) => {
  try {
    const {
      search,
      page = 1,
      limit = 12,
      sort,
      minPrice,
      maxPrice,
      category,
      tags,
    } = req.query;

    const filter = {};

    if (search) filter.name = { $regex: search, $options: "i" };
    if (category) filter.category = category;
    if (tags) filter.tags = { $in: tags.split(",") };
    if (minPrice || maxPrice) filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);

    // count total
    const total = await Product.countDocuments(filter);

    // sorting
    let sortObj = { createdAt: -1 };
    if (sort) {
      if (sort === "price_asc") sortObj = { price: 1 };
      if (sort === "price_desc") sortObj = { price: -1 };
      if (sort === "newest") sortObj = { createdAt: -1 };
    }

    const products = await Product.find(filter)
      .sort(sortObj)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      products,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 👀 Xem chi tiết 1 sản phẩm
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ➕ Admin thêm sản phẩm
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, description, price, image, category, stock } = req.body;
    const newProduct = new Product({
      name,
      description,
      price,
      image,
      category,
      stock,
    });
    await newProduct.save();
    res
      .status(201)
      .json({ message: "Thêm sản phẩm thành công!", product: newProduct });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✏️ Admin cập nhật sản phẩm
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ message: "Cập nhật thành công!", updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ❌ Admin xóa sản phẩm
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Đã xóa sản phẩm" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


export default router;
