"use client";

import React, { useState, useEffect, useRef } from "react";
import { Terminal, Cpu, Database, Network, Power } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface Activity {
  id: string;
  type: "order" | "warning" | "user" | "refund" | "success" | "system";
  description: string;
  timestamp: string;
}

interface ActivityFeedProps {
  activities: Activity[];
}

const MOCK_STREAM = [
  "[SYS] Database connection stabilized. Latency: 12ms",
  "[CACHE] Redis hit ratio > 98.4%",
  "[WORKER] Background queue processed 42 jobs",
  "[SEC] Prevented unauthorized handshake from 192.168.x.x",
  "[ROUTER] Traffic diverted to CDN Edge Node 04",
  "[SYS] Memory usage nominal at 42.1%",
  "[API] Checkout endpoint throughput: 1.2k req/s",
  "[SYNC] Elasticsearch indexes synchronized.",
  "[AUTH] Admin session established securely.",
  "[PAYLOAD] 34MB blob compressed successfully.",
];

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  const [logs, setLogs] = useState<{id: string, text: string, type: string}[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fake system streaming simulating server health logs
  useEffect(() => {
    let counter = 0;
    
    // Initial boot sequence styling
    setLogs([
       { id: "boot-1", text: "Initializing Core Server Terminal v2.0.4...", type: "system" },
       { id: "boot-2", text: "Establishing secure websocket to infrastructure...", type: "system" },
       { id: "boot-3", text: "Connection OK. Listening for global events.", type: "success" },
       { id: "boot-4", text: "--------------------------------------------------", type: "system" },
    ]);

    const interval = setInterval(() => {
      counter++;
      const MathRandom = Math.random();
      if (MathRandom > 0.4) {
         const newLog = MOCK_STREAM[Math.floor(Math.random() * MOCK_STREAM.length)];
         const time = new Date().toISOString().split('T')[1].substring(0, 8);
         setLogs(prev => {
            const next = [
              ...prev, 
              { 
                id: `sys-${Date.now()}-${counter}`, 
                text: `[${time}] ${newLog}`, 
                type: newLog.includes("[SEC]") || newLog.includes("[SYS]") ? "warning" : "system" 
              }
            ];
            // Keep the last 25 elements to prevent massive DOM nodes
            return next.slice(-25); 
         });
      }
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  // Incorporate actual dashboard activities seamlessly into the terminal
  useEffect(() => {
    if (activities?.length) {
       const mapped = activities.slice(0, 5).map(a => ({
          id: `act-${a.id}`,
          text: `[${new Date(a.timestamp).toISOString().split('T')[1].substring(0, 8)}] [EVNT] ${a.description}`,
          type: a.type
       }));
       
       setLogs(prev => {
           // ensure no duplicates by ID prefix check
           const additions = mapped.filter(m => !prev.find(p => p.id === m.id));
           if(additions.length === 0) return prev;
           return [...prev, ...additions].sort((a,b) => a.id.localeCompare(b.id)).slice(-25);
       });
    }
  }, [activities]);

  // Auto-scroll to bottom of terminal
  useEffect(() => {
     if (scrollRef.current) {
         scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
     }
  }, [logs]);

  // Terminal color mappings mapping the types
  const getColor = (type: string) => {
     switch(type) {
         case 'success': return 'text-emerald-400 font-bold';
         case 'warning': return 'text-amber-400';
         case 'order': return 'text-blue-400 drop-shadow-[0_0_5px_rgba(59,130,246,0.6)]';
         case 'refund': return 'text-red-400 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]';
         case 'user': return 'text-purple-400';
         default: return 'text-green-500 hover:text-green-400 drop-shadow-[0_0_5px_rgba(34,197,94,0.3)] opacity-80'; // default hacker green
     }
  };

  return (
    <div className="bg-[#0f1117] border-4 border-[#161b27] rounded-[2rem] p-6 lg:p-8 flex flex-col h-full relative overflow-hidden shadow-2xl group min-h-[400px]">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none opacity-20"></div>
      
            <div className="absolute inset-0 bg-gradient-to-b from-[#0f1117] via-transparent to-[#0f1117] pointer-events-none z-10 opacity-60"></div>
      
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5 relative z-20">
         <div className="flex items-center gap-4">
                          <div className="flex gap-2">
                 <span className="w-3 h-3 rounded-full bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.5)] transition-all hover:bg-red-400 cursor-pointer"></span>
                 <span className="w-3 h-3 rounded-full bg-amber-500/80 shadow-[0_0_8px_rgba(245,158,11,0.5)] transition-all hover:bg-amber-400 cursor-pointer"></span>
                 <span className="w-3 h-3 rounded-full bg-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.5)] transition-all hover:bg-emerald-400 cursor-pointer"></span>
             </div>
             <h2 className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2 select-none">
                 <Terminal size={14} className="text-gray-400" /> root@main_server_cluster
             </h2>
         </div>
         <div className="flex gap-4 select-none">
             <div className="text-[9px] font-mono font-bold text-emerald-500 uppercase flex items-center gap-1 opacity-80 animate-pulse">
                <Network size={12} /> SECURE LINK
             </div>
         </div>
      </div>

            <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto no-scrollbar font-mono text-[11px] leading-relaxed relative z-20 pr-2 scroll-smooth flex flex-col justify-end"
      >
          <div className="w-full">
            <AnimatePresence initial={false}>
                {logs.map((log) => (
                    <motion.div
                        key={log.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`mb-1.5 transition-colors tracking-wide break-words ${getColor(log.type)}`}
                    >
                        <span className="opacity-30 select-none mr-3 text-gray-500">{'~'}</span>
                        {log.text}
                    </motion.div>
                ))}
            </AnimatePresence>
            
                        <div className="flex items-center text-emerald-500 mt-2 select-none">
                <span className="opacity-30 mr-3 text-gray-500">{'~'}</span>
                <span className="mr-2 text-green-500 font-bold">root#</span>
                <motion.span 
                    animate={{ opacity: [1, 0, 1] }} 
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="w-2.5 h-4 bg-emerald-500 inline-block shadow-[0_0_10px_rgba(34,197,94,0.8)]"
                />
            </div>
          </div>
      </div>

            <div className="mt-4 pt-4 border-t border-white/5 relative z-20 flex justify-between items-center text-[10px] font-mono text-gray-500 tracking-widest uppercase select-none">
          <div className="flex items-center gap-5">
              <span className="flex items-center gap-2 hover:text-blue-400 transition-colors group cursor-default">
                  <Cpu size={12} className="group-hover:animate-spin transition-colors" /> CPU: 12.4%
              </span>
              <span className="flex items-center gap-2 hover:text-purple-400 transition-colors group cursor-default">
                  <Database size={12} className="group-hover:animate-pulse transition-colors" /> MEM: 14GB/32GB
              </span>
          </div>
          <motion.div 
             animate={{ opacity: [0.3, 1, 0.3] }} 
             transition={{ repeat: Infinity, duration: 3 }}
             className="text-emerald-500 flex items-center gap-2 font-bold"
          >
             <Power size={12} /> System Nominal
          </motion.div>
      </div>

            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-30 pointer-events-none opacity-[0.15]"></div>
      
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-emerald-500/5 blur-[80px] rounded-full pointer-events-none z-10"></div>
    </div>
  );
}
