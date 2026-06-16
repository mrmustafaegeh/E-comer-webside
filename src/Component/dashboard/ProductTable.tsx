"use client";

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Image from "next/image";
import Link from "next/link";
import { Edit3, Trash2, Eye, Package, ArrowUpDown, ServerCrash, LoaderCircle } from "lucide-react";
import { deleteAdminProduct } from "../../store/adminProductSlice";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductTable({ products }: { products: any }) {
  const dispatch = useDispatch();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc" });

  const handleDelete = async (productId: string) => {
    if (!confirm("Execute terminal deletion for this asset?")) {
      return;
    }

    setDeletingId(productId);
    try {
      await (dispatch as any)(deleteAdminProduct(productId as any)).unwrap();
    } catch (error) {
      console.error("Deletion failure:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const sortedProducts = [...products].sort((a: any, b: any) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];
      
      if (typeof aVal === "string") aVal = aVal.toLowerCase();
      if (typeof bVal === "string") bVal = bVal.toLowerCase();

      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
  });

  const toggleSort = (key: string) => {
      setSortConfig(prev => ({
          key,
          direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc"
      }));
  };

  return (
    <div className="overflow-x-auto w-full relative">
      <table className="w-full text-left border-collapse">
        <thead className="bg-[var(--bg-subtle)]/80 backdrop-blur-md sticky top-0 z-20 border-b border-[var(--border)]">
          <tr>
            {[
                { label: "Asset Designation", key: "name" },
                { label: "Classification", key: "category" },
                { label: "Base Valuation", key: "price" },
                { label: "Inventory Level", key: "stock" }
            ].map((col: any) => (
                <th key={col.key} className="px-6 py-4 cursor-pointer group hover:bg-white/5 transition-colors" onClick={() => toggleSort(col.key)}>
                    <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest uppercase text-[var(--text-muted)] group-hover:text-blue-400 transition-colors">
                        {col.label}
                        <ArrowUpDown size={12} className={`${sortConfig.key === col.key ? 'opacity-100 text-blue-500' : 'opacity-0 group-hover:opacity-100'} transition-all`} />
                    </div>
                </th>
            ))}
            <th className="px-6 py-4 text-right text-[10px] font-mono tracking-widest uppercase text-[var(--text-muted)]">
                Operations
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 bg-[var(--bg)]">
           {sortedProducts.length === 0 ? (
               <tr>
                   <td colSpan={5} className="px-6 py-12 text-center text-[var(--text-muted)] font-mono text-sm tracking-widest uppercase">
                       No assets mapping to current query
                   </td>
               </tr>
           ) : (
                <AnimatePresence>
                {sortedProducts.map((product: any, i: number) => {
                    const id = product._id || product.id;
                    const inStock = product.stock > 0;
                    const lowStock = product.stock > 0 && product.stock <= 5;
                    
                    return (
                        <motion.tr 
                            key={id} 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2, delay: i * 0.05 }}
                            className="group/row transition-all hover:bg-white/[0.02] border-l-2 border-l-transparent hover:border-l-blue-500"
                        >
                                                <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                                <div className="relative w-12 h-12 bg-[var(--bg-subtle)] rounded-xl overflow-hidden border border-[var(--border)] flex-shrink-0 group-hover/row:border-blue-500/30 group-hover/row:shadow-[0_0_15px_rgba(59,130,246,0.2)] transition-all">
                                    {product.image || product.thumbnail ? (
                                    <Image
                                        src={product.image || product.thumbnail}
                                        alt={product.name}
                                        fill
                                        className="object-cover group-hover/row:scale-110 transition-transform duration-500"
                                        sizes="48px"
                                        unoptimized // using raw URLs in some places based on previous logs
                                    />
                                    ) : (
                                    <div className="h-full w-full flex items-center justify-center text-gray-600">
                                        <Package size={20} />
                                    </div>
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-sora text-gray-200 tracking-tight truncate max-w-[200px] group-hover/row:text-blue-400 transition-colors font-semibold">
                                        {product.name}
                                    </p>
                                    <p className="text-[10px] font-mono text-[var(--text-muted)] tracking-widest uppercase mt-0.5">
                                        ID: {id?.substring(0, 8)?.toUpperCase()}
                                    </p>
                                </div>
                            </div>
                        </td>

                                                <td className="px-6 py-4">
                            <span className="inline-flex text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 bg-[var(--bg-subtle)] border border-[var(--border)] text-[var(--text-muted)] rounded-md shadow-inner">
                                {product.category || "General"}
                            </span>
                        </td>

                                                <td className="px-6 py-4">
                            <p className="text-sm font-mono font-bold text-[var(--text)] tracking-tighter">
                                {formatPrice(product.price)}
                            </p>
                            {product.salePrice && (
                            <p className="text-[9px] font-mono text-emerald-400 uppercase tracking-widest mt-0.5 animate-pulse">
                                Promo active
                            </p>
                            )}
                        </td>

                                                <td className="px-6 py-4">
                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm border text-[10px] font-mono uppercase tracking-widest shadow-inner
                                ${!inStock ? 'bg-red-500/10 border-red-500/20 text-red-400' : 
                                  lowStock ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 
                                  'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}`
                            }>
                                <div className={`w-1.5 h-1.5 rounded-full 
                                    ${!inStock ? 'bg-red-400' : lowStock ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} 
                                />
                                {!inStock ? "Depleted" : `${product.stock} Units`}
                            </div>
                        </td>

                                                <td className="px-6 py-4 text-right relative">
                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover/row:opacity-100 transition-all transform translate-x-4 group-hover/row:translate-x-0">
                                <Link
                                    href={`/products/${id}`}
                                    className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors border border-transparent hover:border-blue-500/20 shadow-[0_0_8px_rgba(59,130,246,0)] hover:shadow-[0_0_8px_rgba(59,130,246,0.2)]"
                                    title="View Frontend Page"
                                >
                                    <Eye size={16} />
                                </Link>

                                <Link
                                    href={`/admin/admin-products/${id}`}
                                    className="p-2 text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-white/5 rounded-lg transition-colors border border-transparent hover:border-[var(--border)]"
                                    title="Edit Configuration"
                                >
                                    <Edit3 size={16} />
                                </Link>

                                <button
                                    onClick={() => handleDelete(id)}
                                    disabled={deletingId === id}
                                    className="p-2 text-red-500/70 hover:text-red-400 hover:bg-red-500/10 rounded-lg border border-transparent hover:border-red-500/20 transition-all disabled:opacity-50 ml-2"
                                    title="Execute Deletion"
                                >
                                    {deletingId === id ? (
                                        <LoaderCircle size={16} className="animate-spin text-red-500" />
                                    ) : (
                                        <Trash2 size={16} />
                                    )}
                                </button>
                            </div>
                            <div className="absolute right-8 top-1/2 -translate-y-1/2 group-hover/row:opacity-0 transition-opacity">
                                <span className="w-4 h-1 border-t border-b border-gray-600 rounded inline-block"></span>
                            </div>
                        </td>
                        </motion.tr>
                    );
                })}
                </AnimatePresence>
           )}
        </tbody>
      </table>
    </div>
  );
}
