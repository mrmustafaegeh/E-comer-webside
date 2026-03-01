"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Send, Bot, User, Command, ChevronRight, Loader2, Database, BarChart3, Package } from "lucide-react";

type Message = {
  id: string;
  role: "system" | "user" | "ai";
  content: React.ReactNode;
  timestamp: string;
};

const SUGGESTED_QUERIES = [
  { icon: <Database size={14} />, text: "Show latest abandoned carts" },
  { icon: <BarChart3 size={14} />, text: "Compare Q3 vs Q4 revenue" },
  { icon: <Package size={14} />, text: "Identify low-stock top sellers" },
];

export default function AdminAIPilot() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "sys-1",
      role: "system",
      content: "AI Co-Pilot initialized. Deep access granted to metrics, orders, and customer data.",
      timestamp: new Date().toISOString()
    },
    {
      id: "ai-1",
      role: "ai",
      content: "Greetings Admin. I'm connected directly to the store's central database. How can I assist you in optimizing flow today?",
      timestamp: new Date().toISOString()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, isOpen]);

  const handleSend = () => {
    if (!inputMessage.trim()) return;

    const newMsg: Message = {
      id: `usr-${Date.now()}`,
      role: "user",
      content: inputMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMsg]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate AI thinking and querying the database
    setTimeout(() => {
        setIsTyping(false);
        const aiResponse: Message = {
          id: `ai-${Date.now()}`,
          role: "ai",
          content: generateMockResponse(newMsg.content as string),
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, aiResponse]);
    }, 1500 + Math.random() * 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const generateMockResponse = (query: string): React.ReactNode => {
      const lowerQuery = query.toLowerCase();
      
      if (lowerQuery.includes("abandoned") || lowerQuery.includes("cart")) {
         return (
            <div className="space-y-3">
               <p>I found <span className="text-amber-400 font-mono font-bold">14</span> abandoned carts in the last 24 hours crossing a total potential revenue of <span className="text-emerald-400 font-mono font-bold">$3,420.50</span>.</p>
               <div className="bg-[#0f1117] p-3 rounded-xl border border-white/5 font-mono text-[10px] uppercase tracking-widest text-gray-400">
                  Top 3 Items Left Behind:
                  <ul className="mt-2 text-blue-400 list-disc list-inside">
                     <li>Wireless Over-Ear Headphones (x6)</li>
                     <li>Mechanical Keyboard Pro (x4)</li>
                     <li>Ergonomic Desk Chair (x2)</li>
                  </ul>
               </div>
               <button className="px-3 py-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg text-[10px] font-mono uppercase tracking-widest hover:bg-blue-500/20 hover:border-blue-500 transition-colors">Generate Re-Targeting Segment</button>
            </div>
         );
      }
      
      if (lowerQuery.includes("stock") || lowerQuery.includes("seller")) {
         return (
             <div className="space-y-3">
                 <p>Scanning the inventory matrix for fast-moving items...</p>
                 <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl relative overflow-hidden">
                     <span className="w-1.5 h-1.5 rounded-full bg-red-500 absolute top-3 right-3 animate-ping"></span>
                     <p className="text-xs text-red-400 font-sora font-semibold">Critical Depletion Warning</p>
                     <p className="text-[10px] font-mono text-gray-400 mt-1 uppercase tracking-widest leading-relaxed">
                         'Smart Home Hub v2' is down to 2 units but trending 300% above average daily velocity. Stockout imminent in &lt; 4 hours.
                     </p>
                 </div>
             </div>
         );
      }

      return "I've logged your request into my processing queue. However, as I'm operating on local mock protocols right now, I cannot compute external queries natively yet. What else can I retrieve?";
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-[60] w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.5)] border border-white/20 transition-all ${isOpen ? 'opacity-0 pointer-events-none translate-y-10' : 'opacity-100'}`}
      >
        <Sparkles className="text-white" size={24} />
      </motion.button>

      {/* Flyout Drawer Pane */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-6 right-6 z-[70] w-[380px] sm:w-[420px] h-[600px] max-h-[85vh] bg-[#161b27]/95 backdrop-blur-3xl border border-white/10 rounded-[2rem] shadow-[0_0_60px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/5 bg-[#0f1117]/80 flex items-center justify-between shrink-0 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-[60px] pointer-events-none rounded-full translate-x-1/2 -translate-y-1/2"></div>
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-inner border border-white/20">
                  <Bot size={20} className="text-white" />
                </div>
                <div>
                    <h3 className="text-sm font-sora font-semibold text-white tracking-tight flex items-center gap-2">
                        Co-Pilot <span className="px-1.5 py-0.5 bg-blue-500/20 text-blue-400 rounded text-[9px] font-mono tracking-widest uppercase">Active</span>
                    </h3>
                    <p className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">Admin Authorization Level 4</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors relative z-10"
              >
                <X size={16} />
              </button>
            </div>

            {/* Chat Stream Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6"
            >
               {messages.map((msg) => (
                  <motion.div 
                     key={msg.id}
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                  >
                     {msg.role === 'system' && (
                         <div className="w-full text-center my-4">
                             <span className="text-[9px] font-mono uppercase tracking-widest text-emerald-500/70 bg-emerald-500/5 px-3 py-1 rounded-full border border-emerald-500/10">
                                 {msg.content}
                             </span>
                         </div>
                     )}

                     {msg.role !== 'system' && (
                         <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                             <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center border shadow-inner ${msg.role === 'user' ? 'bg-[#0f1117] border-white/10 text-gray-400' : 'bg-blue-600 border-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]'}`}>
                                 {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                             </div>
                             <div className={`p-4 rounded-[1.5rem] font-sora text-sm leading-relaxed ${msg.role === 'user' ? 'bg-[#0f1117] border border-white/5 text-gray-200 rounded-tr-sm' : 'bg-blue-600/10 border border-blue-500/20 text-blue-50 rounded-tl-sm shadow-[0_0_20px_rgba(59,130,246,0.05)]'}`}>
                                 {msg.content}
                             </div>
                         </div>
                     )}
                  </motion.div>
               ))}

               {isTyping && (
                  <motion.div 
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="flex gap-3 max-w-[85%]"
                  >
                     <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center border shadow-inner bg-blue-600 border-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                        <Loader2 size={14} className="animate-spin" />
                     </div>
                     <div className="p-4 rounded-[1.5rem] bg-blue-600/10 border border-blue-500/20 rounded-tl-sm flex items-center gap-1.5 px-5">
                         <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                         <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                         <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                     </div>
                  </motion.div>
               )}
            </div>

            {/* Suggested Queries */}
            {messages.length < 4 && !isTyping && (
               <motion.div 
                 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                 className="px-6 pb-4 flex flex-col gap-2 shrink-0"
               >
                  {SUGGESTED_QUERIES.map((q, i) => (
                     <button
                        key={i}
                        onClick={() => {
                            setInputMessage(q.text);
                            // small delay before auto sending for visual UX
                            setTimeout(() => {
                               const e = { preventDefault: () => {} } as React.KeyboardEvent;
                               e.key = "Enter";
                               e.shiftKey = false;
                               handleSend();
                            }, 50);
                        }}
                        className="flex items-center gap-3 w-full text-left p-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-colors text-xs font-sora text-gray-300"
                     >
                        <span className="text-gray-500">{q.icon}</span>
                        {q.text}
                     </button>
                  ))}
               </motion.div>
            )}

            {/* Input Area */}
            <div className="p-4 bg-[#0f1117]/80 border-t border-white/5 shrink-0 relative">
               <div className="relative flex items-center bg-[#161b27] border border-white/10 rounded-2xl p-1.5 focus-within:border-blue-500/50 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all shadow-inner">
                  <button className="w-8 h-8 flex items-center justify-center shrink-0 rounded-xl bg-white/5 text-gray-500 hover:text-white hover:bg-white/10 transition-colors ml-1">
                      <Command size={14} />
                  </button>
                  <input
                     value={inputMessage}
                     onChange={(e) => setInputMessage(e.target.value)}
                     onKeyDown={handleKeyDown}
                     disabled={isTyping}
                     placeholder={isTyping ? "Co-Pilot is typing..." : "Ask me anything..."}
                     className="flex-1 bg-transparent border-none text-sm font-sora px-3 py-2 text-white placeholder:text-gray-600 outline-none disabled:opacity-50"
                  />
                  <button
                     onClick={handleSend}
                     disabled={!inputMessage.trim() || isTyping}
                     className="w-10 h-10 flex items-center justify-center shrink-0 rounded-[14px] bg-blue-600 text-white disabled:bg-white/5 disabled:text-gray-600 hover:bg-blue-500 transition-colors mr-0.5"
                  >
                     <Send size={16} className={inputMessage.trim() && !isTyping ? "translate-x-[1px] translate-y-[-1px]" : ""} />
                  </button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
