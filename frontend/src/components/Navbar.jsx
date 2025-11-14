import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-[#2e2623] text-white shadow-md">
      <div className="container mx-auto flex items-center justify-between py-4 px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          {/* --- THÊM LOGO VÀO ĐÂY --- */}
          <img
            src="https://scontent.fsgn8-3.fna.fbcdn.net/v/t39.30808-6/518270070_122114723852925027_1474162925335887281_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeGEGJwUfCEKpocFHLprtYhBYR0NvsrPIwBhHQ2-ys8jAErA9ywNY4v7wkietu-V8DeFGlfVbCED0rvowTWVJNOr&_nc_ohc=wpObEUfrdagQ7kNvwHDjq7o&_nc_oc=Adl5lGpZtr847LMMJ9w9pGyY3yUqXm6T3CWWkeqsipUrLxfeKTgSPB6O83tYHAlKNKM6ANo70rKT4rR9YVEMbJba&_nc_zt=23&_nc_ht=scontent.fsgn8-3.fna&_nc_gid=81d7bKFU8nw__R3pgS1fDQ&oh=00_AfjEdLBkMhYQO2guGb1btUU1c_solf1v6oNU_Iln4bbAEw&oe=691D11CE"
            alt="Luissimi Logo"
            className="h-8 w-auto" // Bạn có thể điều chỉnh chiều cao 'h-8' (32px)
          />

          {/* Đặt tên thương hiệu vào thẻ <span> với các class text cũ */}
          <span className="text-2xl font-playfair tracking-widest text-[#d1b89f] hover:text-[#f5e1c8] transition duration-300">
            LUISSIMI
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex gap-8 text-sm font-medium">
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
      </div>
    </header>
  );
}
