// src/components/ProductCard.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingBag } from "lucide-react";
import api from "../api/axios";

export default function ProductCard({
  product,
  onQuickView,
  isLiked,
  onWishlist,
}) {
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);

  // SỬA: Cấu trúc ảnh từ Django
  const img =
    product?.images?.[0]?.image || product?.image || "/placeholder.png";

  // ProductCard.jsx

  // SỬA: Hàm này bây giờ chỉ nhận product, không nhận event nữa
  const handleAddToCart = async (product) => {
    setAdding(true);
    try {
      const token = localStorage.getItem("token");
      if (token) {
        // Gửi lên Django
        await api.post("/cart/add/", {
          productId: product.id,
          quantity: 1,
        });
        alert("🛒 Đã thêm vào giỏ hàng hệ thống!");
      } else {
        // Lưu LocalStorage cho khách
        let localCart = JSON.parse(localStorage.getItem("local_cart") || "[]");
        const existing = localCart.find(
          (item) => item.product.id === product.id
        );
        if (existing) {
          existing.quantity += 1;
        } else {
          localCart.push({ product: product, quantity: 1, id: Date.now() });
        }
        localStorage.setItem("local_cart", JSON.stringify(localCart));
        alert("🛍️ Đã thêm vào giỏ hàng!");
      }
    } catch (err) {
      alert("Không thể thêm vào giỏ hàng.");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="group flex flex-col bg-white rounded-sm overflow-hidden border border-stone-100 transition-all hover:shadow-xl relative">
      {/* Khung ảnh */}
      <div className="relative aspect-[3/4] overflow-hidden bg-stone-50">
        <Link to={`/product/${product.id}`}>
          <img
            src={img}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </Link>

        {/* Nút Tim */}
        <button
          onClick={onWishlist}
          className="absolute top-3 right-3 z-20 p-2 bg-white/40 backdrop-blur-md rounded-full hover:bg-white transition-all"
        >
          <Heart
            size={18}
            className={isLiked ? "fill-red-500 text-red-500" : "text-stone-600"}
          />
        </button>

        {/* Nút Xem nhanh (Hiện khi hover) */}
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
          <button
            onClick={() => onQuickView(product)}
            className="bg-white text-stone-900 px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all"
          >
            Xem nhanh
          </button>
        </div>
      </div>

      {/* Thông tin chữ */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <Link to={`/product/${product.id}`}>
            <h3 className="font-playfair font-bold text-stone-800 text-lg hover:text-[#8B5E34] transition-colors">
              {product.name}
            </h3>
          </Link>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleAddToCart(product); // Gọi hàm với đối tượng product
            }}
            disabled={adding}
            className="text-stone-400 hover:text-stone-900 transition-colors"
          >
            <ShoppingBag size={18} />
          </button>
        </div>
        <p className="text-[#8B5E34] font-bold tracking-tight">
          {Number(product.price).toLocaleString()}₫
        </p>
      </div>
    </div>
  );
}
