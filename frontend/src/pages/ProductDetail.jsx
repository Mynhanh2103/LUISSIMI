import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

// Hàm định dạng tiền tệ Việt Nam
const formatCurrency = (amount) => {
  if (typeof amount !== "number") amount = Number(amount) || 0;
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

// Component con hiển thị từng dòng thông số kiểu Catalog
const SpecRow = ({ label, value }) => (
  <div className="flex justify-between py-2.5 border-b border-stone-100 text-sm">
    <span className="text-stone-400 font-medium uppercase tracking-tighter w-1/3">
      {label}
    </span>
    <span className="text-stone-700 w-2/3 text-right font-light leading-relaxed">
      {value || "/"}
    </span>
  </div>
);

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    // Tự động cuộn lên đầu trang khi vào chi tiết sản phẩm
    window.scrollTo(0, 0);

    api
      .get(`/products/${id}/`)
      .then((res) => {
        const data = res.data;
        setProduct(data);
        // Django trả về images là mảng object { image: "url" }
        if (data.images && data.images.length > 0) {
          setSelectedImage(data.images[0].image);
        } else if (data.image) {
          setSelectedImage(data.image);
        }
      })
      .catch((err) => console.error("Lỗi tải sản phẩm:", err));
  }, [id]);

  if (!product) {
    return (
      <div className="container mx-auto h-screen flex justify-center items-center text-stone-400 animate-pulse font-playfair italic">
        Đang tải tuyệt tác LUISSIMI...
      </div>
    );
  }

  // Xử lý danh sách ảnh an toàn từ Django Model
  const images =
    product.images?.length > 0
      ? product.images.map((imgObj) => imgObj.image)
      : product.image
      ? [product.image]
      : ["/placeholder.png"];

  const increaseQty = () => setQuantity((q) => q + 1);
  const decreaseQty = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const addToCart = async () => {
    try {
      setAdding(true);
      // Gửi id sản phẩm và số lượng đã chọn lên API giỏ hàng
      await api.post("/cart/add/", {
        productId: product.id, // Đổi từ _id thành id
        quantity: quantity,
      });
      alert("🛒 Đã thêm sản phẩm vào giỏ hàng!");
    } catch (err) {
      console.error(err);
      alert("Không thể thêm vào giỏ hàng. Vui lòng thử lại.");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 md:py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
        {/* ==== CỘT BÊN TRÁI (HÌNH ẢNH) ==== */}
        <div className="flex flex-col-reverse md:flex-row gap-5">
          {/* Thumbnails (Ảnh nhỏ xếp dọc bên máy tính) */}
          <div className="flex flex-row md:flex-col gap-3 overflow-x-auto md:overflow-y-auto p-1 scrollbar-hide">
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt="thumbnail"
                onClick={() => setSelectedImage(img)}
                className={`flex-none w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg cursor-pointer transition-all duration-300 shadow-sm
                ${
                  selectedImage === img
                    ? "border-2 border-stone-800 scale-95"
                    : "border border-stone-100 opacity-70 hover:opacity-100"
                }`}
              />
            ))}
          </div>

          {/* Ảnh lớn hiển thị chính */}
          <div className="w-full flex-1">
            <div className="sticky top-24">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-auto aspect-[4/5] object-cover rounded-2xl shadow-xl bg-stone-50 transition-all duration-500"
              />
            </div>
          </div>
        </div>

        {/* ==== CỘT BÊN PHẢI (THÔNG TIN CATALOG) ==== */}
        <div className="flex flex-col">
          {/* Nhãn thương hiệu/Collab */}
          <span className="text-amber-700 text-xs font-bold uppercase tracking-[0.2em] mb-3">
            {product.collab_info || "NAMGIA-ATELIER x LUISSIMI"}
          </span>

          <h1 className="text-4xl md:text-5xl font-playfair text-stone-800 leading-tight italic">
            {product.name}
          </h1>

          <div className="text-2xl md:text-3xl font-light text-stone-600 mt-5 mb-8">
            {formatCurrency(product.price)}
          </div>
          <div className="mt-8">
            <h3 className="text-sm font-bold text-stone-800 uppercase tracking-widest mb-4">
              Màu sắc
            </h3>
            <div className="flex space-x-3">
              {product.colors?.map((color) => (
                <button
                  key={color.id}
                  title={color.name}
                  className="w-8 h-8 rounded-full border border-stone-300 transition-transform hover:scale-110"
                  style={{ backgroundColor: color.hex_code }}
                />
              ))}
            </div>
          </div>
          <div className="border-l-2 border-stone-200 pl-6 mb-10">
            <p className="text-stone-500 italic leading-relaxed text-lg">
              {product.description ||
                "Mỗi sản phẩm là một tác phẩm nghệ thuật, mang đậm dấu ấn cá nhân và tâm huyết của những nghệ nhân tài hoa."}
            </p>
          </div>

          {/* BẢNG THÔNG SỐ CHI TIẾT (Kiểu Catalog) */}
          <div className="bg-stone-50/50 p-6 rounded-2xl border border-stone-100 mb-10">
            <h3 className="font-playfair text-xl text-stone-800 mb-5 border-b border-stone-200 pb-2">
              Thông số kỹ thuật
            </h3>
            <div className="space-y-1">
              <SpecRow label="Chế tác" value={product.craftsmanship} />
              <SpecRow label="Chất liệu" value={product.material_detail} />
              <SpecRow label="Thiết kế" value={product.design_style} />
              <SpecRow label="Khả năng chứa" value={product.capacity} />
              <SpecRow label="Kích thước" value={product.dimensions} />
              <SpecRow label="Trọng lượng" value={product.weight} />
              <SpecRow label="Quá trình Aging" value={product.aging_process} />
            </div>
          </div>

          {/* Điều chỉnh số lượng & Nút mua */}
          <div className="space-y-6">
            <div className="flex items-center gap-6">
              <span className="text-stone-400 uppercase text-xs tracking-widest font-bold">
                Số lượng
              </span>
              <div className="flex items-center bg-white border border-stone-200 rounded-full px-2 py-1">
                <button
                  onClick={decreaseQty}
                  className="w-10 h-10 flex items-center justify-center text-xl hover:text-amber-700 transition"
                >
                  -
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={increaseQty}
                  className="w-10 h-10 flex items-center justify-center text-xl hover:text-amber-700 transition"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={addToCart}
                disabled={adding}
                className="flex-1 bg-stone-800 text-white py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-stone-700 transition-all shadow-lg disabled:opacity-50"
              >
                {adding ? "Đang xử lý..." : "Thêm vào giỏ hàng"}
              </button>

              <button className="flex-1 border border-stone-800 text-stone-800 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-stone-50 transition-all">
                Mua ngay
              </button>
            </div>
          </div>

          {/* Cam kết thương hiệu */}
          <div className="mt-12 grid grid-cols-2 gap-6 pt-10 border-t border-stone-100">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-amber-700 mt-1.5" />
              <p className="text-xs text-stone-400 uppercase tracking-tighter">
                100% Genuine Leather
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-amber-700 mt-1.5" />
              <p className="text-xs text-stone-400 uppercase tracking-tighter">
                Artisanal Craftsmanship
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
