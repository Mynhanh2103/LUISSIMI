import React, { useEffect, useState, useRef, useCallback } from "react";

// --- Helper Function ---
// Hàm định dạng tiền tệ Việt Nam
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
import api from "../api/axios";
import heroVideo from "../assets/hero/istockphoto-1307688907-640_adpp_is.mp4";
// Dữ liệu cho carousel (không có tiêu đề)
const carouselImages = [
  {
    id: 1,
    imageUrl:
      "https://scontent.fsgn8-4.fna.fbcdn.net/v/t39.30808-6/518271214_122114673998925027_4427728725960124425_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeGjauU_Yd7Y3pimWgcdiXIYT8-_NuJ6RAVPz7824npEBbbHVbJd0JIsIhDm38KJ-GKizzYPgA1mgQA7qtobVl8p&_nc_ohc=vNbbDNEkm04Q7kNvwHvzrhz&_nc_oc=Adl-AcCjrSFXUfVdc63CUi9Z4GtZJ46dqUoPf0BWiYTjfBdKmG8_GUQN6gOxAiW6f3AAcOznxHBN1H7ohDarw5Yt&_nc_zt=23&_nc_ht=scontent.fsgn8-4.fna&_nc_gid=tST_woIlb94OUjJoroOw1g&oh=00_AfiNdhnoeWLw7RhjOhqgAyC-m3C7YjoVNtoUId3sJyiQdA&oe=691CF218",
  },
  {
    id: 2,
    imageUrl:
      "https://scontent.fsgn8-4.fna.fbcdn.net/v/t39.30808-6/514406400_122105385050925027_3809942413611523471_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeEfxrNzjECGEcdIemeHD9kgeIK__1cpu9N4gr__Vym705CqTz_pFFzRCK04mZLmzJon-g_FXm6MZ2E2SuNmGRYk&_nc_ohc=teBiSlrDH4wQ7kNvwFMHyqK&_nc_oc=Adlr4YqUqs5B40OdTu61cxKzZaaoTVynxIgE8tYaS9M_zM6RCnudGEjP9DkB5FxpARQQKUGiAlKl5J64hilr_opT&_nc_zt=23&_nc_ht=scontent.fsgn8-4.fna&_nc_gid=3nt5o0Ijg39M0sGPmJdlSg&oh=00_AfiFWcrP3QQikCZmgCeUxouKHLUWvDAQ-oDHjSLKGNYr9g&oe=691CFD53",
  },
  {
    id: 3,
    imageUrl:
      "https://scontent.fsgn8-4.fna.fbcdn.net/v/t39.30808-6/514410101_122104511528925027_9184013918891501447_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFdKcXHHVr0XGI9oOm0U0-KrFb8eRHwtGisVvx5EfC0aBpWpW-GiFs5k1vhOO9xtdHM_qgcFlysk8vVH_cA1LXA&_nc_ohc=LlAYx9XwrS8Q7kNvwEUW7kP&_nc_oc=AdnD11LLyCpdxFxO3FUmbbNBY1aYr54czfkxQzgmb4-rtrBr1q8YILOJdsTi5KUDTUcGXYla2ebb1bs7lLJ_Iyy9&_nc_zt=23&_nc_ht=scontent.fsgn8-4.fna&_nc_gid=0OdeQu4_oItfK19LXni5PQ&oh=00_Afgr3eORW1ufG2VJ9dQ_Mf4c6M4Zt12REITZIdOVDLESew&oe=691D14DF",
  },
  {
    id: 4,
    imageUrl:
      "https://scontent.fsgn8-4.fna.fbcdn.net/v/t39.30808-6/504005542_122099837498925027_937300051770912051_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFFryUonzDOMquL9X5_xGhgZx_lLxIc7VpnH-UvEhztWlgj6r5ih3mWi-SwkvUuGSuqFuBNc5YcNc8hUD4kY4Ds&_nc_ohc=0Ho--lAbiXgQ7kNvwGtX-UW&_nc_oc=AdloMBfhB9jm50CCBTy94t1q4W4v_xEaBxD7UrvYiSiRkHP3tvOiAzfSRwehFso4E-lH39iQa8Hl6gITkGighdTt&_nc_zt=23&_nc_ht=scontent.fsgn8-4.fna&_nc_gid=Iq2EV_rFNCgRCN32WOnz-g&oh=00_Afj8LCm9_J0s1SOKmLBM6wHUPEm-xrRU19sRznWxdU7BRw&oe=691CFBFD",
  },
  {
    id: 5,
    imageUrl:
      "https://scontent.fsgn8-4.fna.fbcdn.net/v/t39.30808-6/518273161_122114670314925027_3629280208411520320_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFcqGVzkqqXiAJxT2mkLHWH5Y6eQWXlfeLljp5BZeV94qHSjcuEBK4tAsxHtaWauVtfbvm9WsoTVpdUiXBVqzR1&_nc_ohc=a97HK0y4fa8Q7kNvwHqzuoJ&_nc_oc=AdmVpkpy94CTZGjA-sHZ2DiCJK5rMTn0VJs-KJiPpBdkJLwnO4TIQM5I95D1m1DQbwm3hkUkVBbE1vsSmN5Rbo7A&_nc_zt=23&_nc_ht=scontent.fsgn8-4.fna&_nc_gid=TSGscBxhUWLJFl5zcIwI1Q&oh=00_Afgi16YzHjYLWrYCt6WD5676LJ3W8xzIIdnBEyTugqfEng&oe=691CE59D",
  },
  {
    id: 6,
    imageUrl:
      "https://scontent.fsgn8-4.fna.fbcdn.net/v/t39.30808-6/518370070_122114669786925027_896254874330590842_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeHNfwqkzd-Tf58grKbEbJpMK36eU-viY64rfp5T6-Jjrqj6f2Qg1nqYiCjXCZ8dQaZM3cc7Aue5SLXlabODjD8W&_nc_ohc=SmenWe7bBxUQ7kNvwEfTfea&_nc_oc=AdmW3brLfHrUKqBBXtBvdyTeQxfmoPSHaC1oYj2wKLiIUmiRmGgYuGwtcFBfzGBGMHEAKzT-QFHnWrglPWrHLP0m&_nc_zt=23&_nc_ht=scontent.fsgn8-4.fna&_nc_gid=BCZWPcSxfHtgRdYpwIJIiQ&oh=00_AfiWG3bWsHS-FO46jeIqB4FQ70IfrBI0nfSXR6ln5TLKyw&oe=691D028D",
  },
];

// --- Component Con ---
function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);
  const imageSrc =
    product.images && product.images.length > 0
      ? product.images[0].url
      : "https://placehold.co/400x500/EEE/AAA?text=No+Image";

  return (
    <div
      className="relative group overflow-hidden rounded-lg shadow-sm"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={imageSrc}
        alt={product.name}
        className="w-full h-auto object-cover aspect-[4/5] transition-transform duration-500 ease-in-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      {/* Thông tin sản phẩm */}
      <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/60 to-transparent">
        <h3 className="text-white text-lg font-playfair mb-1 truncate">
          {product.name}
        </h3>
        <p className="text-stone-200 text-sm font-light">
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(product.price)}
        </p>
      </div>

      {/* Nút "Xem chi tiết" */}
      <button
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 text-stone-900 text-sm px-5 py-2.5 rounded-full shadow-md
                    transition-all duration-300 ease-in-out
                    ${
                      isHovered ? "opacity-100 scale-100" : "opacity-0 scale-90"
                    }`}
      >
        Xem chi tiết
      </button>
    </div>
  );
}
function FeaturedProductPost({ product, align = "left" }) {
  const imageSrc =
    product.images && product.images.length > 0
      ? product.images[0].url
      : "https://placehold.co/600x700/EEE/AAA?text=No+Image";

  // Xác định thứ tự cột cho layout "so le"
  const imageOrder = align === "left" ? "md:order-1" : "md:order-2";
  const textOrder = align === "left" ? "md:order-2" : "md:order-1";

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-8 md:gap-16">
      {/* Cột Hình ảnh */}
      <div
        className={`rounded-lg overflow-hidden shadow-xl ${imageOrder} group`}
      >
        <a href={`/product/${product._id}`}>
          <img
            src={imageSrc}
            alt={product.name}
            className="w-full h-auto object-cover aspect-[4/5] transition-transform duration-500 ease-in-out group-hover:scale-105"
          />
        </a>
      </div>

      {/* Cột Văn bản (Caption, Giá) */}
      <div className={`text-left ${textOrder}`}>
        <h3 className="text-3xl font-playfair text-stone-800 mb-3">
          {product.name}
        </h3>
        <p className="text-2xl font-semibold text-amber-700 mb-5">
          {formatCurrency(product.price)}
        </p>
        <p className="text-stone-600 leading-relaxed mb-6">
          {/* Bạn có thể dùng product.description ở đây nếu có */}
          {product.description ||
            "Mỗi sản phẩm là một tác phẩm nghệ thuật, được chăm chút tỉ mỉ bởi những nghệ nhân tài hoa, mang theo câu chuyện về đam mê..."}
        </p>
        <a
          href={`/product/${product._id}`} // Giả sử link là thế này
          className="inline-block bg-stone-800 text-white font-semibold py-3 px-6 rounded-md tracking-wide hover:bg-stone-700 transition-colors"
        >
          Xem chi tiết
        </a>
      </div>
    </div>
  );
}

// --- Component Chính ---
import { useNavigate } from "react-router-dom";
export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  // State và Ref cho Carousel
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef(null);

  // Hàm Debounce
  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        setProducts(res.data.products || res.data || []);
      } catch (err) {
        console.error("❌ Lỗi tải sản phẩm:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // --- Logic cho Carousel ---

  // Hàm cuộn đến slide
  const scrollToSlide = useCallback((index) => {
    const container = scrollContainerRef.current;
    if (container) {
      const slideWidth = container.scrollWidth / carouselImages.length;
      const scrollLeft =
        slideWidth * index - (container.clientWidth - slideWidth) / 2;
      container.scrollTo({ left: scrollLeft, behavior: "smooth" });
      setActiveIndex(index);
    }
  }, []);

  // Nút Previous
  const handlePrev = () => {
    const newIndex =
      activeIndex === 0 ? carouselImages.length - 1 : activeIndex - 1;
    scrollToSlide(newIndex);
  };

  // Nút Next
  const handleNext = () => {
    const newIndex =
      activeIndex === carouselImages.length - 1 ? 0 : activeIndex + 1;
    scrollToSlide(newIndex);
  };

  // Cập nhật dot khi người dùng tự cuộn
  useEffect(() => {
    const container = scrollContainerRef.current;

    const handleScroll = debounce(() => {
      if (container) {
        const slideWidth = container.scrollWidth / carouselImages.length;
        const newIndex = Math.round(
          (container.scrollLeft + (container.clientWidth - slideWidth) / 2) /
            slideWidth
        );
        if (newIndex >= 0 && newIndex < carouselImages.length) {
          setActiveIndex(newIndex);
        }
      }
    }, 150); // 150ms delay

    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    // Cleanup
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [carouselImages.length]);
  // --- Hết Logic cho Carousel ---

  return (
    <main className="bg-stone-50 min-h-screen text-stone-900 font-inter">
      {/* CSS Tùy chỉnh
        1. Ẩn thanh cuộn cho carousel
        2. Hiệu ứng "tỏa sáng" (radiant-glow) cho tiêu đề Hero
      */}
      <style>{`
        .carousel-container {
          -ms-overflow-style: none; /* IE và Edge */
          scrollbar-width: none; /* Firefox */
        }
        .carousel-container::-webkit-scrollbar {
          display: none; /* Chrome, Safari và Opera */
        }
        
        /* Hiệu ứng tỏa sáng Vàng + Bạc (ĐÃ ĐIỀU CHỈNH) */
        @keyframes radiant-glow {
          0% {
            /* Giảm độ sáng và độ lan toả */
            text-shadow: 0 0 4px rgba(255, 255, 255, 0.1), 
                         0 0 8px rgba(255, 255, 255, 0.1), 
                         0 0 12px rgba(230, 210, 170, 0.2); /* E6D2AA */
          }
          50% {
            /* Giảm độ sáng và độ lan toả (GIẢM THÊM) */
            text-shadow: 0 0 6px rgba(255, 255, 255, 0.4), 
                         0 0 10px rgba(255, 255, 255, 0.4), 
                         0 0 16px rgba(230, 210, 170, 0.6); /* E6D2AA */
          }
          100% {
            /* Giảm độ sáng và độ lan toả */
            text-shadow: 0 0 4px rgba(255, 255, 255, 0.3), 
                         0 0 8px rgba(255, 255, 255, 0.3), 
                         0 0 12px rgba(230, 210, 170, 0.5); /* E6D2AA */
          }
        }

        .hero-title-radiant {
          /* Màu chữ vàng champagne nhạt */
          color: #c29200; 
          font-weight: 700;
          /* Áp dụng animation (ĐÃ TĂNG THỜI GIAN) */
          /*animation: radiant-glow 8s ease-in-out infinite;*/
        }
      `}</style>

      {/* 1️⃣ Hero Section (Ảnh) 
      <section className="relative h-[90vh] w-full overflow-hidden bg-black">
      
        <img
          src="https://scontent.fsgn8-3.fna.fbcdn.net/v/t39.30808-6/518270070_122114723852925027_1474162925335887281_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeGEGJwUfCEKpocFHLprtYhBYR0NvsrPIwBhHQ2-ys8jAErA9ywNY4v7wkietu-V8DeFGlfVbCED0rvowTWVJNOr&_nc_ohc=wpObEUfrdagQ7kNvwHuJRqi&_nc_oc=AdmI9udcPcq56U_g4Lw3Tx2tsbvaMxtIouMzTqP8eaq8Em2cU63xRwFB2JJ1V4btSEqlzVBNPTmoHeWxtEEy6OxO&_nc_zt=23&_nc_ht=scontent.fsgn8-3.fna&_nc_gid=vgcM8jZzs3O9TSe_1ecPgw&oh=00_AfgIVR-J-ONN2JCbtMNCzpHvzjLSisPbv4HD2etigli-7A&oe=691AA70E"
          alt="LUISSIMI Hero Image"
          className="w-full h-full object-contain"
        />

        <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-4">
         
        </div>
      </section>*/}
      <section className="relative h-[90vh] w-full overflow-hidden bg-black">
        <video
          src={heroVideo}
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        />

        {/* Overlay & slogan */}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="hero-title-radiant text-5xl md:text-6xl font-playfair tracking-wide text-center">
            LUISSIMI
          </h1>
        </div>
      </section>

      {/* 2️⃣ Khám phá phong cách (Carousel) */}
      <section className="py-16 md:py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto relative px-4">
          {/* Vùng chứa carousel */}
          <div
            ref={scrollContainerRef}
            className="flex space-x-4 md:space-x-6 overflow-x-auto snap-x snap-mandatory carousel-container"
          >
            {carouselImages.map((img, index) => (
              <a
                key={img.id}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSlide(index);
                }}
                className="flex-none w-3/4 sm:w-1/2 md:w-1/3 lg:w-1/4 snap-center block group"
              >
                <div className="overflow-hidden rounded-lg relative aspect-[4/5] shadow-md">
                  <img
                    src={img.imageUrl}
                    alt={`Phong cách ${img.id}`}
                    className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/10"></div>
                </div>
              </a>
            ))}
          </div>

          {/* Nút điều hướng */}
          {/* Nút Trái */}
          <button
            onClick={handlePrev}
            className="absolute top-1/2 left-0 md:-left-6 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2.5 shadow-md transition z-10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 text-stone-800"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>

          {/* Nút Phải */}
          <button
            onClick={handleNext}
            className="absolute top-1/2 right-0 md:-right-6 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2.5 shadow-md transition z-10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 text-stone-800"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>

          {/* Chấm tròn điều hướng */}
          <div className="flex justify-center space-x-2 mt-8">
            {carouselImages.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToSlide(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300
                  ${
                    activeIndex === index
                      ? "bg-stone-800 scale-110"
                      : "bg-stone-300 hover:bg-stone-400"
                  }
                `}
              ></button>
            ))}
          </div>
        </div>
      </section>
      {/* 3️⃣ Câu chuyện thương hiệu (Thiết kế lại) */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center px-6">
          <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm bg-white p-8 flex justify-center items-center">
            <img
              src="https://scontent.fsgn8-3.fna.fbcdn.net/v/t39.30808-6/518270070_122114723852925027_1474162925335887281_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeGEGJwUfCEKpocFHLprtYhBYR0NvsrPIwBhHQ2-ys8jAErA9ywNY4v7wkietu-V8DeFGlfVbCED0rvowTWVJNOr&_nc_ohc=wpObEUfrdagQ7kNvwHDjq7o&_nc_oc=Adl5lGpZtr847LMMJ9w9pGyY3yUqXm6T3CWWkeqsipUrLxfeKTgSPB6O83tYHAlKNKM6ANo70rKT4rR9YVEMbJba&_nc_zt=23&_nc_ht=scontent.fsgn8-3.fna&_nc_gid=81d7bKFU8nw__R3pgS1fDQ&oh=00_AfjEdLBkMhYQO2guGb1btUU1c_solf1v6oNU_Iln4bbAEw&oe=691D11CE" /* <-- ⚠️ THAY THẾ URL NÀY */
              alt="Logo Namgia Atelier"
              className="w-full max-w-xs" /* Bạn có thể điều chỉnh max-w-xs nếu cần */
            />
          </div>

          <div className="text-left">
            {/* Pre-title */}
            <h3 className="text-sm font-semibold tracking-widest text-amber-700 uppercase mb-3">
              Nghệ thuật thủ công
            </h3>

            <h2 className="text-4xl font-playfair tracking-wide mb-6 text-stone-800">
              Câu chuyện thương hiệu
            </h2>

            {/* Dùng border-l ở đây */}
            <div className="border-l-2 border-amber-700 pl-6 space-y-4">
              <p className="text-stone-600 leading-relaxed">
                LUISSIMI được thành lập với sứ mệnh mang lại sự tinh tế và sang
                trọng trong từng sản phẩm da thật. Chúng tôi kết hợp tay nghề
                thủ công truyền thống cùng thiết kế đương đại để tạo nên những
                chiếc túi mang đậm dấu ấn cá nhân.
              </p>
              <p className="text-stone-600 leading-relaxed">
                Mỗi sản phẩm là một tác phẩm nghệ thuật, được chăm chút tỉ mỉ
                bởi những nghệ nhân tài hoa, mang theo câu chuyện về đam mê và
                sự hoàn hảo.
              </p>
            </div>

            {/* Nút CTA */}
            <a
              href="/about"
              className="inline-block bg-stone-800 text-white font-semibold py-3 px-6 rounded-md tracking-wide hover:bg-stone-700 transition-colors mt-8"
            >
              Khám phá thêm
            </a>
          </div>
        </div>
      </section>

      {/* 4️⃣ Bộ sưu tập nổi bật */}
      <section className="py-16 md:py-20 px-6 bg-stone-50">
        <h2 className="text-3xl md:text-4xl font-playfair text-center mb-12">
          Bộ sưu tập nổi bật
        </h2>
        {loading ? (
          <p className="text-center text-stone-500">Đang tải...</p>
        ) : (
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {products.slice(0, 4).map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* 5️⃣ Nghệ thuật thủ công (Lookbook) */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-playfair text-center mb-12">
            Nghệ thuật thủ công
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="relative overflow-hidden rounded-lg shadow-md aspect-[4/5] group">
              <img
                src="https://images.pexels.com/photos/6649424/pexels-photo-6649424.jpeg"
                alt="Chi tiết sản phẩm 1"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="relative overflow-hidden rounded-lg shadow-md aspect-[4/5] group">
              <img
                src="https://images.pexels.com/photos/6650020/pexels-photo-6650020.jpeg"
                alt="Chi tiết sản phẩm 2"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="relative overflow-hidden rounded-lg shadow-md aspect-[4/5] group">
              <img
                src="https://scontent.fsgn8-4.fna.fbcdn.net/v/t39.30808-6/518275027_122114725556925027_2310468007716738461_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=cc71e4&_nc_eui2=AeGQli1Jd51rhKyo1nzvdFb9a_kqrH4pgyBr-SqsfimDIBdKAbb-9-WhiwBSIqT4K98K0a0Ptp1quPmhWXYDiYEQ&_nc_ohc=xeERsgp36AwQ7kNvwFTO5sK&_nc_oc=AdnNWDszXOKdvFoOfHDd_SR9m4C9Dy9DZYfOQvwqJ4ZrLd2zaLbMuIjSYJl7LOKqf22Iwf8ewtuNX37jdSOF6H_J&_nc_zt=23&_nc_ht=scontent.fsgn8-4.fna&_nc_gid=jylugD1RBONWx4dS5siD-g&oh=00_Afgv72fNeGc2JYaICnp3B-ROOfiIIsi9nj1ZmnCkJsRIxw&oe=691CEFC1"
                alt="Chi tiết sản phẩm 3"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      {/* --- ✨ SECTION 6 ĐÃ ĐƯỢC THAY THẾ ✨ --- */}
      {/* 6️⃣ Sản phẩm nổi bật (Layout "IG Post" So Le) */}
      <section className="py-16 md:py-24 bg-stone-100">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-playfair text-center mb-16 text-stone-800">
            Từ bộ sưu tập
          </h2>

          {loading ? (
            <p className="text-center text-stone-500">Đang tải...</p>
          ) : (
            // Dùng flex-col để các post xếp chồng lên nhau
            <div className="flex flex-col gap-16 md:gap-24">
              {/* Lấy 3 sản phẩm đầu tiên để làm nổi bật */}
              {products.slice(0, 3).map((p, index) => (
                <FeaturedProductPost
                  key={p._id}
                  product={p}
                  // Cứ mỗi 2 sản phẩm thì đổi layout (so le)
                  align={index % 2 === 0 ? "left" : "right"}
                />
              ))}
            </div>
          )}

          {/* Nút Xem tất cả */}
          <div className="text-center mt-16 md:mt-24">
            <button
              onClick={() => navigate("/collection")}
              className="border border-stone-800 text-stone-800 font-semibold px-8 py-3 rounded-full hover:bg-stone-800 hover:text-white transition-all duration-300 tracking-wide"
            >
              Xem tất cả sản phẩm
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
