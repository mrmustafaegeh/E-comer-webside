"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Eye,
  Edit2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Order {
  id: string;
  user?: {
    email: string;
    name?: string;
    avatar?: string;
  };
  status: string;
  totalPrice: number;
  itemsCount: number;
  createdAt: string;
}

interface RecentOrdersTableProps {
  orders: Order[];
}

export default function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  if (!orders || orders.length === 0) {
    return (
      <div className="bg-[#161b27] border border-white/5 rounded-[2rem] p-8 text-center text-gray-500 font-mono text-xs">
        No orders found in protocol queue
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    switch (s) {
      case "delivered":
        return (
           <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] uppercase font-mono tracking-widest rounded-full border border-emerald-500/20 shadow-[0_0_8px_rgba(16,185,129,0.1)]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_5px_rgba(16,185,129,0.8)]"></span>
              {status}
           </span>
        );
      case "processing":
        return (
           <span className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-500/10 text-blue-400 text-[10px] uppercase font-mono tracking-widest rounded-full border border-blue-500/20 shadow-[0_0_8px_rgba(59,130,246,0.1)]">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500"></span>
              </span>
              {status}
           </span>
        );
      case "pending":
        return (
           <span className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 text-amber-400 text-[10px] uppercase font-mono tracking-widest rounded-full border border-amber-500/20 shadow-[0_0_8px_rgba(245,158,11,0.1)]">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              {status}
           </span>
        );
      case "cancelled":
        return (
           <span className="flex items-center gap-1.5 px-2.5 py-1 bg-red-500/10 text-red-400 text-[10px] uppercase font-mono tracking-widest rounded-full border border-red-500/20 shadow-[0_0_8px_rgba(239,68,68,0.1)]">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
              {status}
           </span>
        );
      default:
        return (
           <span className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-500/10 text-gray-400 text-[10px] uppercase font-mono tracking-widest rounded-full border border-gray-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
              {status}
           </span>
        );
    }
  };

  const totalPages = Math.ceil(orders.length / itemsPerPage);
  const currentData = orders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-[#161b27] border border-white/5 hover:border-white/10 transition-colors duration-300 rounded-[2rem] overflow-hidden flex flex-col h-full group"
    >
      <div className="p-6 border-b border-white/5 flex items-center justify-between relative z-10">
        <div>
           <h2 className="text-lg font-sora font-semibold text-white tracking-tight leading-none mb-1">Live Order Stream</h2>
           <p className="text-[10px] font-mono tracking-widest uppercase text-gray-500">Recent Transactions</p>
        </div>
        <Link href="/admin/orders" className="text-xs font-mono tracking-widest uppercase text-blue-400 hover:text-blue-300 drop-shadow-[0_0_8px_rgba(59,130,246,0.2)]">
           View Matrix →
        </Link>
      </div>

      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#0f1117]/50 border-b border-white/5">
              {["Order ID", "Customer", "Items", "Total", "Status", "Date"].map((th) => (
                <th key={th} className="px-5 py-3 text-[9px] font-mono uppercase tracking-widest text-gray-500 group/th cursor-pointer hover:text-gray-300 transition-colors">
                  <div className="flex items-center gap-1.5">
                    {th}
                    <ArrowUpDown size={10} className="opacity-0 group-hover/th:opacity-100 transition-opacity" />
                  </div>
                </th>
              ))}
              <th className="px-5 py-3 text-[9px] font-mono uppercase tracking-widest text-gray-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <AnimatePresence>
            {currentData.map((order, i) => {
              const customerName = order.user?.name || "Guest Entity";
              const avatarLetter = customerName[0] || "?";
              const d = new Date(order.createdAt);
              
              return (
                <motion.tr 
                  key={order.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.05 }}
                  className="hover:bg-white/[0.02] group/row transition-colors relative"
                >
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <span className="text-xs font-mono text-gray-300">
                      #{order.id.slice(-8).toUpperCase()}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      {order.user?.avatar ? (
                        <Image src={order.user.avatar} alt="avatar" width={24} height={24} className="rounded-full border border-white/10" />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-white text-[10px] font-bold font-mono">
                          {avatarLetter}
                        </div>
                      )}
                      <div>
                        <p className="text-xs text-gray-200 font-sora truncate max-w-[120px] leading-tight">{customerName}</p>
                        <p className="text-[9px] text-gray-500 font-mono tracking-widest truncate max-w-[120px]">{order.user?.email || "No email"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                     <span className="px-2 py-0.5 bg-[#0f1117] border border-white/5 rounded text-[10px] font-mono text-gray-400 ">{order.itemsCount}x</span>
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                     <span className="text-sm font-mono text-white font-medium">${order.totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap">
                     {getStatusBadge(order.status)}
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap text-xs text-gray-400 font-mono tracking-tight">
                     {d.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </td>
                  <td className="px-5 py-3.5 whitespace-nowrap text-right relative">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover/row:opacity-100 transition-all transform translate-x-4 group-hover/row:translate-x-0">
                       <button className="p-1.5 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors border border-transparent hover:border-blue-500/20 shadow-[0_0_8px_rgba(59,130,246,0)] hover:shadow-[0_0_8px_rgba(59,130,246,0.2)]">
                         <Eye size={14} />
                       </button>
                       <button className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors border border-transparent hover:border-white/10">
                         <Edit2 size={14} />
                       </button>
                    </div>
                                        <div className="absolute right-5 top-1/2 -translate-y-1/2 group-hover/row:opacity-0 transition-opacity">
                      <MoreVertical size={14} className="text-gray-600" />
                    </div>
                  </td>
                </motion.tr>
              );
            })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-white/5 flex items-center justify-between bg-[#0f1117]/30">
         <span className="text-[10px] font-mono tracking-widest uppercase text-gray-500">
           Page {currentPage} of {totalPages || 1}
         </span>
         <div className="flex items-center gap-1 text-[10px] font-mono tracking-widest uppercase">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(c => c - 1)}
              className="p-1.5 rounded bg-[#161b27] border border-white/5 text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400 flex items-center gap-1 transition-colors"
            >
              <ChevronLeft size={12} /> Prev
            </button>
            <button 
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(c => c + 1)}
              className="p-1.5 rounded bg-[#161b27] border border-white/5 text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400 flex items-center gap-1 transition-colors"
            >
              Next <ChevronRight size={12} />
            </button>
         </div>
      </div>
    </motion.div>
  );
}
