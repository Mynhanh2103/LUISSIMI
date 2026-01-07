// src/components/QuickViewModal.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Dùng Link thay cho thẻ <a> để tránh load trang
import { X, ShoppingBag, ArrowRight } from "lucide-react";
import api from "../api/axios";

export default function QuickViewModal({ open, product, onClose }) {
  const [index, setIndex] = useState(0);

  // SỬA: Cấu trúc ảnh Django là { image: "url" }
  const images = product?.images?.length
    ? product.images.map((i) => i.image)
    : product?.image
    ? [product.image]
    : ["/placeholder.png"];

  useEffect(() => {
    if (open) setIndex(0);
  }, [open, product?.id]); // Sửa từ _id thành id

  if (!open || !product) return null;

  const addToCart = async () => {
    try {
      // SỬA: Endpoint chuẩn là /cart/add/ và field là productId
      await api.post("/cart/add/", { productId: product.id, quantity: 1 });
      alert("🛒 Đã thêm vào giỏ hàng!");
      onClose();
    } catch (e) {
      alert("Vui lòng đăng nhập để thêm vào giỏ.");
    }
  };

  return (
    <div className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl rounded-sm overflow-hidden shadow-2xl flex flex-col md:flex-row relative">
        {/* Nút đóng */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 bg-stone-100 rounded-full hover:bg-stone-200"
        >
          <X size={20} />
        </button>

        {/* CỘT TRÁI: Ảnh (Sửa lỗi hiển thị) */}
        <div className="md:w-1/2 bg-stone-50 aspect-[4/5] overflow-hidden">
          <img
            src={images[index]}
            alt={product?.name}
            className="w-full h-full object-cover transition-all duration-500"
          />
        </div>

        {/* CỘT PHẢI: Thông tin */}
        <div className="md:w-1/2 p-8 flex flex-col justify-center bg-white">
          <span className="text-[#8B5E34] text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block">
            {product?.category || "LUISSIMI EXCLUSIVE"}
          </span>
          <h3 className="text-3xl font-playfair font-bold text-stone-800 mb-4 italic">
            {product?.name}
          </h3>
          <div className="text-[#4E342E] text-2xl font-bold mb-6">
            {Number(product?.price || 0).toLocaleString()}₫
          </div>

          <p className="text-stone-500 text-sm leading-relaxed mb-8 italic">
            {product?.description ||
              "Chế tác thủ công từ chất liệu da cao cấp nhất."}
          </p>

          {/* Thumbnails */}
          <div className="grid grid-cols-5 gap-2 mb-8">
            {images.map((src, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`aspect-square rounded-sm overflow-hidden border-2 transition-all ${
                  index === i
                    ? "border-[#8B5E34] scale-105"
                    : "border-transparent opacity-60"
                }`}
              >
                <img
                  src={src}
                  className="w-full h-full object-cover"
                  alt="thumbnail"
                />
              </button>
            ))}
          </div>

          <div className="flex gap-4">
            <button
              onClick={addToCart}
              className="flex-1 bg-stone-900 text-white py-4 rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-[#8B5E34] transition-all flex items-center justify-center gap-2"
            >
              <ShoppingBag size={14} /> Thêm vào giỏ
            </button>
            <Link
              to={`/product/${product.id}`} // SỬA: Dùng id thay vì _id để tránh 404
              onClick={onClose}
              className="flex-1 border border-stone-200 text-stone-800 py-4 rounded-full font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-stone-50"
            >
              Chi tiết <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
