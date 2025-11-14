import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// Thư mục lưu ảnh
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Cấu hình Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// API Upload
router.post("/", upload.single("image"), (req, res) => {
  if (!req.file)
    return res.status(400).json({ message: "Không có file tải lên" });

  res.status(200).json({
    message: "Tải ảnh thành công!",
    imageUrl: `/uploads/${req.file.filename}`,
  });
});

export default router;
