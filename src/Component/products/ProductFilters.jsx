"use client";

import { Search, X, DollarSign, SlidersHorizontal, Filter, ChevronDown, Terminal } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductFilters({
  localFilters,
  setLocalFilters,
  applyFilters,
  clearFilters,
}) {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const safe = localFilters || {
    search: "",
    category: "",
    minPrice: "",
    maxPrice: "",
  };

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/category");
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    }
    fetchCategories();
  }, []);

  return (
    <div className="w-full bg-black pt-24 pb-12 border-b border-white/10 relative overflow-hidden">
      {/* Background Noise Component integrated via globals.css or direct class */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-white/20"></div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
        
        {/* Editorial Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-20 relative">
            <div className="relative z-10 space-y-6">
                <span className="text-[10px] font-mono font-black text-gray-800 uppercase tracking-[0.6em] mb-4 block italic animate-pulse">
                  // Centralized Index Protocol
                </span>
                <h1 className="text-6xl md:text-9xl font-heading font-black text-white tracking-tighter leading-none uppercase italic border-l-4 border-white pl-10">
                  Discovery Hub.
                </h1>
            </div>
            <div className="relative z-10 flex flex-col items-end">
              <p className="text-[10px] font-mono font-black text-gray-700 uppercase tracking-[0.4em] max-w-[320px] leading-relaxed mb-8 italic text-right">
                  // Curated selection of high-performance digital and physical assets synthesized for the modern market.
              </p>
              <div className="h-px w-32 bg-white"></div>
            </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col lg:flex-row gap-0 items-stretch bg-black border border-white/10 shadow-2xl relative z-10 group/bar hover:border-white transition-all duration-1000 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
            {/* Search */}
            <div className="relative flex-[2] w-full group">
              <Terminal className="absolute left-8 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-800 transition-colors group-hover:text-white" strokeWidth={2.5} />
              <input
                type="text"
                placeholder="QUERY_GLOBAL_DATABASE..."
                value={safe.search}
                onChange={(e) =>
                  setLocalFilters((prev) => ({
                    ...(prev || {}),
                    search: e.target.value,
                  }))
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") applyFilters();
                }}
                className="w-full bg-transparent border-none py-8 pl-16 pr-12 text-white placeholder:text-gray-900 outline-none transition-all font-mono text-[11px] uppercase tracking-widest italic"
              />
              {safe.search && (
                <button
                  type="button"
                  onClick={() =>
                    setLocalFilters((prev) => ({
                      ...(prev || {}),
                      search: "",
                    }))
                  }
                  className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-800 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Select */}
            <div className="relative w-full lg:w-80 group">
                <Filter className="absolute left-8 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-800 transition-colors group-hover:text-white" strokeWidth={2.5} />
                <select
                    className="w-full bg-transparent border-none py-8 pl-16 pr-12 text-white font-mono text-[11px] uppercase tracking-widest appearance-none outline-none cursor-pointer transition-all italic hover:bg-white/5"
                    value={safe.category}
                    onChange={(e) =>
                        setLocalFilters((prev) => ({
                        ...(prev || {}),
                        category: e.target.value,
                        }))
                    }
                >
                    <option value="" className="bg-black">ALL_CLASSIFICATIONS</option>
                    {loadingCategories ? (
                        <option disabled className="bg-black">SYNCING...</option>
                    ) : (
                        categories.map((cat) => (
                        <option key={cat._id} value={cat.slug} className="bg-black">
                            {cat.name.toUpperCase()}
                        </option>
                        ))
                    )}
                </select>
                <ChevronDown className="absolute right-8 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-800 pointer-events-none group-hover:text-white transition-all" />
            </div>

            {/* Price Range */}
            <div className="flex items-stretch w-full lg:w-auto divide-x divide-white/10">
               <div className="relative w-full lg:w-36 group">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-800 font-mono text-[10px] font-black group-hover:text-white transition-colors">$</span>
                  <input
                    type="number"
                    className="w-full bg-transparent border-none py-8 pl-12 pr-4 text-white placeholder:text-gray-900 outline-none transition-all font-mono text-[11px] uppercase italic hover:bg-white/5"
                    placeholder="MIN"
                    value={safe.minPrice}
                    onChange={(e) =>
                      setLocalFilters((prev) => ({
                        ...(prev || {}),
                        minPrice: e.target.value,
                      }))
                    }
                  />
               </div>
               <div className="relative w-full lg:w-36 group">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-800 font-mono text-[10px] font-black group-hover:text-white transition-colors">$</span>
                  <input
                    type="number"
                    className="w-full bg-transparent border-none py-8 pl-12 pr-4 text-white placeholder:text-gray-900 outline-none transition-all font-mono text-[11px] uppercase italic hover:bg-white/5"
                    placeholder="MAX"
                    value={safe.maxPrice}
                    onChange={(e) =>
                      setLocalFilters((prev) => ({
                        ...(prev || {}),
                        maxPrice: e.target.value,
                      }))
                    }
                  />
               </div>
            </div>

            {/* Execute Button */}
            <button
               onClick={applyFilters}
               className="w-full lg:w-auto px-16 py-8 bg-white text-black font-mono font-black text-[12px] uppercase tracking-[0.5em] hover:bg-black hover:text-white transition-all duration-700 shadow-2xl italic group/btn relative overflow-hidden"
            >
              <span className="relative z-10">ANALYZE</span>
              <div className="absolute inset-0 bg-black -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-700 ease-in-out"></div>
            </button>
        </div>

        {/* Active States */}
        <AnimatePresence>
            {(safe.search || safe.category || safe.minPrice || safe.maxPrice) && (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="mt-12 flex flex-wrap items-center gap-6"
                >
                    <span className="text-[10px] font-mono font-black text-gray-800 uppercase tracking-[0.5em] italic">// ACTIVE_PROTOCOLS:</span>
                    
                    <div className="flex flex-wrap items-center gap-4">
                      {safe.search && (
                          <button 
                              onClick={() => setLocalFilters(prev => ({ ...prev, search: "" }))}
                              className="group flex items-center gap-4 bg-white text-black px-6 py-2.5 rounded-none text-[10px] font-mono font-black uppercase tracking-[0.3em] hover:bg-black hover:text-white border border-white transition-all duration-500 italic shadow-xl"
                          >
                              {safe.search.toUpperCase()} <X size={12} strokeWidth={4} className="group-hover:rotate-90 transition-transform" />
                          </button>
                      )}

                      {safe.category && (
                          <button 
                              onClick={() => setLocalFilters(prev => ({ ...prev, category: "" }))}
                              className="group flex items-center gap-4 bg-white text-black px-6 py-2.5 rounded-none text-[10px] font-mono font-black uppercase tracking-[0.3em] hover:bg-black hover:text-white border border-white transition-all duration-500 italic shadow-xl"
                          >
                              {safe.category.toUpperCase()} <X size={12} strokeWidth={4} className="group-hover:rotate-90 transition-transform" />
                          </button>
                      )}

                      {(safe.minPrice || safe.maxPrice) && (
                          <button 
                              onClick={() => setLocalFilters(prev => ({ ...prev, minPrice: "", maxPrice: "" }))}
                              className="group flex items-center gap-4 bg-white text-black px-6 py-2.5 rounded-none text-[10px] font-mono font-black uppercase tracking-[0.3em] hover:bg-black hover:text-white border border-white transition-all duration-500 italic shadow-xl"
                          >
                              ${safe.minPrice || "0"} - ${safe.maxPrice || "INF"} <X size={12} strokeWidth={4} className="group-hover:rotate-90 transition-transform" />
                          </button>
                      )}

                      <button 
                          onClick={clearFilters}
                          className="px-6 py-2.5 text-[10px] font-mono font-black text-gray-700 uppercase tracking-[0.4em] hover:text-white transition-all duration-500 italic underline underline-offset-8"
                      >
                          FLUSH_ALL_RECORDS
                      </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
      </div>
    </div>
  );
}
