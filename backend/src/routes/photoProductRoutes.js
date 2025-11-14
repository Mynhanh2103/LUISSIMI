import express from "express";
import Product from "../models/Product.js";
import {
  authMiddleware,
  adminMiddleware,
} from "../middleware/authMiddleware.js";
import { upload } from "../middleware/upload.js";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

// Upload multiple images to a product
router.post(
  "/:id/images",
  authMiddleware,
  adminMiddleware,
  upload.array("images", 6),
  async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product)
        return res.status(404).json({ message: "Product not found" });

      const uploaded = req.files.map((f) => ({
        url: f.path,
        public_id: f.filename,
      }));
      product.images.push(...uploaded);
      await product.save();

      res.status(200).json({ message: "Images uploaded", images: uploaded });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// Delete an image (by public_id)
router.delete(
  "/:id/images/:public_id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { id, public_id } = req.params;
      await cloudinary.uploader.destroy(public_id);
      const product = await Product.findById(id);
      if (!product)
        return res.status(404).json({ message: "Product not found" });

      product.images = product.images.filter(
        (img) => img.public_id !== public_id
      );
      await product.save();
      res.json({ message: "Image deleted" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

export default router;
