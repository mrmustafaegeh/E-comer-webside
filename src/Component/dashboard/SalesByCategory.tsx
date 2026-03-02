"use client";

import React, { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { motion } from "framer-motion";

interface CategoryData {
  name: string;
  value: number;
}

interface SalesByCategoryProps {
  data: CategoryData[];
}

const COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#6366f1", "#ec4899"];

export default function SalesByCategory({ data }: SalesByCategoryProps) {
  const total = useMemo(() => data.reduce((acc, curr) => acc + curr.value, 0), [data]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#161b27]/90 backdrop-blur-md border border-white/10 p-3 rounded-xl shadow-2xl">
          <p className="text-gray-300 font-sora text-sm mb-1">{payload[0].name}</p>
          <p className="text-blue-400 font-mono text-lg font-bold">${payload[0].value.toLocaleString()}</p>
          <p className="text-gray-500 font-mono text-xs mt-1">{((payload[0].value / total) * 100).toFixed(1)}% of total</p>
        </div>
      );
    }
    return null;
  };

  if (!data || data.length === 0) {
    return <div className="h-full flex items-center justify-center text-gray-500 font-mono text-xs">No categorical data available</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-[#161b27] border border-white/5 rounded-2xl p-6 h-full flex flex-col relative overflow-hidden group hover:border-white/10 transition-colors"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
      
      <div className="mb-6 relative z-10">
        <h2 className="text-lg font-sora font-semibold text-white">Sales by Category</h2>
        <p className="text-xs font-mono text-gray-400 mt-1 uppercase tracking-widest">Revenue Distribution</p>
      </div>

      <div className="flex-1 w-full relative min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="65%"
              outerRadius="85%"
              paddingAngle={4}
              dataKey="value"
              stroke="none"
              animationBegin={200}
              animationDuration={1500}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]} 
                  className="hover:opacity-80 transition-opacity cursor-pointer stroke-[#161b27] stroke-2"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} cursor={{fill: 'transparent'}} />
          </PieChart>
        </ResponsiveContainer>
        
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[10px] font-mono text-gray-500 tracking-widest uppercase mb-1">Total Sales</span>
          <span className="text-2xl font-mono text-white font-bold drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
            ${(total / 1000).toFixed(1)}K
          </span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 relative z-10 max-h-32 overflow-y-auto no-scrollbar">
        {data.map((item, index) => (
          <div key={item.name} className="flex items-center gap-2">
            <span 
              className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_currentColor] opacity-80" 
              style={{ backgroundColor: COLORS[index % COLORS.length], color: COLORS[index % COLORS.length] }} 
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-300 truncate font-sora">{item.name}</p>
              <p className="text-[10px] text-gray-500 font-mono tracking-widest">
                {((item.value / total) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
