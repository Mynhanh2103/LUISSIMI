import React, { useEffect, useState } from "react";
import api from "../api/axios";

export default function QuickViewModal({ open, product, onClose }) {
  const [index, setIndex] = useState(0);
  const images = product?.images?.length
    ? product.images.map((i) => i.url)
    : [product?.image].filter(Boolean);

  useEffect(() => {
    if (open) setIndex(0);
  }, [open, product?._id]);

  if (!open || !product) return null;

  const addToCart = async () => {
    try {
      await api.post("/cart", { productId: product._id, qty: 1 });
      alert("Đã thêm vào giỏ!");
      onClose?.();
    } catch (e) {
      alert(e?.response?.data?.message || "Không thể thêm vào giỏ.");
    }
  };

  return (
    <div className="fixed inset-0 z-[999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[var(--card)] w-full max-w-4xl rounded-2xl overflow-hidden border border-[rgba(255,255,255,0.06)]">
        <div className="flex justify-between items-center px-5 py-4 border-b border-[rgba(255,255,255,0.06)]">
          <h3 className="text-lg font-medium">{product?.name}</h3>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-md border border-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.05)]"
          >
            Đóng
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6 p-6">
          {/* Ảnh lớn */}
          <div className="bg-[var(--muted-2)] rounded-xl overflow-hidden">
            <div className="w-full aspect-square flex items-center justify-center">
              <img
                src={images[index] || "/placeholder.png"}
                alt=""
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Info + thumbnails */}
          <div>
            <p className="text-[var(--muted)]">{product?.description}</p>
            <div className="mt-3 text-[var(--accent)] text-xl font-semibold">
              {Number(product?.price || 0).toLocaleString("vi-VN")}₫
            </div>

            <div className="mt-5 grid grid-cols-5 gap-2">
              {images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`bg-[var(--muted-2)] rounded-md overflow-hidden border ${
                    index === i
                      ? "border-[var(--accent)]"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={src}
                    alt=""
                    className="w-full aspect-square object-cover"
                  />
                </button>
              ))}
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={addToCart}
                className="px-4 py-2 rounded-md bg-[var(--accent)] text-white hover:opacity-90"
              >
                Thêm vào giỏ
              </button>
              <a
                href={`/product/${product._id}`}
                className="px-4 py-2 rounded-md border border-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.05)]"
              >
                Xem chi tiết
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
