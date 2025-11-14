import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ product /*onQuickView*/ }) {
  const [adding, setAdding] = useState(false);
  const img = product?.images?.[0]?.url || product?.image || "/placeholder.png";
  //const [/*isHovered*/, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const addToCart = async () => {
    console.log("clicked"); // 🔥 thêm dòng này
    try {
      setAdding(true);
      console.log("📦 Gửi yêu cầu thêm vào giỏ:", product._id); // thêm dòng này
      const res = await api.post("/cart/add", {
        productId: product._id,
        quantity: 1,
      });
      console.log("✅ Phản hồi từ server:", res.data); // thêm dòng này
      alert("Đã thêm vào giỏ hàng!");
    } catch (e) {
      console.error("❌ Lỗi khi thêm vào giỏ:", e.response?.data || e.message); // thêm dòng này
      alert(e?.response?.data?.message || "Không thể thêm vào giỏ hàng.");
    } finally {
      setAdding(false);
    }
  };
  /*const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };*/

  return (
    
    <article className="bg-[var(--card)] rounded-2xl overflow-hidden shadow-sm border border-[rgba(255,255,255,0.06)] ">
      {/* “Khung IG”: ảnh tỷ lệ vuông, hiển thị toàn bộ sản phẩm (object-contain) */}
      <div className="relative bg-[var(--muted-2)] group">
        <div className="w-full aspect-square flex items-center justify-center overflow-hidden">
          <img
            src={img}
            alt={product?.name}
            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
            loading="lazy"
          />
        </div>
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center gap-3">
          <button
              onClick={() => navigate(`/product/${product._id}`)}
              className="bg-white text-stone-900 text-sm px-5 py-2.5 rounded-full shadow-md hover:bg-stone-200 transition"
          >
              Xem chi tiết
          </button>
          <button
              onClick={addToCart}
              disabled={adding} /* Nhớ thêm disabled={adding} */
              className="bg-[var(--accent,#c29200)] text-white text-sm px-5 py-2.5 rounded-full shadow-md hover:bg-[#a57a00] transition"
          >
              {adding ? "Đang thêm..." : "Thêm vào giỏ"} {/* Thêm logic này */}
          </button>
        </div>
      </div>
      

      {/* Meta */}
      <div className="p-4">
        <Link to={`/product/${product._id}`}>
          <h3 className="text-[var(--text)] font-medium line-clamp-1">
            {product?.name}
          </h3>
        </Link>
        <p className="text-[var(--muted)] text-sm mt-1 line-clamp-2 min-h-[40px]">
          {product?.description}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <span className="text-[var(--accent)] font-semibold">
            {Number(product?.price || 0).toLocaleString("vi-VN")}₫
          </span>

          <div className="flex gap-2">
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
        
      </div>

      
    </article>
  );
}
