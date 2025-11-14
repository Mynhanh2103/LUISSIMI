import React from "react";
import { Link } from "react-router-dom"; // Import Link để điều hướng

export default function Footer() {
  return (
    // Đồng bộ màu với Header, padding responsive (py-12, px-6)
    <footer className="bg-[#2e2623] text-stone-300 py-12 px-6 mt-10">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          
          {/* Cột 1: Giới thiệu (Căn giữa trên mobile, căn trái trên PC) */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-playfair text-[#d1b89f] mb-3">
              LUISSIMI
            </h3>
            <p className="text-sm text-stone-400">
              Sự tinh tế và sang trọng trong từng sản phẩm da thật.
            </p>
          </div>

          {/* Cột 2: Links (Căn giữa trên mobile, căn trái trên PC) */}
          <div className="text-center md:text-left">
            <h4 className="font-semibold text-white mb-3">Khám phá</h4>
            <nav className="flex flex-col gap-2 text-sm">
              <Link to="/" className="text-stone-400 hover:text-white">
                Trang chủ
              </Link>
              <Link to="/collection" className="text-stone-400 hover:text-white">
                Bộ sưu tập
              </Link>
              {/* Thêm link nếu cần */}
            </nav>
          </div>

          {/* Cột 3: Liên hệ (Căn giữa trên mobile, căn phải trên PC) */}
          <div className="text-center md:text-right">
            <h4 className="font-semibold text-white mb-3">Liên hệ</h4>
            <p className="text-sm text-stone-400">Email: support@luissimi.com</p>
            <p className="text-sm text-stone-400">Hotline: 0123 456 789</p>
          </div>

        </div>

        {/* Dòng Copyright (Căn giữa) */}
        <div className="border-t border-stone-700 mt-10 pt-8 text-center text-sm text-stone-500">
          <p>
            © {new Date().getFullYear()}{" "}
            <span className="text-[#d1b89f]">LUISSIMI</span> — Thương hiệu túi da
            cao cấp Việt Nam
          </p>
        </div>
        
      </div>
    </footer>
  );
}