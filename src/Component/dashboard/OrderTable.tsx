"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  Filter,
  ArrowUpDown,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  Clock,
  XCircle,
  Eye,
  Edit2,
  Trash2,
  Download,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function OrderTable({ orders }: { orders: any }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "desc" });
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const list = Array.isArray(orders)
    ? orders
    : Array.isArray(orders?.orders)
    ? orders.orders
    : [];

  // MOCK SOME MORE DATA IF LIST IS EMPTY FOR DEVELOPMENT VISUALS
  const devList = list.length > 0 ? list : Array.from({ length: 25 }).map((_, i) => ({
    id: `ORD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    user: { name: `Customer ${i}`, email: `user${i}@example.com` },
    status: ["delivered", "processing", "pending", "cancelled"][Math.floor(Math.random() * 4)],
    totalPrice: Math.floor(Math.random() * 1500) + 50,
    itemsCount: Math.floor(Math.random() * 5) + 1,
    createdAt: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 30).toISOString(),
  }));

  const filteredAndSorted = useMemo(() => {
    let result = devList.map((item: any) => ({
       id: item?.id || item?._id || "Unknown",
       name: item?.user?.name || item?.userEmail || item?.shippingAddress?.fullName || "Guest Entity",
       email: item?.user?.email || item?.userEmail || "No email",
       status: (item?.status || "pending").toLowerCase(),
       total: item?.totalPrice ?? item?.total ?? 0,
       itemsCount: Array.isArray(item?.items) ? item.items.length : Array.isArray(item?.products) ? item.products.length : (item.itemsCount || 0),
       date: item?.createdAt ? new Date(item.createdAt) : new Date(),
    }));

    // Filter by search
    if (searchTerm) {
      result = result.filter((o: any) => 
        o.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
        o.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      result = result.filter((o: any) => o.status === statusFilter);
    }

    // Sort
    result.sort((a: any, b: any) => {
      if (sortConfig.key === "date") {
        return sortConfig.direction === "asc" 
          ? a.date.getTime() - b.date.getTime()
          : b.date.getTime() - a.date.getTime();
      }
      if (sortConfig.key === "total") {
        return sortConfig.direction === "asc" ? a.total - b.total : b.total - a.total;
      }
      if (sortConfig.key === "status") {
        return sortConfig.direction === "asc" 
          ? a.status.localeCompare(b.status)
          : b.status.localeCompare(a.status);
      }
      if (sortConfig.key === "id") {
         return sortConfig.direction === "asc"
            ? a.id.localeCompare(b.id)
            : b.id.localeCompare(a.id);
      }
      return 0;
    });

    return result;
  }, [devList, searchTerm, statusFilter, sortConfig]);

  const totalPages = Math.ceil(filteredAndSorted.length / itemsPerPage);
  const currentData = filteredAndSorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc"
    }));
  };

  const toggleSelectAll = () => {
    if (selectedOrders.size === currentData.length) {
      setSelectedOrders(new Set());
    } else {
      setSelectedOrders(new Set(currentData.map((o: any) => o.id)));
    }
  };

  const toggleSelectOne = (id: string) => {
    const newSet = new Set(selectedOrders);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedOrders(newSet);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return (
           <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] uppercase font-mono tracking-widest rounded-full border border-emerald-500/20 shadow-[0_0_8px_rgba(16,185,129,0.1)] w-fit lg:w-32 justify-center">
              <CheckCircle2 size={12} /> {status}
           </span>
        );
      case "processing":
        return (
           <span className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-500/10 text-blue-400 text-[10px] uppercase font-mono tracking-widest rounded-full border border-blue-500/20 shadow-[0_0_8px_rgba(59,130,246,0.1)] w-fit lg:w-32 justify-center">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              {status}
           </span>
        );
      case "pending":
        return (
           <span className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 text-amber-400 text-[10px] uppercase font-mono tracking-widest rounded-full border border-amber-500/20 shadow-[0_0_8px_rgba(245,158,11,0.1)] w-fit lg:w-32 justify-center">
              <Clock size={12} /> {status}
           </span>
        );
      case "cancelled":
        return (
           <span className="flex items-center gap-1.5 px-2.5 py-1 bg-red-500/10 text-red-400 text-[10px] uppercase font-mono tracking-widest rounded-full border border-red-500/20 shadow-[0_0_8px_rgba(239,68,68,0.1)] w-fit lg:w-32 justify-center">
              <XCircle size={12} /> {status}
           </span>
        );
      default:
        return (
           <span className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-500/10 text-gray-400 text-[10px] uppercase font-mono tracking-widest rounded-full border border-gray-500/20 w-fit lg:w-32 justify-center">
              <AlertCircle size={12} /> {status}
           </span>
        );
    }
  };

  if (!isClient) return null;

  return (
    <div className="flex flex-col h-full gap-6 max-w-[2000px] mx-auto pb-8">
      
            <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#161b27] border border-white/5 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl"
      >
        <div className="flex items-center gap-4">
           {selectedOrders.size > 0 ? (
             <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-blue-600 border border-blue-500 rounded-lg text-white font-mono text-xs shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                  {selectedOrders.size} Selected
                </span>
                <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg border border-transparent hover:border-white/10 transition-all focus:outline-none flex items-center gap-2 text-xs font-sora">
                   <Edit2 size={14} /> Bulk Edit
                </button>
                <div className="w-px h-6 bg-white/10"></div>
                <button className="p-2 text-red-500/70 hover:text-red-400 hover:bg-red-500/10 rounded-lg border border-transparent hover:border-red-500/20 transition-all focus:outline-none flex items-center gap-2 text-xs font-sora">
                   <Trash2 size={14} /> Delete
                </button>
             </div>
           ) : (
             <div className="flex bg-[#0f1117] border border-white/10 rounded-xl overflow-hidden focus-within:border-blue-500/50 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all w-full md:w-80">
               <div className="pl-3 py-2.5 flex items-center justify-center">
                  <Search size={16} className="text-gray-500" />
               </div>
               <input 
                 type="text" 
                 placeholder="Search orders, customers..." 
                 value={searchTerm}
                 onChange={e => setSearchTerm(e.target.value)}
                 className="w-full bg-transparent border-none text-gray-200 text-sm font-sora px-3 outline-none placeholder-gray-600 shadow-inner"
               />
             </div>
           )}
        </div>

        <div className="flex items-center gap-3">
           <div className="relative group">
              <select 
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="appearance-none bg-[#0f1117] border border-white/10 rounded-xl text-xs font-mono tracking-widest uppercase text-gray-300 px-4 pl-10 pr-10 py-2.5 outline-none hover:border-white/20 transition-all cursor-pointer shadow-inner"
              >
                 <option value="all">All Status</option>
                 <option value="delivered">Delivered</option>
                 <option value="processing">Processing</option>
                 <option value="pending">Pending</option>
                 <option value="cancelled">Cancelled</option>
              </select>
              <Filter size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none group-hover:text-white transition-colors" />
           </div>

           <button className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-gray-300 text-xs font-mono uppercase tracking-widest transition-all">
             <Download size={14} /> Export CSV
           </button>
        </div>
      </motion.div>

            <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="flex-1 bg-[#161b27] border border-white/5 rounded-2xl overflow-hidden flex flex-col shadow-2xl relative"
      >
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/5 blur-[100px] pointer-events-none rounded-full"></div>

        <div className="overflow-x-auto flex-1 relative z-10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-[#0f1117]/80 backdrop-blur-sm sticky top-0 z-20">
                <th className="px-6 py-4 w-12 text-center">
                  <input 
                    type="checkbox" 
                    checked={selectedOrders.size === currentData.length && currentData.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded bg-[#161b27] border-white/20 accent-blue-600 cursor-pointer"
                  />
                </th>
                
                {[
                  { label: "Order ID", key: "id" },
                  { label: "Customer Entity", key: "name" },
                  { label: "Matrix Status", key: "status" },
                  { label: "Total Asset Val", key: "total" },
                  { label: "Date Authored", key: "date" }
                ].map((col) => (
                  <th key={col.key} className="px-4 py-4 cursor-pointer group hover:bg-white/5 transition-colors" onClick={() => toggleSort(col.key)}>
                    <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.2em] uppercase text-gray-500 group-hover:text-blue-400 transition-colors">
                      {col.label}
                      <ArrowUpDown size={12} className={`${sortConfig.key === col.key ? 'opacity-100 text-blue-500' : 'opacity-0 group-hover:opacity-100'} transition-all`} />
                    </div>
                  </th>
                ))}
                <th className="px-6 py-4 text-right text-[10px] font-mono tracking-[0.2em] uppercase text-gray-500">
                  Operations
                </th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-white/5">
              <AnimatePresence>
                {currentData.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center">
                       <Search className="w-8 h-8 text-gray-600 mx-auto mb-3" />
                       <p className="text-gray-400 font-sora text-sm">No operational data found crossing this filter.</p>
                       <p className="text-gray-600 font-mono text-[10px] uppercase tracking-widest mt-1">Adjust search parameters</p>
                    </td>
                  </tr>
                ) : (
                  currentData.map((order: any, i: number) => {
                    const isSelected = selectedOrders.has(order.id);
                    return (
                      <motion.tr 
                        key={order.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2, delay: i * 0.05 }}
                        className={`group/row transition-all hover:bg-white/[0.02] relative
                          ${isSelected ? 'bg-blue-600/[0.03] border-l-2 border-l-blue-500' : 'border-l-2 border-l-transparent'}
                        `}
                      >
                         <td className="px-6 py-4 text-center">
                            <input 
                              type="checkbox" 
                              checked={isSelected}
                              onChange={() => toggleSelectOne(order.id)}
                              className="w-4 h-4 rounded bg-[#161b27] border-white/20 accent-blue-600 cursor-pointer"
                            />
                         </td>

                         <td className="px-4 py-4">
                            <span className="text-sm font-mono text-gray-200 font-semibold group-hover/row:text-blue-400 transition-colors cursor-pointer">
                               {order.id.slice(-8).toUpperCase()}
                            </span>
                         </td>

                         <td className="px-4 py-4 min-w-[200px]">
                            <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-white text-xs font-bold font-mono">
                                  {order.name[0]}
                               </div>
                               <div>
                                  <p className="text-sm text-gray-200 font-sora truncate max-w-[150px] font-semibold">{order.name}</p>
                                  <p className="text-[10px] text-gray-500 font-mono tracking-widest truncate max-w-[150px] mt-0.5">{order.email}</p>
                               </div>
                            </div>
                         </td>

                         <td className="px-4 py-4">
                            {getStatusBadge(order.status)}
                         </td>

                         <td className="px-4 py-4">
                            <p className="text-sm font-mono font-bold text-white">${order.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                            <p className="text-[10px] font-mono text-gray-500 tracking-widest uppercase mt-0.5">{order.itemsCount} Assets</p>
                         </td>

                         <td className="px-4 py-4 min-w-[160px]">
                            <div className="flex items-center gap-2 text-sm font-mono text-gray-300">
                               <Calendar size={14} className="text-gray-500" />
                               {order.date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                               <span className="text-gray-500 ml-1">
                                 {order.date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}
                               </span>
                            </div>
                         </td>

                         <td className="px-6 py-4 text-right">
                           <div className="flex items-center justify-end gap-1 opacity-0 group-hover/row:opacity-100 transition-all transform translate-x-4 group-hover/row:translate-x-0">
                               <button className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors border border-transparent hover:border-blue-500/20 shadow-[0_0_8px_rgba(59,130,246,0)] hover:shadow-[0_0_8px_rgba(59,130,246,0.2)]" title="View Detail Trace">
                                 <Eye size={16} />
                               </button>
                               <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors border border-transparent hover:border-white/10" title="Edit State">
                                 <Edit2 size={16} />
                               </button>
                           </div>
                           <div className="absolute right-8 top-1/2 -translate-y-1/2 group-hover/row:opacity-0 transition-opacity">
                             <MoreVertical size={16} className="text-gray-600" />
                           </div>
                         </td>
                      </motion.tr>
                    );
                  })
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

                <div className="p-4 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 bg-[#0f1117]/30 z-10 w-full relative">
           <div className="text-[10px] font-mono tracking-widest uppercase text-gray-500">
             Displaying {currentData.length} of {filteredAndSorted.length} Logs {selectedOrders.size > 0 && `| ${selectedOrders.size} selected`}
           </div>
           
           <div className="flex items-center gap-2">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(c => c - 1)}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#161b27] border border-white/5 text-gray-400 hover:text-white hover:border-white/20 disabled:opacity-30 disabled:hover:text-gray-400 disabled:hover:border-white/5 transition-all shadow-inner"
              >
                <ChevronLeft size={16} />
              </button>
              
              <div className="flex items-center gap-1 px-2">
                 {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                   // Super basic sliding window pager for aesthetics
                   let pageNum = i + 1;
                   if (totalPages > 5 && currentPage > 3) {
                      pageNum = currentPage - 2 + i;
                      if (pageNum > totalPages) pageNum = totalPages - (4 - i);
                   }
                   
                   return (
                     <button
                       key={pageNum}
                       onClick={() => setCurrentPage(pageNum)}
                       className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-mono transition-all
                         ${currentPage === pageNum 
                           ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)] border border-blue-500" 
                           : "bg-transparent text-gray-500 hover:text-white hover:bg-white/5"}
                       `}
                     >
                       {pageNum}
                     </button>
                   );
                 })}
              </div>

              <button 
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage(c => c + 1)}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#161b27] border border-white/5 text-gray-400 hover:text-white hover:border-white/20 disabled:opacity-30 disabled:hover:text-gray-400 disabled:hover:border-white/5 transition-all shadow-inner"
              >
                <ChevronRight size={16} />
              </button>
           </div>
        </div>
      </motion.div>
    </div>
  );
}
