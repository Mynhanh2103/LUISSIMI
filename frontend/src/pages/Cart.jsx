import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, ArrowLeft } from "lucide-react";
import api from "../api/axios";

const formatCurrency = (amount) => {
  const value = Number(amount) || 0;
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Lấy dữ liệu từ Database
  const fetchCart = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await api.get("/cart/items/");
        setCart(response.data);
      } catch (err) {
        console.error("Lỗi lấy giỏ hàng server", err);
      }
    } else {
      const localData = JSON.parse(localStorage.getItem("local_cart") || "[]");
      setCart(localData);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (itemId, delta, currentQty) => {
    const newQty = Math.max(1, currentQty + delta);
    const token = localStorage.getItem("token");

    if (token) {
      try {
        await api.patch(`/cart/items/${itemId}/`, { quantity: newQty });
        fetchCart(); // BÂY GIỜ LỆNH NÀY SẼ CHẠY
      } catch (err) {
        alert("Lỗi cập nhật server");
      }
    } else {
      // Cập nhật cho khách vãng lai (LocalStorage)
      const updated = cart.map((item) =>
        item.id === itemId ? { ...item, quantity: newQty } : item
      );
      setCart(updated);
      localStorage.setItem("local_cart", JSON.stringify(updated));
    }
  };

  // 2. Tính tổng tiền bằng useMemo để tối ưu hiệu năng
  const total = useMemo(() => {
    return cart.reduce(
      (sum, item) => sum + Number(item.product?.price || 0) * item.quantity,
      0
    );
  }, [cart]);

  // 3. Cập nhật số lượng trực tiếp lên Server (PATCH)
  // 4. Xóa sản phẩm khỏi Database (DELETE)
  const removeFromCart = async (itemId) => {
    if (window.confirm("Bạn có chắc muốn bỏ sản phẩm này khỏi giỏ hàng?")) {
      try {
        await api.delete(`/cart/items/${itemId}/`);
        fetchCart();
      } catch (err) {
        alert("Lỗi khi xóa sản phẩm.");
      }
    }
  };

  if (loading)
    return (
      <div className="pt-32 text-center font-playfair uppercase tracking-widest text-stone-400">
        Đang chuẩn bị giỏ hàng...
      </div>
    );

  return (
    <div className="bg-stone-50 min-h-screen font-inter text-stone-900">
      <div className="container mx-auto pt-24 pb-12 px-4 max-w-6xl">
        <h1 className="text-3xl md:text-4xl font-playfair mb-10 text-stone-800 italic">
          Giỏ hàng của bạn
        </h1>

        {cart.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-stone-100">
            <p className="text-stone-400 mb-6 text-lg">
              Giỏ hàng LUISSIMI của bạn đang trống.
            </p>
            <Link
              to="/collection"
              className="inline-flex items-center text-[#8B5E34] font-bold hover:underline"
            >
              <ArrowLeft size={18} className="mr-2" /> Quay lại bộ sưu tập
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* DANH SÁCH SẢN PHẨM */}
            <div className="lg:col-span-2 space-y-6">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 flex flex-col md:flex-row items-center gap-6"
                >
                  {/* Ảnh sản phẩm: Không phóng to, hiển thị đầy đủ */}
                  <div className="w-24 h-32 bg-stone-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={
                        item.product?.image ||
                        (item.product?.images && item.product.images[0]?.image)
                      }
                      className="w-full h-full object-cover"
                      alt={item.product?.name}
                    />
                  </div>

                  {/* Thông tin sản phẩm */}
                  <div className="flex-1 text-center md:text-left">
                    <span className="text-[10px] uppercase tracking-widest text-amber-700 font-bold mb-1 block">
                      {item.product?.category || "Túi da cao cấp"}
                    </span>
                    <h3 className="font-playfair font-bold text-xl text-stone-800 mb-1">
                      {item.product?.name || "Sản phẩm LUISSIMI"}
                    </h3>
                    <p className="text-[#8B5E34] font-medium">
                      {formatCurrency(item.product?.price)}
                    </p>

                    {/* Bộ điều khiển số lượng */}
                    <div className="flex items-center justify-center md:justify-start mt-4 space-x-6">
                      <div className="flex items-center border border-stone-200 rounded-full px-3 py-1 bg-stone-50">
                        <button
                          onClick={() =>
                            updateQuantity(item.id, -1, item.quantity)
                          }
                          className="p-1 hover:text-[#8B5E34] transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="mx-4 font-bold w-6 text-center text-sm">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.id, 1, item.quantity)
                          }
                          className="p-1 hover:text-[#8B5E34] transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-stone-300 hover:text-red-500 transition-colors"
                        title="Xóa khỏi giỏ hàng"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Thành tiền cho từng món */}
                  <div className="hidden md:block text-right min-w-[140px]">
                    <p className="text-stone-400 text-[10px] uppercase font-bold tracking-tighter mb-1">
                      Thành tiền
                    </p>
                    <p className="font-playfair font-bold text-xl text-[#4E342E]">
                      {formatCurrency(
                        Number(item.product?.price || 0) * item.quantity
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* TÓM TẮT ĐƠN HÀNG */}
            <div className="lg:col-span-1">
              <div className="bg-white p-8 rounded-2xl shadow-xl lg:sticky lg:top-28 border border-stone-100">
                <h2 className="text-xl font-playfair font-bold mb-6 text-stone-800 border-b border-stone-100 pb-4">
                  Chi tiết thanh toán
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-stone-500 text-sm">
                    <span>Tạm tính</span>
                    <span className="font-medium text-stone-800">
                      {formatCurrency(total)}
                    </span>
                  </div>
                  <div className="flex justify-between text-stone-500 text-sm">
                    <span>Vận chuyển</span>
                    <span className="text-green-600 font-bold uppercase text-[10px] tracking-widest">
                      Miễn phí
                    </span>
                  </div>
                </div>

                <div className="border-t border-stone-100 pt-6 flex justify-between items-baseline mb-8">
                  <span className="text-stone-400 uppercase text-[10px] font-bold tracking-widest">
                    Tổng cộng
                  </span>
                  <span className="text-3xl font-playfair font-bold text-[#8B5E34]">
                    {formatCurrency(total)}
                  </span>
                </div>

                <Link to="/checkout" className="block w-full">
                  <button className="w-full bg-stone-900 text-white rounded-full py-4 font-bold tracking-widest text-[10px] uppercase hover:bg-[#4E342E] transition-all shadow-lg">
                    Tiến hành thanh toán
                  </button>
                </Link>

                <p className="text-[9px] text-stone-400 text-center mt-6 uppercase tracking-[0.2em] leading-loose">
                  Chế tác thủ công & <br /> Đảm bảo bởi Luissimi
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
