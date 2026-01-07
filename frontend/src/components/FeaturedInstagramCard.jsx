import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, ShoppingBag, ArrowRight } from "lucide-react";
import api from "../api/axios"; // Đảm bảo đã import api để gọi hàm thêm vào giỏ

export default function FeaturedInstagramCard({ product, index }) {
  const navigate = useNavigate();
  const isStaggered = index % 2 !== 0;
  const [isLiked, setIsLiked] = useState(false);

  // Hàm xử lý thêm vào giỏ hàng từ trang chủ
  const handleAddToCart = (product) => {
    const token = localStorage.getItem("token");

    if (token) {
      // TRƯỜNG HỢP 1: Đã đăng nhập -> Gửi lên Server
      api
        .post("/cart/add/", { productId: product.id, quantity: 1 })
        .then(() => alert("Đã thêm vào giỏ hàng hệ thống!"));
    } else {
      // TRƯỜNG HỢP 2: Chưa đăng nhập -> Lưu vào LocalStorage
      let localCart = JSON.parse(localStorage.getItem("local_cart") || "[]");

      // Kiểm tra sản phẩm đã có trong giỏ chưa
      const existingItem = localCart.find(
        (item) => item.product.id === product.id
      );
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        localCart.push({ product: product, quantity: 1, id: Date.now() }); // Tạm dùng Date.now làm ID
      }

      localStorage.setItem("local_cart", JSON.stringify(localCart));
      alert("Đã thêm vào giỏ hàng!");
    }
  };
  const handleWishlist = async (e) => {
    e.preventDefault(); // Ngăn chuyển trang khi nhấn vào icon tim

    const token = localStorage.getItem("token");

    // 1. Kiểm tra đăng nhập
    if (!token) {
      alert(
        "Quý khách vui lòng đăng nhập để lưu sản phẩm vào danh sách yêu thích ❤️"
      );
      navigate("/login");
      return;
    }

    try {
      // 2. Gọi API để thêm/xóa khỏi Wishlist
      // Nếu isLiked đang là false -> Thêm vào; nếu true -> Xóa đi
      const response = await api.post("/wishlist/toggle/", {
        productId: product.id,
      });

      if (response.status === 200 || response.status === 201) {
        setIsLiked(!isLiked); // Đổi màu trái tim ngay lập tức
      }
    } catch (err) {
      console.error("Lỗi Wishlist:", err);
      alert("Không thể thực hiện yêu cầu lúc này.");
    }
  };

  return (
    <div
      className={`flex flex-col w-full max-w-sm mx-auto transition-all duration-700 ${
        isStaggered ? "md:mt-64" : "md:mt-0"
      }`}
    >
      {/* Phần Ảnh Sản Phẩm */}
      <div className="bg-stone-200 aspect-[4/5] overflow-hidden shadow-sm border border-stone-100 relative group">
        <Link to={`/product/${product.id}`}>
          <img
            src={
              product.images?.[0]?.image ||
              product.image ||
              "https://placehold.co/400x500"
            }
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />
        </Link>

        {/* Nút Tim (Wishlist) - Góc trên bên phải như Instagram */}
        <button
          onClick={handleWishlist}
          className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full transition-all hover:bg-white/40"
        >
          <Heart
            size={20}
            className={`transition-colors ${
              isLiked ? "fill-red-500 text-red-500" : "text-white"
            }`}
          />
        </button>
      </div>

      {/* Phần Thông Tin Trắng (Instagram Info Box) */}
      <div className="bg-white p-6 shadow-xl -mt-10 mx-4 z-10 rounded-sm border-b-4 border-amber-700/20">
        <div className="flex justify-between items-start mb-3">
          <div>
            <span className="text-[9px] uppercase tracking-[0.2em] text-amber-700 font-bold block mb-1">
              {product.category || "LUISSIMI EXCLUSIVE"}
            </span>
            <h3 className="text-xl font-playfair font-bold text-stone-800 line-clamp-1">
              {product.name}
            </h3>
          </div>

          {/* Nút Thêm Vào Giỏ Hàng (Quick Add) */}
          <button
            onClick={() => handleAddToCart(product)}
            className="p-2 bg-stone-900 text-white rounded-full hover:bg-amber-800 transition-colors shadow-lg"
            title="Thêm vào giỏ hàng"
          >
            <ShoppingBag size={18} />
          </button>
        </div>

        <div className="flex justify-between items-center border-t border-stone-100 pt-4 mt-2">
          <p className="text-stone-600 font-bold tracking-tight">
            {Number(product.price).toLocaleString()}₫
          </p>
          <Link
            to={`/product/${product.id}`}
            className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-stone-400 hover:text-amber-800 transition-colors"
          >
            Chi tiết <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
}
