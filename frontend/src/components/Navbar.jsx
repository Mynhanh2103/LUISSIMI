import { Link } from "react-router-dom";
import { useState } from "react";
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <header className="bg-[#2e2623] text-white shadow-md relative">
      {" "}
      {/* Thêm relative */}
      <div className="container mx-auto flex items-center justify-between py-4 px-6 md:px-8">
        {/* Logo (giữ nguyên) */}
        <Link to="/" className="flex items-center gap-3 z-50">
          <img
            src="/public/logo.jpg"
            alt="Luissimi Logo"
            className="h-8 w-auto"
          />
          <span className="text-2xl font-playfair tracking-widest text-[#d1b89f] hover:text-[#f5e1c8] transition duration-300">
            LUISSIMI
          </span>
        </Link>

        {/* --- DÀNH CHO DESKTOP --- */}
        {/* Ẩn trên mobile (hidden), hiện trên desktop (md:flex) */}
        <nav className="hidden md:flex gap-8 text-sm font-medium">
          <Link
            to="/"
            className="hover:text-[#d1b89f] transition duration-200 tracking-wide"
          >
            Trang chủ
          </Link>
          <Link
            to="/collection"
            className="hover:text-[#d1b89f] transition duration-200 tracking-wide"
          >
            Bộ sưu tập
          </Link>
          <Link
            to="/cart"
            className="hover:text-[#d1b89f] transition duration-200 tracking-wide"
          >
            Giỏ hàng
          </Link>
          <Link
            to="/login"
            className="hover:text-[#d1b89f] transition duration-200 tracking-wide"
          >
            Đăng nhập
          </Link>
        </nav>

        {/* --- DÀNH CHO MOBILE --- */}
        {/* Nút Hamburger (hiện trên mobile, ẩn trên desktop) */}
        <div className="md:hidden z-50">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white focus:outline-none"
          >
            {isMenuOpen ? (
              // Icon "X" (Đóng)
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-7 h-7"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              // Icon "Menu" (Hamburger)
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-7 h-7"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
      {/* --- MENU DROPDOWN CHO MOBILE --- */}
      {/* Hiện ra khi isMenuOpen là true */}
      {isMenuOpen && (
        <div
          className="absolute top-0 left-0 w-full h-screen bg-[#2e2623] pt-24 px-8 flex flex-col gap-6 md:hidden"
          // Tự động đóng menu khi nhấn vào link
          onClick={() => setIsMenuOpen(false)}
        >
          <Link to="/" className="text-xl hover:text-[#d1b89f]">
            Trang chủ
          </Link>
          <Link to="/collection" className="text-xl hover:text-[#d1b89f]">
            Bộ sưu tập
          </Link>
          <Link to="/cart" className="text-xl hover:text-[#d1b89f]">
            Giỏ hàng
          </Link>
          <Link to="/login" className="text-xl hover:text-[#d1b89f]">
            Đăng nhập
          </Link>
        </div>
      )}
    </header>
  );
}
