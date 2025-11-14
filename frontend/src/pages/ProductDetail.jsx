import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

// Hàm định dạng tiền tệ (nên dùng chung)
const formatCurrency = (amount) => {
  if (typeof amount !== "number") {
    amount = Number(amount) || 0;
  }
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    // Tự động cuộn lên đầu trang khi vào
    window.scrollTo(0, 0);

    api
      .get(`/products/${id}`)
      .then((res) => {
        const data = res.data;
        setProduct(data);

        // Tự động chọn ảnh đầu tiên
        if (data.images && data.images.length > 0) {
          setSelectedImage(data.images[0].url);
        } else if (data.image) {
          setSelectedImage(data.image); // Fallback
        }
      })
      .catch((err) => console.error("Lỗi tải sản phẩm:", err));
  }, [id]);

  if (!product) {
    return (
      // Căn giữa màn hình
      <div className="container mx-auto h-screen flex justify-center items-center text-[var(--muted)]">
        Đang tải...
      </div>
    );
  }

  // Danh sách ảnh từ DB (an toàn hơn)
  const images =
    product.images?.length > 0
      ? product.images.map((i) => i.url)
      : product.image
      ? [product.image]
      : []; // Mảng rỗng nếu không có ảnh

  const increaseQty = () => setQuantity((q) => q + 1);
  const decreaseQty = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const addToCart = async () => {
    try {
      setAdding(true);
      // ▼▼▼ SỬA LỖI LOGIC QUAN TRỌNG ▼▼▼
      // Gửi đúng "quantity" (số lượng) mà người dùng đã chọn
      await api.post("/cart/add", {
        productId: product._id,
        quantity: quantity, // <-- Đã sửa (trước đây là 1)
      });
      // ▲▲▲ HẾT PHẦN SỬA LỖI ▲▲▲
      alert("🛒 Đã thêm sản phẩm vào giỏ hàng!");
    } catch (err) {
      console.error(err);
      alert("Không thể thêm vào giỏ hàng.");
    } finally {
      setAdding(false);
    }
  };

  return (
    // Responsive padding (px-4) và max-w-6xl
    <div className="container mx-auto max-w-6xl px-4 py-8 md:py-12">
      {/* Layout Grid: 1 cột (mobile), 2 cột (desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {/* ==== CỘT BÊN TRÁI (HÌNH ẢNH) ==== */}
        {/* - Điện thoại: Xếp ảnh chính lên trên (flex-col-reverse)
            - Máy tính: Xếp ảnh nhỏ bên trái (md:flex-row)
        */}
        <div className="flex flex-col-reverse md:flex-row gap-4">
          {/* Thumbnails (Ảnh nhỏ) */}
          {/* - Điện thoại: Cuộn ngang (flex-row overflow-x-auto)
              - Máy tính: Cuộn dọc (md:flex-col md:overflow-y-auto)
          */}
          <div className="flex flex-row md:flex-col gap-3 overflow-x-auto md:overflow-y-auto p-1 md:p-0">
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt="thumb"
                onClick={() => setSelectedImage(img)}
                // flex-none để ảnh không bị bóp
                className={`flex-none w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg cursor-pointer border-2 transition 
                ${
                  selectedImage === img
                    ? "border-[var(--accent)]" // Làm nổi bật
                    : "border-transparent"
                }`}
              />
            ))}
          </div>

          {/* Ảnh lớn (flex-1 để chiếm không gian còn lại) */}
          <div className="w-full flex-1">
            <img
              src={selectedImage}
              alt={product.name}
              // Chiều cao responsive
              className="w-full h-[350px] sm:h-[450px] md:h-full lg:h-[600px] object-contain rounded-xl shadow-md bg-[var(--card)]"
            />
          </div>
        </div>

        {/* ==== CỘT BÊN PHẢI (THÔNG TIN) ==== */}
        <div className="flex flex-col justify-start">
          {/* Cỡ chữ responsive */}
          <h1 className="text-3xl md:text-4xl font-playfair text-[var(--text)]">
            {product.name}
          </h1>

          <div className="text-3xl md:text-4xl font-semibold text-[var(--accent)] mt-4">
            {formatCurrency(product.price)}
          </div>

          <p className="text-[var(--muted)] mt-6 leading-relaxed">
            {product.description}
          </p>

          {/* Số lượng */}
          <div className="mt-8 flex items-center gap-4">
            <span className="text-[var(--text)] font-medium text-lg">
              Số lượng:
            </span>
            <div className="flex items-center border rounded-lg overflow-hidden">
              <button
                onClick={decreaseQty}
                className="px-4 py-2 bg-[var(--card)] text-lg hover:bg-opacity-80"
              >
                -
              </button>
              <span className="px-6 py-2 bg-white text-lg font-medium">
                {quantity}
              </span>
              <button
                onClick={increaseQty}
                className="px-4 py-2 bg-[var(--card)] text-lg hover:bg-opacity-80"
              >
                +
              </button>
            </div>
          </div>

          {/* Nút (responsive):
            - Điện thoại: Xếp dọc (flex-col)
            - Máy tính nhỏ (sm): Xếp ngang (sm:flex-row)
          */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <button
              onClick={addToCart}
              disabled={adding}
              className="flex-1 py-3 px-6 border border-[var(--accent)] text-[var(--accent)] rounded-lg text-lg hover:bg-[var(--accent)] hover:text-black transition disabled:opacity-50"
            >
              {adding ? "Đang thêm..." : "Thêm vào giỏ hàng"}
            </button>

            <button className="flex-1 py-3 px-6 border border-[var(--accent)] text-[var(--accent)] rounded-lg text-lg hover:bg-[var(--accent)] hover:text-black transition">
              Mua ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
