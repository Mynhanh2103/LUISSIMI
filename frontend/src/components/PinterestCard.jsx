import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Share2, MoreHorizontal } from "lucide-react";
import HeartAnimation from "./HeartAnimation";

export default function PinterestCard({ product }) {
  const [showHeart, setShowHeart] = useState(false);
  const [liked, setLiked] = useState(false);

  // Lấy ảnh từ mảng images của Django
  const imageSrc =
    product.images?.[0]?.image ||
    product.image ||
    "https://placehold.co/400x600";

  const handleDoubleClick = () => {
    setShowHeart(true);
    setLiked(true);
  };

  return (
    <div className="mb-6 break-inside-avoid group relative">
      <div
        className="relative rounded-2xl overflow-hidden bg-stone-100 cursor-zoom-in shadow-sm hover:shadow-xl transition-shadow duration-300"
        onDoubleClick={handleDoubleClick}
      >
        <Link to={`/product/${product.id}`}>
          <img
            src={imageSrc}
            alt={product.name}
            className="w-full h-auto object-cover block"
          />
        </Link>

        {/* Overlay xuất hiện khi hover */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-between pointer-events-none">
          <div className="flex justify-end pointer-events-auto">
            <button className="bg-red-600 text-white px-4 py-2 rounded-full font-bold text-sm hover:bg-red-700 transition">
              Lưu
            </button>
          </div>
          <div className="flex justify-between items-center pointer-events-auto">
            <div className="flex space-x-2">
              <button className="bg-white/90 p-2 rounded-full hover:bg-white transition">
                <Share2 size={16} />
              </button>
              <button className="bg-white/90 p-2 rounded-full hover:bg-white transition">
                <MoreHorizontal size={16} />
              </button>
            </div>
          </div>
        </div>

        <HeartAnimation
          show={showHeart}
          onAnimationEnd={() => setShowHeart(false)}
        />
      </div>

      {/* Thông tin sản phẩm bên dưới ảnh */}
      <div className="mt-2 px-1 flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-sm font-bold text-stone-800 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-xs text-stone-500">
            {Number(product.price).toLocaleString()}₫
          </p>
        </div>
        <button
          onClick={() => setLiked(!liked)}
          className={liked ? "text-red-500" : "text-stone-400"}
        >
          <Heart size={18} fill={liked ? "currentColor" : "none"} />
        </button>
      </div>
    </div>
  );
}
