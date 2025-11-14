import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import productRoutes from "./routes/productRoutes.js";
import photoProductRoutes from "./routes/photoProductRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
dotenv.config();
const app = express();
const frontendURL = process.env.FRONTEND_URL || "http://localhost:5173"; // 5173 là port default của Vite

app.use(
  cors({
    origin: frontendURL, // Chỉ cho phép URL này gọi API
  })
);
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected", mongoose.connection.name);
    console.log("📂 Database name:", mongoose.connection.db.databaseName);
  })
  .catch((err) => console.error(err));

app.use("/api/products", productRoutes);
app.use("/api/admin/products", photoProductRoutes); //uploaad arnh sarn pham
app.use("/api/admin/upload", uploadRoutes); // route upload chung (nếu bạn muốn upload ảnh độc lập)
app.use("/api/admin/auth", authRoutes);
// 🧺 Cart routes
app.use("/api/cart", cartRoutes);
// 🧾 Order routes
app.use("/api/orders", orderRoutes);
// 🛠 Admin routes (quản lý user, đơn hàng, thống kê,...)
app.use("/api/admin", adminRoutes);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//console.log("🟢 Running from directory:", process.cwd());
//console.log("🟢 Using .env from:", process.env.MONGO_URI);
