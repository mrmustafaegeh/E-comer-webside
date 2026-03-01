"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ArrowRight, ShoppingBag, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function OrderSuccessPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Monochrome Noise Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay pointer-events-none z-0"></div>
      
      <div className="fixed inset-0 border-[32px] border-white/5 pointer-events-none z-50 hidden lg:block" />
      
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-[600px] w-full text-center relative z-10"
      >
        <div className="inline-flex items-center justify-center w-32 h-32 bg-black rounded-none text-white shadow-2xl mb-12 border border-white/20 relative group overflow-hidden transition-transform hover:rotate-90 duration-1000">
            <div className="absolute inset-0 bg-white -translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
            <ShieldCheck size={48} strokeWidth={1} className="relative z-10 transition-colors duration-500 group-hover:text-black" />
        </div>

        <h1 className="text-6xl md:text-9xl font-heading font-black text-white tracking-tighter mb-8 italic uppercase leading-none">
          Success.<br /> Protocol.
        </h1>
        
        <p className="text-[11px] font-mono font-black text-gray-600 uppercase tracking-[0.6em] mb-16 max-w-sm mx-auto leading-relaxed border-y border-white/10 py-8 italic">
          Transaction successfully validated and logged into the global mainframe. Your assets are currently being encoded for physical dispatch.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-md mx-auto">
          <Link
            href="/products"
            className="flex items-center justify-center gap-4 px-10 py-6 bg-white text-black rounded-none text-[10px] font-mono font-black uppercase tracking-[0.4em] hover:bg-black hover:text-white border border-white transition-all duration-500 group shadow-2xl active:scale-95"
          >
            New ID <ArrowRight size={18} className="group-hover:translate-x-3 transition-transform" />
          </Link>
          
          <Link
            href="/"
            className="flex items-center justify-center gap-4 px-10 py-6 bg-black border border-white/20 text-gray-500 hover:text-white hover:border-white rounded-none text-[10px] font-mono font-black uppercase tracking-[0.4em] transition-all duration-500 active:scale-95"
          >
            System Root
          </Link>
        </div>

        <div className="mt-24 pt-10 border-t border-white/10 opacity-30">
             <p className="text-[9px] font-mono font-black uppercase tracking-[0.8em] text-white">
                Logistics Confirmation v3.0 // BW Protocol - Code 201
            </p>
        </div>
      </motion.div>
    </div>
  );
}
