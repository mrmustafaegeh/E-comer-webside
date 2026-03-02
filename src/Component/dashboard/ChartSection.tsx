"use client";

import React, { useState } from "react";
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  ReferenceDot,
  ReferenceLine
} from "recharts";
import { TrendingUp, TrendingDown, Target } from "lucide-react";
import { motion } from "framer-motion";

interface ChartData {
  month: string;
  revenue: number;
  target: number;
  orders: number;
}

interface ChartSectionProps {
  data: ChartData[];
}

export default function ChartSection({ data }: ChartSectionProps) {
  const [activeTab, setActiveTab] = useState("6M"); // 7D, 30D, 90D, 6M, 12M

  const formatYAxis = (tickItem: number) => {
    if (tickItem === 0) return "0";
    return `$${(tickItem / 1000).toFixed(0)}k`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#161b27]/90 backdrop-blur-xl border border-white/10 p-4 rounded-xl shadow-2xl min-w-[160px]">
          <p className="text-gray-400 font-sora text-xs uppercase tracking-widest mb-3 border-b border-white/5 pb-2">{label}</p>
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
                <span className="text-gray-300 font-sora text-xs">Revenue</span>
              </div>
              <span className="text-blue-400 font-mono font-bold">${payload[0]?.value?.toLocaleString()}</span>
            </div>
            
            {payload[1] && (
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full border border-dashed border-gray-500"></span>
                  <span className="text-gray-400 font-sora text-xs">Target</span>
                </div>
                <span className="text-gray-400 font-mono font-medium">${payload[1]?.value?.toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  // Find max internal to array
  const maxRevenue = data.reduce((max, obj) => (obj.revenue > max ? obj.revenue : max), 0);
  const peakDataPoint = data.find(d => d.revenue === maxRevenue);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-[#161b27] border border-white/5 rounded-[2rem] p-6 lg:p-8 relative overflow-hidden group hover:border-white/10 transition-colors h-full flex flex-col"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-8 gap-4 relative z-10">
        <div>
          <h2 className="text-xl font-sora font-bold text-white tracking-tight flex items-center gap-3">
            Revenue Protocol
            <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-mono rounded border border-emerald-500/20 uppercase tracking-widest shadow-[0_0_10px_rgba(16,185,129,0.1)]">
              <TrendingUp size={12} strokeWidth={3} /> +18.3%
            </span>
          </h2>
          <p className="text-gray-500 font-mono text-xs mt-2 tracking-widest uppercase flex items-center gap-2">
            Target vs Actual Performance
          </p>
        </div>

                <div className="flex items-center p-1 bg-[#0f1117] border border-white/10 rounded-lg">
          {["7D", "30D", "90D", "6M", "12M"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-md text-[10px] font-mono uppercase tracking-widest transition-all ${
                activeTab === tab
                  ? "bg-blue-600 text-white shadow-[0_0_10px_rgba(59,130,246,0.5)] border border-blue-500"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 w-full relative min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff" strokeOpacity={0.05} />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: 10, fontFamily: "monospace" }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: 10, fontFamily: "monospace" }}
              tickFormatter={formatYAxis}
              dx={-10}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }} />
            
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#3b82f6"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorRevenue)"
              activeDot={{ r: 6, fill: "#3b82f6", stroke: "#0f1117", strokeWidth: 2, className: 'drop-shadow-lg' }}
              animationDuration={1500}
            />
            
            <Line
              type="monotone"
              dataKey="target"
              stroke="#6b7280"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              activeDot={false}
              animationDuration={1500}
            />

            {peakDataPoint && (
               <ReferenceDot 
                  x={peakDataPoint.month} 
                  y={peakDataPoint.revenue} 
                  r={4} 
                  fill="#f59e0b" 
                  stroke="none"
               />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-8 pt-6 border-t border-white/5 relative z-10 flex gap-4 overflow-x-auto no-scrollbar">
          <div className="flex-1 min-w-[120px]">
             <div className="text-gray-400 font-mono text-[9px] tracking-widest uppercase mb-1 flex justify-between items-center">
               <span>Total Gross</span>
               <TrendingUp size={10} className="text-emerald-400" />
             </div>
             <div className="text-2xl font-mono text-white font-bold tracking-tight">
               ${data.reduce((acc, curr) => acc + curr.revenue, 0).toLocaleString()}
             </div>
          </div>
          <div className="w-px bg-white/5 mx-2 shrink-0 hidden sm:block"></div>
          <div className="flex-1 min-w-[120px]">
             <div className="text-gray-400 font-mono text-[9px] tracking-widest uppercase mb-1 flex justify-between items-center">
               <span>Net Orders</span>
               <TrendingUp size={10} className="text-emerald-400" />
             </div>
             <div className="text-2xl font-mono text-white font-bold tracking-tight">
               {data.reduce((acc, curr) => acc + curr.orders, 0).toLocaleString()}
             </div>
          </div>
          <div className="w-px bg-white/5 mx-2 shrink-0 hidden sm:block"></div>
          <div className="flex-1 min-w-[120px]">
             <div className="text-gray-400 font-mono text-[9px] tracking-widest uppercase mb-1 flex justify-between items-center">
               <span>AOV</span>
               <Target size={10} className="text-blue-400" />
             </div>
             <div className="text-2xl font-mono text-white font-bold tracking-tight">
               ${(
                 data.reduce((acc, curr) => acc + curr.revenue, 0) /
                 Math.max(1, data.reduce((acc, curr) => acc + curr.orders, 0))
               ).toFixed(2)}
             </div>
          </div>
      </div>
    </motion.div>
  );
}
