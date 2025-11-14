import React, { useState, useEffect } from "react";

export default function Cart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
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
    <div className="container mx-auto pt-20 pb-12 px-4">
      <h1 className="text-3xl font-playfair text-[var(--accent)] mb-6">
        Giỏ hàng của bạn
      </h1>
      {cart.length === 0 ? (
        <p className="text-[var(--muted)] text-center">Giỏ hàng trống.</p>
      ) : (
        <div className="space-y-6">
          {cart.map((item) => (
            <div
              key={item._id}
              className="flex items-center justify-between bg-white p-4 rounded-xl shadow"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-contain"
                />
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p>
                    {item.price}₫ x {item.quantity}
                  </p>
                </div>
              </div>
              <button
                onClick={() => removeFromCart(item._id)}
                className="text-red-500 hover:underline"
              >
                Xóa
              </button>
            </div>
          ))}
          <div className="text-right text-xl font-semibold">
            Tổng: {total.toLocaleString()}₫
          </div>
        </div>
      )}
    </div>
  );
}
