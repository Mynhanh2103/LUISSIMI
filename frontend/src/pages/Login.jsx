import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, ArrowRight, CheckCircle } from "lucide-react";
import api from "../api/axios"; // Đảm bảo đường dẫn này chính xác

export default function Login() {
  const navigate = useNavigate();

  // 1. Quản lý trạng thái chuyển đổi giữa Đăng nhập & Đăng ký
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // 2. Quản lý dữ liệu Form
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const mergeCart = async () => {
    const localCart = JSON.parse(localStorage.getItem("local_cart") || "[]");
    if (localCart.length > 0) {
      try {
        // Gửi toàn bộ giỏ hàng local lên server để lưu vào Database
        await api.post("/cart/merge/", { items: localCart });
        localStorage.removeItem("local_cart"); // Xóa giỏ tạm sau khi đã gộp
      } catch (err) {
        console.error("Lỗi gộp giỏ hàng", err);
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null); // Xóa lỗi khi người dùng bắt đầu nhập lại
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Quyết định Endpoint dựa trên Tab đang chọn
    const endpoint = isRegister ? "/auth/register/" : "/auth/login/";
    const payload = isRegister
      ? {
          username: formData.email,
          email: formData.email,
          password: formData.password,
          first_name: formData.name,
        }
      : { username: formData.email, password: formData.password }; // Django dùng username mặc định

    try {
      const res = await api.post(endpoint, payload);

      if (isRegister) {
        // Sau khi đăng ký thành công, chuyển sang tab Đăng nhập
        setSuccessMsg("Đăng ký thành công! Mời bạn đăng nhập vào LUISSIMI.");
        setIsRegister(false);
        setFormData({ ...formData, password: "" }); // Giữ lại email cho tiện
      } else {
        // Đăng nhập thành công: Lưu Token và thông tin cơ bản
        localStorage.setItem("token", res.data.access);
        localStorage.setItem(
          "customer_name",
          res.data.name || formData.email.split("@")[0]
        );
        const localCart = JSON.parse(
          localStorage.getItem("local_cart") || "[]"
        );

        if (localCart.length > 0) {
          try {
            // Gửi yêu cầu gộp lên server. Interceptor sẽ tự đính kèm Token vừa lưu ở trên.
            await api.post("/cart/merge/", { items: localCart });

            // Gộp xong thì xóa giỏ tạm để giải phóng bộ nhớ trình duyệt
            localStorage.removeItem("local_cart");
          } catch (err) {
            console.error("Lỗi gộp giỏ hàng:", err);
          }
        }
        // Điều hướng về trang chủ hoặc trang cá nhân
        navigate("/");
        window.location.reload(); // Reload để Navbar cập nhật trạng thái User
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.detail ||
          "Thông tin không chính xác. Vui lòng kiểm tra lại."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4 py-20 font-inter">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-stone-100 transition-all duration-500 hover:shadow-2xl">
        {/* Header Section */}
        <div className="bg-stone-900 py-10 px-8 text-center">
          <h2 className="text-3xl font-playfair font-bold text-amber-600 tracking-widest uppercase mb-2">
            LUISSIMI
          </h2>
          <p className="text-stone-400 text-xs uppercase tracking-[0.3em]">
            {isRegister
              ? "Khởi tạo hành trình quý tộc"
              : "Chào mừng quý khách trở lại"}
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-stone-100">
          <button
            onClick={() => {
              setIsRegister(false);
              setSuccessMsg(null);
            }}
            className={`flex-1 py-4 text-xs font-bold tracking-widest uppercase transition-all ${
              !isRegister
                ? "text-stone-900 border-b-2 border-amber-700 bg-stone-50/50"
                : "text-stone-400"
            }`}
          >
            Đăng nhập
          </button>
          <button
            onClick={() => {
              setIsRegister(true);
              setSuccessMsg(null);
            }}
            className={`flex-1 py-4 text-xs font-bold tracking-widest uppercase transition-all ${
              isRegister
                ? "text-stone-900 border-b-2 border-amber-700 bg-stone-50/50"
                : "text-stone-400"
            }`}
          >
            Đăng ký
          </button>
        </div>

        <div className="p-8">
          {error && (
            <div className="bg-red-50 text-red-600 text-xs p-3 rounded-xl mb-4 text-center border border-red-100">
              {error}
            </div>
          )}
          {successMsg && (
            <div className="bg-green-50 text-green-700 text-xs p-3 rounded-xl mb-4 text-center border border-green-100 flex items-center justify-center gap-2">
              <CheckCircle size={14} /> {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {isRegister && (
              <div className="relative">
                <User
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
                  size={18}
                />
                <input
                  name="name"
                  type="text"
                  placeholder="Họ và tên của bạn"
                  className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-700 transition-all text-sm"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
                size={18}
              />
              <input
                name="email"
                type="email"
                placeholder="Địa chỉ Email"
                className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-700 transition-all text-sm"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
                size={18}
              />
              <input
                name="password"
                type="password"
                placeholder="Mật khẩu"
                className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-amber-700 transition-all text-sm"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {!isRegister && (
              <div className="text-right">
                <button
                  type="button"
                  className="text-[10px] text-stone-400 hover:text-amber-700 uppercase tracking-widest font-bold"
                >
                  Quên mật khẩu?
                </button>
              </div>
            )}

            <button
              disabled={loading}
              className="w-full bg-stone-900 text-white py-4 rounded-full font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-stone-800 transition-all shadow-lg hover:shadow-stone-200 disabled:opacity-50"
            >
              {loading
                ? "Đang xử lý..."
                : isRegister
                ? "Tạo tài khoản"
                : "Truy cập LUISSIMI"}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <p className="mt-8 text-center text-stone-400 text-[10px] uppercase tracking-widest leading-loose">
            Cam kết bảo mật thông tin tuyệt đối bởi <br />
            <span className="text-stone-600 font-bold">
              LUISSIMI Craftsmanship
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
