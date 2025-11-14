import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

// Hàm định dạng tiền tệ
const formatCurrency = (amount) => {
  if (typeof amount !== "number") {
    amount = Number(amount) || 0;
  }
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

// Component nhận thêm prop "onQuickView" (có thể có hoặc không)
export default function ProductCard({ product, onQuickView }) {
  const [adding, setAdding] = useState(false);
  const navigate = useNavigate();

  const img = product?.images?.[0]?.url || product?.image || "/placeholder.png";

  const addToCart = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    setAdding(true);
    try {
      await api.post("/cart/add", {
        productId: product._id,
        quantity: 1,
      });
      alert("Đã thêm vào giỏ hàng!");
    } catch (e) {
      console.error("❌ Lỗi khi thêm vào giỏ:", e.response?.data || e.message);
      alert(e?.response?.data?.message || "Không thể thêm vào giỏ hàng.");
    } finally {
      setAdding(false);
    }
  };

  // Hàm xử lý khi nhấn nút "Xem nhanh"
  const handleQuickView = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (onQuickView) {
      onQuickView(product); // Gọi hàm onQuickView từ cha
    }
  };

  return (
    <article className="bg-[var(--card)] rounded-2xl overflow-hidden shadow-sm border border-[rgba(255,255,255,0.06)] h-full flex flex-col">
      {/* Ảnh sản phẩm */}
      <div className="relative bg-[var(--muted-2)] group">
        <Link to={`/product/${product._id}`} className="block">
          <div className="w-full aspect-square flex items-center justify-center overflow-hidden">
            <img
              src={img}
              alt={product?.name}
              className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
              loading="lazy"
            />
          </div>
        </Link>

        {/* --- DÀNH CHO DESKTOP (Hover Effect) --- */}
        <div
          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 
                     hidden md:flex flex-col justify-center items-center gap-3"
        >
          {/* ▼▼▼ ĐÃ SỬA LẠI ▼▼▼ */}
          {/* Nếu có onQuickView, hiển thị "Xem nhanh" */}
          {onQuickView ? (
            <button
              onClick={handleQuickView}
              className="bg-white text-stone-900 text-sm px-5 py-2.5 rounded-full shadow-md hover:bg-stone-200 transition"
            >
              Xem nhanh
            </button>
          ) : (
            // Nếu không, hiển thị "Xem chi tiết"
            <button
              onClick={() => navigate(`/product/${product._id}`)}
              className="bg-white text-stone-900 text-sm px-5 py-2.5 rounded-full shadow-md hover:bg-stone-200 transition"
            >
              Xem chi tiết
            </button>
          )}
          {/* ▲▲▲ HẾT PHẦN SỬA ▲▲▲ */}

          <button
            onClick={addToCart}
            disabled={adding}
            className="bg-[var(--accent,#c29200)] text-white text-sm px-5 py-2.5 rounded-full shadow-md hover:bg-[#a57a00] transition disabled:opacity-50"
          >
            {adding ? "Đang thêm..." : "Thêm vào giỏ"}
          </button>
        </div>
      </div>

      {/* Meta (Thông tin bên dưới) */}
      <div className="p-4 flex flex-col flex-grow">
        <Link to={`/product/${product._id}`}>
          <h3 className="text-[var(--text)] font-medium line-clamp-1">
            {product?.name}
          </h3>
        </Link>
        <p className="text-[var(--muted)] text-sm mt-1 line-clamp-2 min-h-[40px]">
          {product?.description}
        </p>

        <div className="mt-auto pt-3">
          <span className="text-[var(--accent)] font-semibold text-lg">
            {formatCurrency(product?.price)}
          </span>
        </div>

        {/* --- DÀNH CHO MOBILE (Luôn hiện) --- */}
        <div className="mt-3 flex items-center justify-between md:hidden">
          <Link
            to={`/product/${product._id}`}
            className="px-3 py-2 text-sm rounded-md border border-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.04)]"
          >
            Chi tiết
          </Link>
          <button
            onClick={addToCart}
            disabled={adding}
            className="px-3 py-2 text-sm rounded-md bg-[var(--accent)] text-white hover:opacity-90 disabled:opacity-60"
          >
            {adding ? "Đang thêm..." : "Thêm vào giỏ"}
          </button>
        </div>
      </div>
    </article>
  );
}
