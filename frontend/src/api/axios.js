// src/api/axios.js
import axios from "axios";

const api = axios.create({
  // Lấy từ file .env, nếu không thấy thì dùng mặc định localhost:8000
  baseURL: import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : "http://127.0.0.1:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
