import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Award, Hammer, Infinity } from "lucide-react";
import api from "../api/axios";
import Masonry from "react-masonry-css";
import PinterestCard from "../components/PinterestCard";
import FeaturedInstagramCard from "../components/FeaturedInstagramCard";
// --- Helper Function ---
const formatCurrency = (amount) => {
  if (typeof amount !== "number") amount = Number(amount) || 0;
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

// Cấu hình số cột cho từng loại màn hình
const masonryBreakpoints = {
  default: 4,
  1024: 3,
  768: 2,
  640: 1,
};

const getCoreIcon = (title) => {
  const t = title.toLowerCase();
  if (t.includes("material") || t.includes("liệu"))
    return <Award className="text-stone-800" size={24} />;
  if (t.includes("craft") || t.includes("thủ công"))
    return <Hammer className="text-stone-800" size={24} />;
  return <Infinity className="text-stone-800" size={24} />;
};

// --- Component Con: ProductCard ---
function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);

  // Cập nhật: Lấy trường .image từ mảng images của Django Serializer
  const imageSrc =
    product.images && product.images.length > 0
      ? product.images[0].image
      : product.image || "https://placehold.co/400x500/EEE/AAA?text=No+Image";

  return (
    <div
      className="relative group overflow-hidden rounded-lg shadow-sm h-full flex flex-col bg-white"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${product.id}`} className="block overflow-hidden">
        <img
          src={imageSrc}
          alt={product.name}
          className="w-full h-auto object-cover aspect-[4/5] transition-transform duration-500 ease-in-out group-hover:scale-105"
        />
      </Link>
      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

      <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent">
        <h3 className="text-white text-lg font-playfair mb-1 truncate">
          {product.name}
        </h3>
        <p className="text-stone-200 text-sm font-light">
          {formatCurrency(product.price)}
        </p>
      </div>

      <Link
        to={`/product/${product.id}`}
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/90 text-stone-900 text-sm px-5 py-2.5 rounded-full shadow-md
                    transition-all duration-300 ease-in-out
                    ${
                      isHovered ? "opacity-100 scale-100" : "opacity-0 scale-90"
                    }`}
      >
        Xem chi tiết
      </Link>
    </div>
  );
}

// --- Component Chính ---
export default function Home() {
  const [products, setProducts] = useState([]);
  const [cmsData, setCmsData] = useState({
    hero: null,
    story: null,
    crafts: [],
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Gọi đồng thời tất cả các API CMS và Sản phẩm nổi bật
        const [heroRes, storyRes, craftsRes, prodRes] = await Promise.all([
          api.get("/hero/"),
          api.get("/brand-story/"),
          api.get("/craftsmanship/"),
          api.get("/products/?is_featured=true"),
        ]);

        // Hàm helper để trích xuất dữ liệu từ kết quả trả về của Django (có results hoặc không)
        const extractData = (res) =>
          res.data.results || (Array.isArray(res.data) ? res.data : []);

        const heroList = extractData(heroRes);
        const storyList = extractData(storyRes);
        console.log("Dữ liệu Story nhận được:", storyRes.data);
        setCmsData({
          hero: heroList[0] || null, // Lấy bản ghi đầu tiên đang active
          story: storyList[0] || null,
          crafts: extractData(craftsRes),
        });

        setProducts(extractData(prodRes));
      } catch (error) {
        console.error("Lỗi đồng bộ dữ liệu Admin:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <main className="bg-stone-50 min-h-screen text-stone-900 font-inter">
      <style>{`
        .carousel-container { -ms-overflow-style: none; scrollbar-width: none; }
        .carousel-container::-webkit-scrollbar { display: none; }
        .hero-title-radiant { color: #c29200; font-weight: 700; }
      `}</style>

      {/* 1️⃣ Hero Section - Lấy từ Django Admin */}
      <section className="relative h-[90vh] w-full overflow-hidden bg-black">
        {cmsData.hero?.is_video ? (
          <video
            src={cmsData.hero.media}
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          />
        ) : (
          <img
            src={
              cmsData.hero?.media ||
              "https://placehold.co/1920x1080?text=LUISSIMI+LUXURY"
            }
            className="w-full h-full object-cover"
            alt="Hero Banner"
          />
        )}
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center px-4">
          <h1 className="hero-title-radiant text-5xl md:text-7xl font-playfair tracking-wide mb-4 uppercase">
            {cmsData.hero?.title || "LUISSIMI"}
          </h1>
          <p className="text-white/80 text-lg md:text-xl font-light tracking-widest uppercase italic">
            {cmsData.hero?.subtitle}
          </p>
        </div>
      </section>

      {/* 2️⃣ Khám phá phong cách (Carousel Sản phẩm nổi bật) */}
      <section className="py-16 md:py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto relative px-4">
          <div
            ref={scrollContainerRef}
            className="flex space-x-4 md:space-x-6 overflow-x-auto snap-x snap-mandatory carousel-container"
          >
            {products.map((item) => (
              <div
                key={item.id}
                className="flex-none w-3/4 sm:w-1/2 md:w-1/3 lg:w-1/4 snap-center"
              >
                <ProductCard product={item} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3️⃣ Câu chuyện thương hiệu - Lấy từ Django Admin */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center px-6">
          <div className="rounded-lg overflow-hidden border border-gray-100 shadow-sm bg-stone-50 p-4 flex justify-center items-center">
            <img
              src={cmsData.story?.image || "/core/static/brand/logo.png"}
              className="w-full h-auto object-cover rounded shadow-inner"
              alt="Brand Heritage"
            />
          </div>

          <div className="text-left">
            <h3 className="text-sm font-semibold tracking-widest text-amber-700 uppercase mb-3">
              {cmsData.story?.heading || "NGHỆ THUẬT THỦ CÔNG"}
            </h3>
            <h2 className="text-4xl font-playfair tracking-wide mb-6 text-stone-800">
              {cmsData.story?.sub_heading || "Câu chuyện thương hiệu"}
            </h2>
            <div className="border-l-2 border-amber-700 pl-6 space-y-4">
              <p className="text-stone-600 leading-relaxed whitespace-pre-line text-lg">
                {/* Sử dụng white-space: pre-line để giữ các dòng trống từ Admin */}
                {cmsData.story?.content ||
                  "Đang cập nhật câu chuyện thương hiệu của chúng tôi..."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Giá trị cốt lõi (Lookbook) - Lấy từ Django Admin */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-6">
          {/* Tiêu đề chính: Sử dụng màu nâu đồng #8B5E34 */}
          <h2 className="text-3xl md:text-4xl font-playfair text-center mb-16 uppercase tracking-[0.2em] text-[#8B5E34]">
            Giá trị cốt lõi
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {(Array.isArray(cmsData.crafts) ? cmsData.crafts : []).map(
              (item) => (
                <div key={item.id} className="flex flex-col group">
                  <div className="relative aspect-square overflow-hidden bg-white mb-6 shadow-sm border border-stone-100">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    {/* Icon: Sử dụng màu nâu đồng để đồng bộ */}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-bl-2xl shadow-md border-l border-b border-stone-100">
                      {React.cloneElement(getCoreIcon(item.title), {
                        className: "text-[#8B5E34]",
                      })}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {/* Tiêu đề Card: Màu nâu gỗ đậm #4E342E tạo sự vững chãi */}
                    <h3 className="text-2xl font-bold font-playfair text-[#4E342E] tracking-tight">
                      {item.title}
                    </h3>
                    {/* Mô tả: Màu nâu xám nhẹ để không làm lấn lướt tiêu đề */}
                    <p className="text-[#6D4C41] leading-relaxed text-sm md:text-base font-inter">
                      {item.description ||
                        "Cam kết mang đến sự tinh tế và chất lượng vượt thời gian."}
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* 5 Grid Bộ sưu tập nổi bật */}
      <section className="py-24 px-6 bg-stone-50">
        <div className="max-w-5xl mx-auto">
          {/* Heading Section */}
          <div className="mb-20">
            <h2 className="text-4xl md:text-5xl font-playfair uppercase tracking-[0.2em] text-stone-800">
              Sản phẩm <br />{" "}
              <span className="ml-12 italic text-amber-800">Nổi bật</span>
            </h2>
            <div className="w-24 h-0.5 bg-stone-300 mt-6 ml-1"></div>
          </div>

          {/* Grid so le (Staggered Layout) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-20">
            {products
              .filter((p) => p.is_featured)
              .map((item, index) => (
                <FeaturedInstagramCard
                  key={item.id}
                  product={item}
                  index={index}
                />
              ))}
          </div>
        </div>
      </section>

      {/* 6️⃣ Footer CTA Final */}
      <section className="py-20 md:py-28 bg-stone-900 text-white border-t border-stone-800">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-playfair mb-8 italic leading-snug">
            Sự sang trọng bắt đầu từ những chi tiết nhỏ nhất.
          </h2>
          <div className="w-20 h-0.5 bg-amber-600 mx-auto mb-10"></div>
          <button
            onClick={() => navigate("/collection")}
            className="mt-4 border border-amber-600 text-amber-600 font-bold px-12 py-4 rounded-full hover:bg-amber-600 hover:text-stone-900 transition-all duration-500 tracking-[0.2em] text-xs"
          >
            XEM TẤT CẢ SẢN PHẨM
          </button>
        </div>
      </section>
    </main>
  );
}
