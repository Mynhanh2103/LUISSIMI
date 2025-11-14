import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  authMiddleware,
  adminMiddleware,
} from "../middleware/authMiddleware.js";
const router = express.Router();

// API Đăng ký người dùng mới
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email đã được sử dụng" });

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Plain password:", password);
    console.log("Hashed password:", hashedPassword);

    const newUser = new User({
      username,
      email,
      password,
    });

    await newUser.save();
    res.status(201).json({ message: "Tạo tài khoản thành công!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ✅ API Đăng nhập
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Không tìm thấy người dùng" });

    console.log("User found:", user);
    console.log("Request password:", password);
    console.log("Stored password (in DB):", user.password);
    console.log("Password from request:", password);
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Compare result:", isMatch);

    if (!isMatch)
      return res.status(400).json({ message: "Mật khẩu không chính xác" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token, message: "Đăng nhập thành công" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * 👤 Xem thông tin admin hiện tại
 */
router.get("/me", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const admin = await User.findById(req.user.id).select("-password");
    res.json(admin);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * ✏️ Cập nhật thông tin admin hiện tại
 */
router.put("/profile", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const updates = req.body;

    // Nếu có password mới thì mã hoá lại
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const updated = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select(
      "-password"
    );
    res.json({ message: "Cập nhật thông tin thành công", updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
