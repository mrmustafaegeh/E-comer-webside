"use client";

import React, { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  Zap,
} from "lucide-react";
import api from "../../../services/api";
import { motion } from "framer-motion";

// Dynamic Imports for Client-Side Charts
const StatGrid = dynamic(() => import("../../../Component/dashboard/StatGrid"), { 
  ssr: false, 
  loading: () => <div className="h-32 bg-[#161b27]/50 animate-pulse rounded-[2rem] border border-white/5" /> 
});
const ChartSection = dynamic(() => import("../../../Component/dashboard/ChartSection"), { 
  ssr: false, 
  loading: () => <div className="h-[400px] w-full bg-[#161b27]/50 animate-pulse rounded-[2rem] border border-white/5" /> 
});
const SalesByCategory = dynamic(() => import("../../../Component/dashboard/SalesByCategory"), { 
  ssr: false, 
  loading: () => <div className="h-[400px] w-full bg-[#161b27]/50 animate-pulse rounded-[2rem] border border-white/5" /> 
});
const RecentOrdersTable = dynamic(() => import("../../../Component/dashboard/RecentOrdersTable"), { 
  ssr: false, 
  loading: () => <div className="h-[400px] w-full bg-[#161b27]/50 animate-pulse rounded-[2rem] border border-white/5" /> 
});
const QuickActions = dynamic(() => import("../../../Component/dashboard/QuickActions"), { 
  ssr: false, 
  loading: () => <div className="h-[400px] w-full bg-[#161b27]/50 animate-pulse rounded-[2rem] border border-white/5" /> 
});
const TopProducts = dynamic(() => import("../../../Component/dashboard/TopProducts"), { 
  ssr: false, 
  loading: () => <div className="h-[400px] w-full bg-[#161b27]/50 animate-pulse rounded-[2rem] border border-white/5" /> 
});
const ActivityFeed = dynamic(() => import("../../../Component/dashboard/ActivityFeed"), { 
  ssr: false, 
  loading: () => <div className="h-[400px] w-full bg-[#161b27]/50 animate-pulse rounded-[2rem] border border-white/5" /> 
});

export default function EliteAdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const loadRealData = async () => {
      try {
        setLoading(true);
        const realStats = await api.get("/admin/stats");
        
        // Ensure structural integrity for cards
        setData(realStats.data);
      } catch (e) {
        console.error("Data load issue:", e);
      } finally {
        setLoading(false);
      }
    };

    loadRealData();
  }, []);

  const statCards = useMemo(() => {
    if (!data || !data.stats) return [];
    const getTrend = (base: number, volatility: number) => Array.from({length: 7}, () => base + (Math.random() * volatility - volatility/2));
    
    return [
      {
        title: "Total Revenue",
        value: data.stats.revenue || 0,
        prefix: "$",
        icon: DollarSign,
        color: "#3b82f6", // blue
        change: data.stats.revChange || 0,
        trendData: getTrend(50, 20),
        goalProgress: 88,
      },
      {
        title: "Total Orders",
        value: data.stats.orders || 0,
        icon: ShoppingCart,
        color: "#10b981", // emerald
        change: data.stats.ordersChange || 0,
        trendData: getTrend(40, 15),
        goalProgress: 94,
      },
      {
        title: "New Customers",
        value: data.stats.customers || 0,
        icon: Users,
        color: "#a855f7", // purple
        change: data.stats.customersChange || 0,
        trendData: getTrend(30, 25),
        goalProgress: 65,
      },
      {
        title: "Avg. Order Value",
        value: data.stats.aov || 0,
        prefix: "$",
        icon: Zap,
        color: "#f59e0b", // amber
        change: data.stats.aovChange || 0,
        trendData: getTrend(150, 10),
        goalProgress: 100,
      },
    ];
  }, [data]);

  if (loading || !data) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 bg-[#0f1117]">
         <motion.div 
            animate={{ scale: [0.95, 1.05, 0.95], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.5)] mb-6"
         >
           <Zap className="text-white" size={24} strokeWidth={3} />
         </motion.div>
         <h2 className="text-white font-sora font-semibold tracking-tight text-xl mb-1">Initializing Protocol</h2>
         <p className="text-blue-400 font-mono text-[10px] uppercase tracking-widest animate-pulse">Syncing nodes...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
            <div className="flex flex-col gap-6 w-full max-w-[2000px] mx-auto pb-10">
        
                <StatGrid stats={statCards} />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 h-full">
            <ChartSection data={data.revenueData} />
          </div>
          <div className="lg:col-span-4 h-full">
            <SalesByCategory data={data.categoryData} />
          </div>
        </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-7 h-full">
            <RecentOrdersTable orders={data.recentOrders} />
          </div>
          <div className="xl:col-span-5 h-full">
            <QuickActions />
          </div>
        </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-6 h-full">
            <TopProducts products={data.topProducts} />
          </div>
          <div className="xl:col-span-6 h-full">
            <ActivityFeed activities={data.activities} />
          </div>
        </div>

      </div>
    </div>
  );
}
