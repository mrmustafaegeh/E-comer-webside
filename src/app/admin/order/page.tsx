"use client";

import { useEffect, useState } from "react";
import OrderTable from "../../../Component/dashboard/OrderTable";
import { ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";

export default function DashboardOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/admin-orders");
        const data = await res.json();
        setOrders(Array.isArray(data.orders) ? data.orders : []);
      } catch (err) {
        console.error("Failed to load orders:", err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, []);

  return (
    <div className="w-full max-w-[2000px] mx-auto pb-10">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-sora font-bold text-white tracking-tight flex items-center gap-3">
          <ShoppingCart className="text-blue-500" size={32} />
          Order Matrix
        </h1>
        <p className="text-sm font-mono tracking-widest uppercase text-gray-500 mt-2">
          Global Transaction Monitoring
        </p>
      </motion.div>

      {loading ? (
        <div className="h-[60vh] w-full bg-[#161b27]/50 animate-pulse rounded-[2rem] border border-white/5 flex items-center justify-center">
            <p className="text-blue-400 font-mono text-[10px] uppercase tracking-widest">Querying Operational Database...</p>
        </div>
      ) : (
        <OrderTable orders={orders} />
      )}
    </div>
  );
}
