"use client";

import React, { useEffect, useState } from "react";
import { ArrowUpRight, ArrowDownRight, ChevronRight } from "lucide-react";
import { ResponsiveContainer, LineChart, Line } from "recharts";
import { motion, useAnimation, useInView } from "framer-motion";
import { useRef } from "react";

interface StatCardProps {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  icon: any;
  color: string;
  change: number;
  trendData: number[];
  goalProgress: number;
  delayIndex: number;
}

export default function StatCard({
  title,
  value,
  prefix = "",
  suffix = "",
  icon: Icon,
  color,
  change,
  trendData,
  goalProgress,
  delayIndex
}: StatCardProps) {
  const isPositive = change >= 0;
  
  // Basic Animated Counter
  const countRef = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const duration = 1500;
    const frameRate = 1000 / 60;
    const totalFrames = Math.round(duration / frameRate);
    let frame = 0;

    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      // easeOutExpo
      const easing = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentCount = start + (value - start) * easing;
      
      setCount(currentCount);

      if (frame === totalFrames) {
        clearInterval(counter);
        setCount(value);
      }
    }, frameRate);

    return () => clearInterval(counter);
  }, [value]);

  const sparklineData = trendData.map((val, i) => ({ name: i, val }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: delayIndex * 0.1, type: "spring", stiffness: 100 }}
      className="bg-[#161b27] border border-white/5 rounded-2xl p-6 group hover:border-[#3b82f6]/30 hover:shadow-[0_10px_40px_rgba(59,130,246,0.1)] transition-all duration-500 relative overflow-hidden flex flex-col h-full"
    >
      <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl rounded-full opacity-10 transition-opacity duration-500 group-hover:opacity-20 pointer-events-none`} style={{ backgroundColor: color }}></div>

      <div className="flex items-start justify-between mb-4 relative z-10">
        <div>
          <p className="text-[10px] uppercase font-mono tracking-widest text-gray-500 mb-2">{title}</p>
          <div className="flex items-end gap-1">
            <h3 className="text-3xl font-mono font-bold text-white tracking-tighter">
              {prefix}{count.toLocaleString(undefined, { maximumFractionDigits: title.includes('AOV') ? 2 : 0 })}{suffix}
            </h3>
          </div>
        </div>
        <div className="p-3 bg-[#0f1117] border border-white/5 rounded-xl text-gray-400 group-hover:text-white transition-colors duration-300 relative shadow-inner">
           <Icon size={18} style={{ color: "inherit" }} />
                      <div className="absolute inset-0 bg-current blur-md opacity-0 group-hover:opacity-20 transition-opacity" style={{ color }}></div>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6 relative z-10 w-full h-[40px]">
        <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded ${isPositive ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' : 'text-red-400 bg-red-400/10 border-red-400/20'} border text-[10px] font-mono tracking-widest shrink-0 shadow-inner`}>
           {isPositive ? <ArrowUpRight size={10} strokeWidth={3} /> : <ArrowDownRight size={10} strokeWidth={3} />}
           {Math.abs(change)}%
        </div>
        <div className="flex-1 h-full opacity-50 group-hover:opacity-100 transition-opacity">
           <ResponsiveContainer width="100%" height="100%">
             <LineChart data={sparklineData}>
                <Line 
                  type="monotone" 
                  dataKey="val" 
                  stroke={isPositive ? "#34d399" : "#f87171"} 
                  strokeWidth={2} 
                  dot={false}
                  animationDuration={2000}
                />
             </LineChart>
           </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-auto relative z-10">
         <div className="flex justify-between items-center mb-2">
            <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">Monthly Goal</span>
            <span className="text-[9px] font-mono text-white tracking-widest">{goalProgress}%</span>
         </div>
         <div className="w-full bg-[#0f1117] rounded-full h-1.5 overflow-hidden border border-white/5 relative">
            <motion.div 
               initial={{ width: 0 }}
               animate={{ width: `${goalProgress}%` }}
               transition={{ duration: 1.5, delay: 0.5 + delayIndex * 0.1 }}
               className="h-full rounded-full absolute left-0 top-0 shadow-[0_0_10px_currentColor]"
               style={{ backgroundColor: color, color }}
            />
         </div>
      </div>

            <div className="absolute bottom-0 left-0 w-full p-4 transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 bg-gradient-to-t from-[#161b27] via-[#161b27]/90 to-transparent flex justify-end z-20">
         <button className="flex items-center gap-1 text-[10px] font-mono tracking-widest uppercase text-blue-400 hover:text-blue-300 drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]">
           View Details <ChevronRight size={12} strokeWidth={3} />
         </button>
      </div>
    </motion.div>
  );
}
