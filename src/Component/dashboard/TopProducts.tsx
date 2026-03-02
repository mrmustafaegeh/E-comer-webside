"use client";

import React from "react";
import Image from "next/image";
import { 
   Package, 
   Award, 
   AlertTriangle, 
   TrendingUp 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Product {
  id: string;
  name: string;
  category?: string;
  sales: number;
  revenue: number;
  stock: number;
  image?: string;
}

interface TopProductsProps {
  products: Product[];
}

export default function TopProducts({ products }: TopProductsProps) {
  if (!products || products.length === 0) {
    return (
      <div className="bg-[#161b27] border border-white/5 rounded-[2rem] p-8 text-center text-gray-500 font-mono text-xs">
        No asset performance recorded
      </div>
    );
  }

  // Calculate max revenue for progress bar relative scaling
  const maxRevenue = Math.max(...products.map(p => p.revenue), 1);

  const getRankMedal = (index: number) => {
     if (index === 0) return <Award size={18} className="text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]" />;
     if (index === 1) return <Award size={18} className="text-gray-300 drop-shadow-[0_0_8px_rgba(209,213,219,0.8)]" />;
     if (index === 2) return <Award size={18} className="text-amber-600 drop-shadow-[0_0_8px_rgba(217,119,6,0.8)]" />;
     return <span className="font-mono text-gray-600 text-[10px] w-[18px] text-center">{index + 1}</span>;
  };

  const getStockStatus = (stock: number) => {
     if (stock < 5) {
       return { 
         color: "text-red-400", 
         dot: "bg-red-400 shadow-[0_0_8px_rgba(239,68,68,0.8)]",
         bg: "bg-red-500/10 border-red-500/20",
         label: `${stock} Units`,
         alert: true
       };
     }
     if (stock <= 10) {
        return { 
         color: "text-amber-400", 
         dot: "bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.5)]",
         bg: "bg-amber-500/10 border-amber-500/20",
         label: `${stock} Units`,
         alert: false
       };
     }
     return { 
         color: "text-emerald-400", 
         dot: "bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]",
         bg: "bg-[#0f1117] border-white/5",
         label: `${stock} Units`,
         alert: false
       };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-[#161b27] border border-white/5 rounded-[2rem] p-6 lg:p-8 flex flex-col h-full group hover:border-[#3b82f6]/20 transition-all duration-300 relative overflow-hidden"
    >
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-600/5 blur-3xl rounded-full pointer-events-none"></div>

      <div className="flex items-center justify-between mb-8 relative z-10">
        <div>
          <h2 className="text-lg font-sora font-semibold text-white tracking-tight flex items-center gap-2">
            Top Performers
            <span className="flex items-center gap-1 px-2 py-0.5 bg-purple-500/10 text-purple-400 text-[9px] font-mono rounded border border-purple-500/20 uppercase tracking-widest">
              Leaderboard
            </span>
          </h2>
          <p className="text-[10px] font-mono uppercase tracking-widest text-gray-500 mt-1">High Value Assets</p>
        </div>
      </div>

      <div className="flex-1 space-y-4 relative z-10 overflow-x-auto no-scrollbar">
        <div className="min-w-[400px]">
          <AnimatePresence>
            {products.map((product, index) => {
              const stockStatus = getStockStatus(product.stock);
              const progressPercentage = (product.revenue / maxRevenue) * 100;
              
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-center gap-4 py-3 group/row relative border-b border-white/5 last:border-0"
                >
                                    <div className="w-8 shrink-0 flex justify-center">
                    {getRankMedal(index)}
                  </div>

                                    <div className="flex items-center gap-3 w-1/3 min-w-[150px]">
                    <div className="relative w-10 h-10 bg-[#0f1117] rounded-xl overflow-hidden border border-white/5 shadow-inner shrink-0 group-hover/row:border-blue-500/30 group-hover/row:shadow-[0_0_15px_rgba(59,130,246,0.2)] transition-all">
                      {product.image ? (
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="40px"
                          className="object-cover group-hover/row:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600">
                          <Package size={16} />
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-sora font-semibold text-gray-200 truncate pr-2 max-w-[140px] group-hover/row:text-blue-400 transition-colors">
                        {product.name}
                      </h4>
                      <p className="text-[9px] font-mono tracking-widest text-gray-500 mt-0.5 truncate uppercase">
                        {product.category || "General Asset"}
                      </p>
                    </div>
                  </div>

                                    <div className="flex-1 px-4">
                     <div className="flex justify-between items-end mb-1">
                        <span className="text-xs font-mono font-medium text-gray-300">
                          ${product.revenue.toLocaleString()}
                        </span>
                        <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">
                          {product.sales} Sold
                        </span>
                     </div>
                     <div className="w-full h-1.5 bg-[#0f1117] rounded-full overflow-hidden border border-white/5 relative">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.max(progressPercentage, 5)}%` }}
                          transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                          className={`absolute top-0 left-0 h-full rounded-full bg-gradient-to-r ${index === 0 ? 'from-blue-600 to-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'from-indigo-600 to-indigo-400 shadow-[0_0_10px_rgba(79,70,229,0.5)]'}`}
                        />
                     </div>
                  </div>

                                    <div className="w-24 shrink-0 flex flex-col items-end gap-1">
                     <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded border ${stockStatus.bg}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${stockStatus.dot}`}></span>
                        <span className={`text-[9px] font-mono uppercase tracking-widest ${stockStatus.color}`}>
                          {stockStatus.label}
                        </span>
                     </div>
                     {stockStatus.alert && (
                       <span className="flex items-center gap-1 text-[8px] font-mono uppercase tracking-widest text-red-500 animate-pulse">
                         <AlertTriangle size={8} /> Reload
                       </span>
                     )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
