import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link cho nút checkout

// Thêm hàm định dạng tiền tệ (để format giá và tổng)
const formatCurrency = (amount) => {
  if (typeof amount !== "number") {
    amount = Number(amount) || 0;
  }
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

export default function Cart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    // Logic lấy cart từ localStorage của bạn
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(savedCart);
  }, []);

  const removeFromCart = (id) => {
    const updated = cart.filter((item) => item._id !== id);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    // Thêm bg-stone-50 và min-h-screen để đồng bộ
    <div className="bg-stone-50 min-h-screen">
      <div className="container mx-auto pt-20 pb-12 px-4">
        {/* Tiêu đề responsive */}
        <h1 className="text-2xl md:text-3xl font-playfair text-[var(--accent)] mb-6 md:mb-8">
          Giỏ hàng của bạn
        </h1>

        {cart.length === 0 ? (
          <p className="text-stone-500 text-center py-10">Giỏ hàng trống.</p>
        ) : (
          // Layout Grid: 1 cột (mobile), 3 cột (desktop)
          <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8">
            {/* === CỘT TRÁI: DANH SÁCH SẢN PHẨM === */}
            {/* Chiếm 2/3 không gian trên desktop */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm"
                >
                  {/* Thông tin sản phẩm */}
                  <div className="flex items-center gap-3 md:gap-4">
                    <img
                      src={item.image} // Bạn cần đảm bảo item trong localStorage có "image"
                      alt={item.name}
                      // Ảnh responsive
                      className="w-16 h-16 md:w-20 md:h-20 object-contain rounded-md bg-stone-100"
                    />
                    <div>
                      <h3 className="font-semibold text-stone-800">
                        {item.name}
                      </h3>
                      <p className="text-sm text-stone-500">
                        {formatCurrency(item.price)} x {item.quantity}
                      </p>
                      {/* Tổng tiền item, chỉ hiện trên mobile */}
                      <p className="md:hidden font-semibold text-stone-700 mt-1">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>

                  {/* Giá và nút Xóa (bên phải) */}
                  <div className="text-right">
                    {/* Tổng tiền item, chỉ hiện trên desktop */}
                    <p className="hidden md:block font-semibold text-stone-800 mb-2">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* === CỘT PHẢI: TÓM TẮT ĐƠN HÀNG === */}
            {/* Chiếm 1/3 không gian trên desktop
                Tự động nhảy xuống dưới trên mobile (do mt-8) */}
            <div className="lg:col-span-1 mt-8 lg:mt-0">
              <div className="bg-white p-6 rounded-xl shadow-lg lg:sticky lg:top-28">
                <h2 className="text-xl font-semibold mb-4 text-stone-800">
                  Tóm tắt đơn hàng
                </h2>

                <div className="flex justify-between mb-2 text-stone-600">
                  <span>Tạm tính</span>
                  <span>{formatCurrency(total)}</span>
                </div>

                <div className="flex justify-between mb-4 text-stone-600">
                  <span>Phí vận chuyển</span>
                  <span>Miễn phí</span>
                </div>

                <div className="border-t border-stone-200 pt-4 flex justify-between font-bold text-lg text-stone-900">
                  <span>Tổng</span>
                  <span>{formatCurrency(total)}</span>
                </div>

                <Link to="/checkout">
                  {" "}
                  {/* Giả sử có route /checkout */}
                  <button className="w-full bg-stone-800 text-white rounded-lg py-3 mt-6 font-semibold hover:bg-stone-700 transition">
                    Tiến hành thanh toán
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
