"use client";

import { useEffect, useMemo, useState, use } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import ProductCardFloat from "../../../Component/products/ProductCardFloat";
import { get } from "../../../services/api";
import { Search, Filter, X, ChevronLeft, ChevronRight } from "lucide-react";

export default function CategoryClient({ params }) {
  const resolvedParams = use(params);
  const categoryName = decodeURIComponent(resolvedParams.name);

  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1, limit: 12 });
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [localFilters, setLocalFilters] = useState({
    search: "",
    category: categoryName,
    minPrice: "",
    maxPrice: "",
  });

  const [appliedFilters, setAppliedFilters] = useState(localFilters);

  const queryParams = useMemo(() => {
    const p = { page: String(meta.page), limit: String(meta.limit) };
    if (appliedFilters.category) p.category = appliedFilters.category;
    if (appliedFilters.search) p.search = appliedFilters.search;
    if (appliedFilters.minPrice) p.minPrice = appliedFilters.minPrice;
    if (appliedFilters.maxPrice) p.maxPrice = appliedFilters.maxPrice;
    return p;
  }, [appliedFilters, meta.page, meta.limit]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const data = await get("products", queryParams);
        if (!cancelled) {
          setProducts(data.products || []);
          setMeta((m) => ({ ...m, total: data.total || 0, totalPages: data.totalPages || 1 }));
        }
      } catch (e) {
        console.error("Fetch failed:", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [queryParams]);

  useEffect(() => {
    setLocalFilters((f) => ({ ...f, category: categoryName }));
    setAppliedFilters((f) => ({ ...f, category: categoryName }));
    setMeta((m) => ({ ...m, page: 1 }));
  }, [categoryName]);

  return (
    <div className="min-h-screen bg-[#000208] pt-20 px-6 lg:px-12 pb-20">
      {/* HEADER */}
      <div className="relative mb-20">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-cyan-400/10 blur-[150px] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <span className="text-[10px] font-mono tracking-[0.5em] text-cyan-400 uppercase">// SECTOR: {categoryName}</span>
            <h1 className="text-6xl md:text-8xl font-display font-black leading-none uppercase tracking-tighter">
              {categoryName.replaceAll("-", " ")}
            </h1>
            <p className="text-text-secondary font-mono text-xs tracking-widest uppercase">
              {loading ? "[ SCANNING... ]" : `[ ${meta.total} OBJECTS DETECTED ]`}
            </p>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="px-8 py-4 glass-island text-[10px] font-mono uppercase tracking-widest flex items-center gap-2 hover:bg-white/10 transition-all"
            >
              <Filter size={14} />
              {showFilters ? 'CLOSE UPLINK' : 'FILTER MODULES'}
            </button>
          </div>
        </div>
      </div>

      {/* FILTER DRAWER overlay */}
      <AnimatePresence>
        {showFilters && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-12"
          >
            <div className="glass-island p-8 grid grid-cols-1 md:grid-cols-3 gap-8 border-cyan-400/20">
              <div className="space-y-4">
                <label className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest">SEARCH_QUERY</label>
                <input 
                  type="text" 
                  value={localFilters.search}
                  onChange={(e) => setLocalFilters({...localFilters, search: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 p-4 text-xs font-mono focus:border-cyan-400 outline-none"
                  placeholder="INPUT TEXT..."
                />
              </div>
              <div className="space-y-4">
                <label className="text-[9px] font-mono text-cyan-400 uppercase tracking-widest">PRICE_RANGE_MIN</label>
                <input 
                  type="number" 
                  value={localFilters.minPrice}
                  onChange={(e) => setLocalFilters({...localFilters, minPrice: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 p-4 text-xs font-mono focus:border-cyan-400 outline-none"
                  placeholder="0.00"
                />
              </div>
              <div className="flex items-end gap-4">
                <button 
                  onClick={() => setAppliedFilters(localFilters)}
                  className="flex-1 btn-glitch text-[10px]"
                >
                  APPLY_MODULES
                </button>
                <button 
                  onClick={() => {
                    const cleared = { search: "", category: categoryName, minPrice: "", maxPrice: "" };
                    setLocalFilters(cleared);
                    setAppliedFilters(cleared);
                  }}
                  className="p-4 glass-island text-white hover:text-cyan-400 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PRODUCT GRID */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-[400px] glass-island animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-40 glass-island">
          <h3 className="text-2xl font-display font-black mb-4 uppercase">NO ASSETS DETECTED IN THIS SECTOR</h3>
          <button onClick={() => setAppliedFilters({search: "", category: categoryName, minPrice: "", maxPrice: ""})} className="text-cyan-400 font-mono text-[10px] tracking-widest border-b border-cyan-400/30 hover:border-cyan-400 transition-all">
            RESET ALL PROTOCOLS
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product, idx) => (
            <motion.div
              key={product._id || product.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              style={{ marginTop: (idx % 4) * 20 + 'px' }}
            >
              <ProductCardFloat product={product} />
            </motion.div>
          ))}
        </div>
      )}

      {/* PAGINATION */}
      <div className="mt-20 flex items-center justify-center gap-8">
        <button 
          disabled={meta.page <= 1}
          onClick={() => setMeta(m => ({...m, page: m.page - 1}))}
          className="p-4 glass-island text-white disabled:opacity-20 hover:text-cyan-400 transition-all"
        >
          <ChevronLeft size={20} />
        </button>
        <span className="font-mono text-xs tracking-[0.5em] text-cyan-400">
          PAGE.{meta.page} // {meta.totalPages}
        </span>
        <button 
          disabled={meta.page >= meta.totalPages}
          onClick={() => setMeta(m => ({...m, page: m.page + 1}))}
          className="p-4 glass-island text-white disabled:opacity-20 hover:text-cyan-400 transition-all"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
