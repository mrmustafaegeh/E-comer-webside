"use client";

import { useCart } from "../../hooks/useCart";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShoppingCart, Loader2 } from "lucide-react";

const CartPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const {
    cartItems,
    removeFromCart,
    clearCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const parsePrice = (price) => {
    if (price == null || price === "") return 0;
    if (typeof price === "number" && !isNaN(price)) return price;
    const cleaned = String(price).replace(/[^0-9.-]+/g, "");
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  };

  const validatedCartItems = cartItems
    .map((item, idx) => {
      const itemPrice = item.offerPrice || item.price;
      return {
        ...item,
        id: item.id || item._id,
        name: item.name || item.title || "Unknown Product",
        price: parsePrice(itemPrice),
        qty: Math.max(1, Math.min(Number(item.qty) || 1, 99)),
        imgSrc: item.image || item.imgSrc,
      };
    })
    .filter((item) => item.price > 0);

  const total = validatedCartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  if (!mounted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] bg-black">
         <Loader2 className="animate-spin w-10 h-10 text-white mb-6" />
         <p className="text-[10px] font-mono font-black text-gray-500 uppercase tracking-[0.5em] animate-pulse">Initializing Terminal...</p>
      </div>
    );
  }

  if (validatedCartItems.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-6 bg-black relative">
        {/* Monochrome Noise Overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none z-0"></div>
        
        <div className="w-24 h-24 bg-black rounded-none flex items-center justify-center mb-10 border border-white/20 shadow-2xl relative z-10 transition-transform hover:rotate-12 duration-700">
            <ShoppingBag size={40} strokeWidth={1} className="text-white opacity-20" />
        </div>
        <h1 className="text-5xl md:text-7xl font-heading font-black text-white tracking-tighter mb-4 uppercase italic relative z-10">Queue Empty.</h1>
        <p className="text-[10px] font-mono font-black text-gray-700 uppercase tracking-[0.6em] mb-12 text-center relative z-10">Terminal ready for data injection</p>
        <button
          onClick={() => router.push("/products")}
          className="flex items-center gap-4 px-12 py-6 bg-white border border-white text-black rounded-none font-mono text-[10px] font-black uppercase tracking-[0.4em] hover:bg-black hover:text-white transition-all shadow-xl relative z-10 group active:scale-95"
        >
          Explore Assets <ArrowRight className="group-hover:translate-x-3 transition-transform" />
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative">
      {/* Monochrome Noise Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay pointer-events-none z-0"></div>
      
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-24 md:py-40 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 xl:gap-24 relative">
          
          {/* Left: Cart Items */}
          <div className="flex-1 w-full lg:max-w-[900px]">
            <header className="mb-20 border-b border-white/10 pb-12">
              <span className="text-[10px] font-mono font-black text-white uppercase tracking-[0.5em] mb-6 flex items-center gap-3">
                 <span className="w-1.5 h-1.5 bg-white rounded-none animate-pulse"></span>
                 Selection Queue
              </span>
              <h1 className="text-6xl md:text-8xl font-heading font-black text-white tracking-tighter uppercase italic leading-none">Your Terminal.</h1>
            </header>

            <div className="space-y-8">
              <AnimatePresence>
                {validatedCartItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="group flex flex-col md:flex-row items-center gap-8 p-10 bg-black border border-white/5 rounded-none hover:border-white transition-all duration-700 relative overflow-hidden shadow-2xl"
                  >
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
                    
                    {/* Product Image */}
                    <div className="relative w-full md:w-48 aspect-[4/5] bg-black rounded-none overflow-hidden border border-white/10 flex-shrink-0 group-hover:border-white transition-all duration-1000 z-10">
                      <Image
                        src={item.imgSrc || "/images/default-product.png"}
                        alt={item.name}
                        fill
                        className="object-cover grayscale hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 w-full relative z-10 flex flex-col justify-between h-full min-h-[180px]">
                      <div className="flex justify-between items-start mb-6">
                        <div className="space-y-3">
                          <h3 className="text-2xl md:text-3xl font-heading font-black text-white tracking-tight leading-none uppercase italic group-hover:translate-x-2 transition-transform duration-500">
                            {item.name}
                          </h3>
                          {item.category && (
                             <p className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-none text-[9px] font-mono font-medium text-gray-500 uppercase tracking-[0.3em]">{item.category}</p>
                          )}
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-4 bg-white/5 text-gray-600 hover:text-white hover:bg-black border border-transparent hover:border-white transition-all active:scale-90"
                        >
                          <Trash2 size={18} strokeWidth={1.5} />
                        </button>
                      </div>

                      <div className="flex flex-wrap items-end justify-between gap-8 mt-auto border-t border-white/5 pt-8">
                         {/* Quantity Controls */}
                         <div className="flex items-center gap-2 p-1 bg-black rounded-none border border-white/10">
                            <button
                              onClick={() => decreaseQuantity(item.id)}
                              disabled={item.qty <= 1}
                              className="p-3 text-gray-600 hover:text-white hover:bg-white/10 rounded-none transition-all disabled:opacity-10"
                            >
                              <Minus size={16} strokeWidth={2} />
                            </button>
                            <span className="w-12 text-center text-[11px] font-mono font-black text-white">{item.qty}</span>
                            <button
                              onClick={() => increaseQuantity(item.id)}
                              className="p-3 text-gray-600 hover:text-white hover:bg-white/10 rounded-none transition-all"
                            >
                              <Plus size={16} strokeWidth={2} />
                            </button>
                         </div>

                         <div className="text-right">
                            <p className="text-[9px] font-mono font-black text-gray-700 uppercase tracking-[0.4em] mb-2 font-black">Net Value</p>
                            <p className="text-3xl font-mono font-black text-white tracking-tighter uppercase">{formatPrice(item.price * item.qty)}</p>
                         </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Right: Summary */}
          <div className="w-full lg:w-[400px]">
            <div className="sticky top-32 p-10 bg-black rounded-none border border-white/10 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[80px] rounded-full pointer-events-none group-hover:bg-white/10 transition-colors"></div>
              
              <h2 className="text-[11px] font-mono font-black text-white tracking-[0.4em] mb-12 pb-8 border-b border-white/10 uppercase italic flex items-center gap-4">
                  <ShoppingCart size={20} strokeWidth={1.5} className="text-white opacity-20" /> Compilation Summary
              </h2>
              
              <div className="space-y-8 pb-10 border-b border-white/10 relative z-10">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-mono font-black text-gray-600 uppercase tracking-[0.3em]">Raw Computation</span>
                  <span className="font-mono font-black text-white text-xs">{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-mono font-black text-gray-600 uppercase tracking-[0.3em]">Logistics Duty</span>
                  <span className="font-mono font-black text-white uppercase text-[9px] tracking-[0.2em] border border-white/10 px-3 py-1">Complimentary</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-mono font-black text-gray-600 uppercase tracking-[0.3em]">Duty (VAT)</span>
                  <span className="font-mono font-black text-gray-800 text-[9px] uppercase tracking-widest italic">Link-Dependent</span>
                </div>
              </div>

              <div className="py-10 space-y-4 relative z-10">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-mono font-black text-white uppercase tracking-[0.4em]">Final Valuation</span>
                  <span className="text-4xl font-mono font-black text-white tracking-tighter uppercase leading-none">{formatPrice(total)}</span>
                </div>
                <p className="text-[8px] font-mono font-black text-gray-800 uppercase tracking-[0.3em] text-right italic">Structural integrity verified //</p>
              </div>

              <button
                 onClick={() => router.push("/checkout")}
                 className="relative z-10 w-full bg-white text-black py-6 rounded-none font-mono text-[10px] font-black uppercase tracking-[0.5em] shadow-xl hover:bg-black hover:text-white border border-white transition-all mt-6 flex items-center justify-center gap-4 overflow-hidden group/btn active:scale-95 duration-500"
              >
                <div className="absolute inset-0 bg-black -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-500 ease-in-out"></div>
                Initialize Checkout <ArrowRight size={18} className="group-hover/btn:translate-x-3 transition-transform relative z-10" />
                <span className="relative z-10"></span>
              </button>

              <button
                 onClick={() => router.push("/products")}
                 className="relative z-10 w-full py-6 text-[9px] font-mono font-black text-gray-700 uppercase tracking-[0.4em] hover:text-white transition-colors mt-6 text-center italic"
              >
                Suspend Session & Resume Scan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
