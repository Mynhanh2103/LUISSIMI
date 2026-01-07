import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom"; // Thêm useNavigate để điều hướng đăng nhập
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import QuickViewModal from "../components/QuickViewModal";

export default function Collection() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [wishlistIds, setWishlistIds] = useState([]); // Quản lý danh sách ID đã thả tim
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  // filter state
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("newest");
  const limit = 12;

  // quick view
  const [openQV, setOpenQV] = useState(false);
  const [current, setCurrent] = useState(null);

  // 1. HÀM THẢ TIM (WISHLIST) - Chặn khách chưa đăng nhập
  const handleWishlist = async (e, productId) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Quý khách vui lòng đăng nhập để lưu sản phẩm yêu thích ❤️");
      navigate("/login");
      return;
    }

    try {
      await api.post("/wishlist/toggle/", { productId });
      // Cập nhật state wishlistIds ngay lập tức trên UI
      setWishlistIds((prev) =>
        prev.includes(productId)
          ? prev.filter((id) => id !== productId)
          : [...prev, productId]
      );
    } catch (err) {
      console.error("Lỗi Wishlist:", err);
    }
  };

  const onQuickView = (p) => {
    setCurrent(p);
    setOpenQV(true);
  };

  // SỬA LỖI ĐÈ ẢNH: Reset dữ liệu 'current' khi đóng modal
  const onCloseQV = () => {
    setOpenQV(false);
    setTimeout(() => setCurrent(null), 300); // Đợi hiệu ứng mờ kết thúc rồi mới xóa data
  };

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(total / limit));
  }, [total, limit]);

  const query = useMemo(() => {
    const q = new URLSearchParams();
    if (search) q.set("search", search);
    if (category) q.set("category", category);
    if (minPrice) q.set("minPrice", minPrice);
    if (maxPrice) q.set("maxPrice", maxPrice);
    if (sort) q.set("sort", sort);
    q.set("page", page);
    q.set("limit", limit);
    return q.toString();
  }, [search, category, minPrice, maxPrice, sort, page, limit]);

  useEffect(() => {
    let mounted = true;
    api
      .get(`/products/?${query}`)
      .then((res) => {
        if (!mounted) return;
        const actualProducts =
          res.data.results || (Array.isArray(res.data) ? res.data : []);
        const actualTotal = res.data.count || res.data.length || 0;
        setProducts(actualProducts);
        setTotal(actualTotal);
      })
      .catch((err) => console.error("Lỗi tải sản phẩm:", err));

    return () => {
      mounted = false;
    };
  }, [query]);

  return (
    <section className="bg-stone-50 min-h-screen">
      {/* Header */}
      <div className="container mx-auto px-4 pt-20 pb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-playfair text-[#8B5E34] uppercase tracking-tighter">
          Bộ sưu tập
        </h1>
        <p className="text-stone-400 mt-2 italic text-sm">
          Tinh tế trong từng chi tiết — Sang trọng trong từng khoảnh khắc
        </p>
      </div>

      {/* Filters Bar */}
      <div className="container mx-auto px-4 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 bg-white p-4 rounded-2xl shadow-sm border border-stone-100">
          <input
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            placeholder="Tìm sản phẩm LUISSIMI..."
            className="md:col-span-2 px-4 py-2 rounded-xl bg-stone-50 border border-stone-100 focus:outline-none focus:border-[#8B5E34] text-sm"
          />
          <select
            value={category}
            onChange={(e) => {
              setPage(1);
              setCategory(e.target.value);
            }}
            className="px-3 py-2 rounded-xl bg-stone-50 border border-stone-100 text-sm outline-none"
          >
            <option value="">Tất cả danh mục</option>
            <option value="tote">Túi Tote</option>
            <option value="shoulder">Túi Đeo Vai</option>
            <option value="crossbody">Túi Đeo Chéo</option>
          </select>
          <div className="flex gap-2">
            <input
              type="number"
              value={minPrice}
              onChange={(e) => {
                setPage(1);
                setMinPrice(e.target.value);
              }}
              placeholder="Giá từ"
              className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-100 text-sm outline-none"
            />
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => {
                setPage(1);
                setMaxPrice(e.target.value);
              }}
              placeholder="Đến"
              className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-100 text-sm outline-none"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => {
              setPage(1);
              setSort(e.target.value);
            }}
            className="px-3 py-2 rounded-xl bg-stone-50 border border-stone-100 text-sm outline-none"
          >
            <option value="newest">Mới nhất</option>
            <option value="price_asc">Giá tăng dần</option>
            <option value="price_desc">Giá giảm dần</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <div className="container mx-auto px-4 pb-20">
        {products.length === 0 ? (
          <div className="text-center py-24 text-stone-400">
            Không tìm thấy món đồ da nào phù hợp với yêu cầu của bạn.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {products.map((item) => (
              <ProductCard
                key={item.id}
                product={item}
                isLiked={wishlistIds.includes(item.id)} // Truyền trạng thái tim
                onWishlist={(e) => handleWishlist(e, item.id)} // Truyền hàm xử lý tim
                onQuickView={onQuickView}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center items-center mt-16 gap-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-6 py-2 rounded-full border border-stone-200 text-stone-600 hover:bg-stone-900 hover:text-white transition-all disabled:opacity-20 text-xs font-bold uppercase tracking-widest"
          >
            Trước
          </button>
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-400">
            Trang {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-6 py-2 rounded-full border border-stone-200 text-stone-600 hover:bg-stone-900 hover:text-white transition-all disabled:opacity-20 text-xs font-bold uppercase tracking-widest"
          >
            Sau
          </button>
        </div>
      </div>

      {/* Quick View Modal - Đã sửa lỗi đè dữ liệu */}
      <QuickViewModal open={openQV} product={current} onClose={onCloseQV} />
    </section>
  );
}
