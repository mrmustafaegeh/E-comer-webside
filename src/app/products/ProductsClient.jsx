"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LoadingSpinner from "../../Component/ui/LoadingSpinner";
import EmptyState from "../../Component/ui/EmptyState";
import { useProducts } from "../../hooks/useProducts";
import ProductList from "../../Component/products/ProductsList";
import ProductFilters from "../../Component/products/ProductFilters";
import ProductPagination from "../../Component/products/ProductPagination";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL States (Primary Source of Truth)
  const page = Math.max(1, parseInt(searchParams.get("page")) || 1);
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const sort = searchParams.get("sort") || "newest";

  const limit = 12;

  // Local Filter State (For the UI interaction before clicking "Filter")
  const [localFilters, setLocalFilters] = useState({
    search,
    category,
    minPrice,
    maxPrice,
    sort
  });

  // Sync local state when URL changes externally
  useEffect(() => {
    setLocalFilters({ search, category, minPrice, maxPrice, sort });
  }, [search, category, minPrice, maxPrice, sort]);

  // Data Fetching (Uses Hydration Boundary if data pre-fetched on server)
  const { data, isLoading, isPlaceholderData, error } = useProducts({
    page,
    limit,
    search,
    category,
    minPrice,
    maxPrice,
    sort
  });

  const updateUrl = useCallback((newParams) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Reset to page 1 on filter change unless specifically changing page
    if (newParams.page) {
        params.set("page", String(newParams.page));
    } else {
        params.set("page", "1");
    }

    Object.keys(newParams).forEach(key => {
        if (key === 'page') return;
        if (newParams[key]) {
            params.set(key, String(newParams[key]));
        } else {
            params.delete(key);
        }
    });

    router.push(`?${params.toString()}`, { scroll: false });
  }, [router, searchParams]);

  const handleApplyFilters = () => {
    updateUrl(localFilters);
  };

  const handleClearFilters = () => {
    const cleared = { search: "", category: "", minPrice: "", maxPrice: "", sort: "newest" };
    setLocalFilters(cleared);
    updateUrl(cleared);
  };

  if (error) return (
    <div className="py-32 text-center bg-black min-h-screen border-t border-white/10">
        <p className="text-white font-mono font-black uppercase tracking-[0.5em] text-xs italic animate-pulse">ERROR: PROTOCOL_FAILURE</p>
        <p className="text-gray-800 mt-6 font-mono text-[10px] uppercase tracking-widest italic">{error.message}</p>
    </div>
  );

  const products = data?.products || [];
  const totalItems = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  return (
    <div className="min-h-screen bg-black text-white relative">
       {/* Background Noise Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay pointer-events-none z-0"></div>

      <div className="w-full relative z-10">
        <ProductFilters
          localFilters={localFilters}
          setLocalFilters={setLocalFilters}
          applyFilters={handleApplyFilters}
          clearFilters={handleClearFilters}
        />
      </div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 pb-32 relative z-10">
        {/* Results Info */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 mb-16 pb-12 border-b border-white/10 relative z-10">
            <div className="flex items-center gap-6">
                <div className="w-1.5 h-10 bg-white"></div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-mono font-black text-gray-800 uppercase tracking-[0.6em] italic animate-pulse">// INVENTORY_MATRIX</span>
                  <span className="text-base font-heading font-black text-white tracking-widest uppercase italic">
                      DISPLAYING {products.length} / {totalItems} SYNCHRONIZED ASSETS
                  </span>
                </div>
                {isPlaceholderData && (
                    <span className="text-[10px] font-mono font-black text-white uppercase tracking-[0.4em] animate-pulse bg-white/5 px-4 py-2 border border-white/10 italic">
                        SYNC_IN_PROGRESS...
                    </span>
                )}
            </div>
            
            <div className="flex items-center self-end md:self-auto gap-6 bg-black border border-white/10 px-8 py-4 shadow-2xl group hover:border-white transition-all duration-700">
                <span className="text-[10px] font-mono font-black text-gray-800 uppercase tracking-[0.4em] italic group-hover:text-gray-500 transition-colors">SORT_PROTOCOL:</span>
                <select 
                    value={localFilters.sort} 
                    onChange={(e) => {
                        const newSort = e.target.value;
                        setLocalFilters(p => ({ ...p, sort: newSort }));
                        updateUrl({ ...localFilters, sort: newSort });
                    }}
                    className="text-[10px] font-mono font-black uppercase tracking-[0.3em] bg-transparent border-none text-white focus:ring-0 cursor-pointer p-0 italic"
                >
                    <option value="newest" className="bg-black text-white">LATEST_ASSETS</option>
                    <option value="price-low" className="bg-black text-white">VALUE: ASCENDING</option>
                    <option value="price-high" className="bg-black text-white">VALUE: DESCENDING</option>
                    <option value="rating" className="bg-black text-white">PROTOCOL_RATING</option>
                </select>
            </div>
        </div>

        <section className="relative">
            <AnimatePresence mode="wait">
                {isLoading && !products.length ? (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="py-48 flex justify-center"
                    >
                        <LoadingSpinner />
                    </motion.div>
                ) : products.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="py-32 text-center space-y-8"
                    >
                        <EmptyState message="0_MATCHING_ASSETS_FOUND_IN_GRID" />
                        <button 
                          onClick={handleClearFilters}
                          className="px-12 py-5 bg-white text-black font-mono font-black text-[11px] uppercase tracking-[0.4em] italic hover:bg-black hover:text-white border border-white transition-all duration-700 shadow-2xl"
                        >
                          RESET_MATRIX
                        </button>
                    </motion.div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className={isPlaceholderData ? "opacity-20 pointer-events-none transition-opacity duration-1000" : "transition-opacity duration-1000"}
                    >
                        <ProductList products={products} />
                    </motion.div>
                )}
            </AnimatePresence>
        </section>

        {/* Pagination Grid */}
        {totalPages > 1 && (
            <div className="mt-24 border-t border-white/10 pt-16">
                <ProductPagination
                    page={page}
                    totalPages={totalPages}
                    onPageChange={(newPage) => updateUrl({ ...localFilters, page: newPage })}
                />
            </div>
        )}
      </div>
    </div>
  );

}
