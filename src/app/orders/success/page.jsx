"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function OrderSuccessPage() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsProcessing(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay pointer-events-none z-0"></div>
      
      <div className="fixed inset-0 border-[32px] border-white/5 pointer-events-none z-50 hidden lg:block" />
      
      <AnimatePresence mode="wait">
        {isProcessing ? (
          <motion.div
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center z-10"
          >
            <Loader2 size={80} strokeWidth={1} className="text-white animate-spin mb-8" />
            <p className="text-[10px] font-mono font-black text-white uppercase tracking-[0.5em] animate-pulse italic mt-4">
              // PROCESSING TRANSACTION...
            </p>
          </motion.div>
        ) : (
          <motion.div 
            key="success"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-[600px] w-full text-center relative z-10"
          >
            <div className="inline-flex items-center justify-center w-32 h-32 bg-black rounded-none text-white shadow-2xl mb-12 border border-white/20 relative group overflow-hidden transition-transform duration-1000">
                <div className="absolute inset-0 bg-white -translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
                <Check size={64} strokeWidth={1} className="relative z-10 transition-colors duration-500 group-hover:text-black" />
            </div>

            <h1 className="text-6xl md:text-9xl font-heading font-black text-white tracking-tighter mb-8 italic uppercase leading-none">
              Success.<br /> Protocol.
            </h1>
            
            <p className="text-[11px] font-mono font-black text-gray-500 uppercase tracking-[0.6em] mb-16 max-w-sm mx-auto leading-relaxed border-y border-white/10 py-8 italic">
              Transaction successfully validated and logged into the global mainframe. Your assets are currently being encoded for physical dispatch.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-md mx-auto">
              <Link
                href="/products"
                className="flex items-center justify-center gap-4 px-10 py-6 bg-white text-black rounded-none text-[10px] font-mono font-black uppercase tracking-[0.4em] border border-white transition-all duration-500 group shadow-2xl active:scale-95"
              >
                NEW ID <ArrowRight size={18} className="group-hover:translate-x-3 transition-transform" />
              </Link>
              
              <Link
                href="/"
                className="flex items-center justify-center gap-4 px-10 py-6 bg-black border border-white/20 text-gray-400 hover:text-white hover:border-white rounded-none text-[10px] font-mono font-black uppercase tracking-[0.4em] transition-all duration-500 active:scale-95"
              >
                SYSTEM ROOT
              </Link>
            </div>

            <div className="mt-24 pt-10 border-t border-white/10 opacity-30">
                 <p className="text-[9px] font-mono font-black uppercase tracking-[0.8em] text-white">
                    Logistics Confirmation v3.0 // BW Protocol - Code 201
                </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
