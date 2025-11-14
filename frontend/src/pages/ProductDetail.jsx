import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  useEffect(() => {
    api
      .get(`/products/${id}`)
      .then((res) => {
        const data = res.data;
        setProduct(data);

        // Nếu có nhiều ảnh → chọn ảnh đầu tiên
        if (data.images && data.images.length > 0) {
          setSelectedImage(data.images[0].url);
        } else {
          setSelectedImage(data.image);
        }
      })
      .catch((err) => console.error("Lỗi tải sản phẩm:", err));
  }, [id]);

  if (!product) {
    return (
      <div className="container py-32 text-center text-[var(--muted)]">
        Đang tải...
      </div>
    );
  }

  // Danh sách ảnh từ DB
  const images =
    product.images?.length > 0
      ? product.images.map((i) => i.url)
      : [product.image];

  const increaseQty = () => setQuantity((q) => q + 1);
  const decreaseQty = () => setQuantity((q) => (q > 1 ? q - 1 : 1));
  const addToCart = async () => {
    try {
      setAdding(true);
      await api.post("/cart/add", { productId: product._id, quantity: 1 });
      alert("🛒 Đã thêm sản phẩm vào giỏ hàng!");
    } catch (err) {
      console.error(err);
      alert("Không thể thêm vào giỏ hàng.");
    } finally {
      setAdding(false);
    }
  };
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-10">
        {/* ==== Thumbnails ==== */}
        <div className="flex flex-col gap-4">
          <div className="flex md:flex-col gap-4 overflow-auto">
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt="thumb"
                onClick={() => setSelectedImage(img)}
                className={`w-24 h-24 object-cover rounded-lg cursor-pointer border transition 
                ${
                  selectedImage === img
                    ? "border-[var(--accent)]"
                    : "border-transparent"
                }`}
              />
            ))}
          </div>

          {/* Ảnh lớn */}
          <div className="w-full">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-[500px] object-contain rounded-xl shadow-md bg-[var(--card)]"
            />
          </div>
        </div>

        {/* ==== THÔNG TIN SẢN PHẨM ==== */}
        <div className="flex flex-col justify-start">
          <h1 className="text-3xl font-playfair text-[var(--text)]">
            {product.name}
          </h1>

          <p className="text-[var(--muted)] mt-4 leading-relaxed">
            {product.description}
          </p>

          <div className="text-3xl font-semibold text-[var(--accent)] mt-6">
            {product.price.toLocaleString("vi-VN")}₫
          </div>

          {/* Số lượng */}
          <div className="mt-6 flex items-center gap-4">
            <span className="text-[var(--text)] font-medium text-lg">
              Số lượng:
            </span>
            <div className="flex items-center border rounded-lg overflow-hidden">
              <button
                onClick={decreaseQty}
                className="px-4 py-2 bg-[var(--card)] text-lg"
              >
                -
              </button>
              <span className="px-6 py-2 bg-white">{quantity}</span>
              <button
                onClick={increaseQty}
                className="px-4 py-2 bg-[var(--card)] text-lg"
              >
                +
              </button>
            </div>
          </div>

          {/* Nút thêm vào giỏ */}
          <div className="mt-8 flex gap-4">
            <button
              onClick={addToCart}
              disabled={adding}
              className="flex-1 py-3 border border-[var(--accent)] text-[var(--accent)] rounded-lg text-lg hover:bg-[var(--accent)] hover:text-black transition"
            >
              {adding ? "Đang thêm..." : "Thêm vào giỏ hàng"}
            </button>

            <button className="flex-1 py-3 border border-[var(--accent)] text-[var(--accent)] rounded-lg text-lg hover:bg-[var(--accent)] hover:text-black transition">
              Mua ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
