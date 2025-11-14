import React, { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import QuickViewModal from "../components/QuickViewModal";

export default function Collection() {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
 
  // filter state
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("newest"); // newest | price_asc | price_desc
  const limit = 12;

  // quick view
  const [openQV, setOpenQV] = useState(false);
  const [current, setCurrent] = useState(null);
  
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
  }, [search, category, minPrice, maxPrice, sort, page]);

  useEffect(() => {
    let mounted = true;
    api
      .get(`/products?${query}`)
      .then((res) => {
        const data = res.data?.products
          ? res.data
          : { products: res.data, total: res.data?.length || 0 };
        if (!mounted) return;
        setProducts(data.products || []);
        setTotal(data.total || 0);
      })
      .catch((err) => console.error("Lỗi tải sản phẩm:", err));
    return () => (mounted = false);
  }, [query]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const onQuickView = (p) => {
    setCurrent(p);
    setOpenQV(true);
  };

  return (
    <section className="bg-[var(--background)] min-h-screen">
      {/* header */}
      <div className="container mx-auto px-4 pt-14 pb-4">
        <h1 className="text-4xl md:text-5xl font-playfair text-[var(--accent)] text-center">
          Bộ sưu tập
        </h1>
        <p className="text-[var(--muted)] mt-2 text-center">
          Tinh tế trong từng chi tiết — Sang trọng trong từng khoảnh khắc
        </p>
      </div>

      {/* filters bar */}
      <div className="container mx-auto px-4 pb-4">
        <div className="grid md:grid-cols-5 gap-3">
          <input
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            placeholder="Tìm theo tên…"
            className="col-span-2 px-3 py-2 rounded-lg bg-[var(--card)] border border-[rgba(255,255,255,0.08)]"
          />
          <select
            value={category}
            onChange={(e) => {
              setPage(1);
              setCategory(e.target.value);
            }}
            className="px-3 py-2 rounded-lg bg-[var(--card)] border border-[rgba(255,255,255,0.08)]"
          >
            <option value="">Tất cả danh mục</option>
            <option value="tote">Tote</option>
            <option value="shoulder">Shoulder</option>
            <option value="crossbody">Crossbody</option>
          </select>
          <div className="flex gap-2">
            <input
              value={minPrice}
              onChange={(e) => {
                setPage(1);
                setMinPrice(e.target.value);
              }}
              placeholder="Giá từ"
              className="w-full px-3 py-2 rounded-lg bg-[var(--card)] border border-[rgba(255,255,255,0.08)]"
            />
            <input
              value={maxPrice}
              onChange={(e) => {
                setPage(1);
                setMaxPrice(e.target.value);
              }}
              placeholder="đến"
              className="w-full px-3 py-2 rounded-lg bg-[var(--card)] border border-[rgba(255,255,255,0.08)]"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => {
              setPage(1);
              setSort(e.target.value);
            }}
            className="px-3 py-2 rounded-lg bg-[var(--card)] border border-[rgba(255,255,255,0.08)]"
          >
            <option value="newest">Mới nhất</option>
            <option value="price_asc">Giá tăng dần</option>
            <option value="price_desc">Giá giảm dần</option>
          </select>
        </div>
      </div>

      {/* grid */}
      <div className="container mx-auto px-4 pb-10">
        {products.length === 0 ? (
          <div className="text-center py-24 text-[var(--muted)]">
            Không có sản phẩm phù hợp.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} onQuickView={onQuickView} />
            ))}
          </div>
        )}

        {/* pagination */}
        <div className="flex justify-center mt-10 gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-2 rounded-md border border-[rgba(255,255,255,0.08)] disabled:opacity-50"
          >
            ← Trước
          </button>
          <span className="px-3 py-2 text-[var(--muted)]">
            Trang {page}/{totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-2 rounded-md border border-[rgba(255,255,255,0.08)] disabled:opacity-50"
          >
            Sau →
          </button>
        </div>
      </div>

      {/* Quick View */}
      <QuickViewModal
        open={openQV}
        product={current}
        onClose={() => setOpenQV(false)}
      />
    </section>
  );
}
