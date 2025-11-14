import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Xác thực người dùng qua token
export const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res
      .status(401)
      .json({ message: "Không có token, truy cập bị từ chối" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (err) {
    res.status(400).json({ message: "Token không hợp lệ" });
  }
};

// Chỉ cho phép admin truy cập
export const adminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Chỉ admin mới được phép truy cập" });
  }
  next();
};
