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
app.use(cors());
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
app.listen(3000, () => console.log("Server running on port 3000"));
//console.log("🟢 Running from directory:", process.cwd());
//console.log("🟢 Using .env from:", process.env.MONGO_URI);
