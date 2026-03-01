"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Plus, Filter, Search, Loader2, Package } from "lucide-react";
import Link from "next/link";
import { fetchAdminProducts } from "../../../store/adminProductSlice";
import ProductTable from "../../../Component/dashboard/ProductTable";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminProductsPage() {
  const dispatch = useDispatch();
  const {
    items: products,
    loading,
    error,
  } = useSelector((state: any) => state.adminProducts);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    dispatch(fetchAdminProducts() as any);
  }, [dispatch]);

  const categories = [
    "all",
    ...new Set(
      (Array.isArray(products) ? products : [])
        .map((p) => p.category)
        .filter(Boolean)
    ),
  ];

  const filteredProducts = (Array.isArray(products) ? products : []).filter(
    (product) => {
      const matchesSearch =
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    }
  );

  return (
    <div className="w-full max-w-[2000px] mx-auto pb-10">
      {/* Header Segment */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div>
            <h1 className="text-3xl font-sora font-bold text-white tracking-tight flex items-center gap-3">
              <Package className="text-blue-500" size={32} />
              Asset Matrix
            </h1>
            <p className="text-sm font-mono tracking-widest uppercase text-gray-500 mt-2">
              Global Product Configuration
            </p>
        </div>
        <Link
            href="/admin/create-product"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-mono text-xs uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] border border-blue-500"
        >
            <Plus size={16} /> Mint Asset
        </Link>
      </motion.header>

      {/* Filters Minimalist */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-[#161b27] border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-4 shadow-xl mb-6 relative overflow-hidden"
      >
          <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/5 blur-3xl rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
        
          <div className="flex bg-[#0f1117] border border-white/10 rounded-xl overflow-hidden focus-within:border-blue-500/50 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all flex-1 w-full relative z-10">
             <div className="pl-4 py-3 flex items-center justify-center">
                <Search size={16} className="text-gray-500" />
             </div>
             <input
                 type="text"
                 placeholder="Query asset designation..."
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full bg-transparent border-none text-gray-200 text-sm font-sora px-3 outline-none placeholder-gray-600 shadow-inner py-3"
             />
          </div>

          <div className="relative w-full md:w-64 z-10 group">
             <select
                 value={selectedCategory}
                 onChange={(e) => setSelectedCategory(e.target.value)}
                 className="w-full appearance-none bg-[#0f1117] border border-white/10 rounded-xl text-xs font-mono tracking-widest uppercase text-gray-300 px-4 pl-10 py-3 outline-none hover:border-white/20 transition-all cursor-pointer shadow-inner focus:border-blue-500/50"
             >
                 {categories.map((cat) => (
                    <option key={cat as string} value={cat as string}>
                        {cat === "all" ? "All Classifications" : (cat as string).toUpperCase()}
                    </option>
                 ))}
             </select>
             <Filter size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>
      </motion.div>

      {/* Main Database Table Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-[#161b27] rounded-2xl border border-white/5 shadow-2xl relative overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loader" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-[500px] flex flex-col items-center justify-center">
               <Loader2 className="animate-spin text-blue-500 mb-4" size={32} />
               <p className="text-blue-400 font-mono text-[10px] uppercase tracking-widest animate-pulse">Scanning Global Inventory Array...</p>
            </motion.div>
          ) : error ? (
            <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-12 text-center">
               <h3 className="text-xl font-sora font-semibold text-red-500 mb-2">Protocol: Critical Node Error</h3>
               <p className="text-gray-400 font-mono text-sm tracking-widest mb-6">{error}</p>
               <button
                  onClick={() => dispatch(fetchAdminProducts() as any)}
                  className="px-6 py-2 border border-red-500/50 hover:bg-red-500/10 text-red-400 rounded-lg text-[10px] font-mono uppercase tracking-widest transition-all"
               >
                 Re-Initiate Handshake
               </button>
            </motion.div>
          ) : filteredProducts.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center py-20 px-6">
                <div className="w-16 h-16 bg-[#0f1117] rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/5 shadow-inner">
                    <Package size={24} className="text-gray-500" />
                </div>
                <h3 className="text-lg font-sora font-semibold text-gray-200 mb-2">Null Set Returned</h3>
                <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest max-w-sm mx-auto mb-8">
                  {searchTerm || selectedCategory !== "all"
                    ? "The specified query parameters hit no records."
                    : "The primary archive is initialized but currently contains 0 assets."}
                </p>
                {!searchTerm && selectedCategory === "all" && (
                  <Link
                    href="/admin/create-product"
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600/10 border border-blue-500/30 text-blue-400 rounded-xl font-mono text-[10px] uppercase tracking-widest hover:bg-blue-600/20 hover:border-blue-400 transition-all font-semibold"
                  >
                    <Plus size={14} /> Init Genesis Asset
                  </Link>
                )}
            </motion.div>
          ) : (
            <motion.div key="table" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
               <ProductTable products={filteredProducts} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
