import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "luissimi/products",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
    transformation: [{ width: 1600, crop: "limit" }],
  },
});

export const upload = multer({ storage });
