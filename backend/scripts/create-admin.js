import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../src/models/User.js";
dotenv.config();

await mongoose.connect(process.env.MONGO_URI);
const admin = new User({
  email: "admin@gmail.com",
  password: "123456",
  role: "admin",
});
await admin.save();
console.log("Admin created");
mongoose.disconnect();
