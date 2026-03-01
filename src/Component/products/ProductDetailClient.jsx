"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  Heart, 
  ShoppingCart, 
  Truck, 
  ShieldCheck, 
  Minus, 
  Plus, 
  ArrowRight,
  ChevronRight,
  Box,
  RefreshCcw,
  Zap,
  Info,
  Sparkles,
  Loader2
} from "lucide-react";
import { useCart } from "../../hooks/useCart";
import { useWishlist } from "../../hooks/useWishlist";
import { useAuth } from "../../contexts/AuthContext";
import { calculatePoints } from "../../services/loyaltyService";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function ProductDetailClient({ product }) {
  const { addToCart } = useCart();
  const { wishlistItems, toggleWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const { user } = useAuth();

  const estimatedPoints = calculatePoints(
      [{ ...product, price: product.offerPrice || product.price }], 
      (product.offerPrice || product.price) * quantity,
      user?.loyaltyPoints || 0
  );

  const images = product.images?.length > 0 ? product.images : [product.image];
  const isWishlisted = wishlistItems?.some((item) => item._id === product._id);

  const handleAddToCart = async () => {
    setIsAdding(true);
    // Add multiple quantities if selected
    for (let i = 0; i < quantity; i++) {
        await addToCart({
            ...product,
            id: product._id,
            name: product.title,
            price: product.offerPrice || product.price,
            qty: 1
        });
    }
    setTimeout(() => setIsAdding(false), 1500);
  };

  const discount = product.offerPrice
    ? Math.round(((product.price - product.offerPrice) / product.price) * 100)
    : 0;

  return (
    <div className="bg-black min-h-screen relative overflow-hidden">
      {/* Background Noise & Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay pointer-events-none z-0"></div>
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/5 blur-[120px] rounded-full pointer-events-none z-0"></div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16 lg:py-32 relative z-10">
        
        {/* Navigation / Breadcrumbs */}
        <nav className="flex flex-wrap items-center gap-5 text-[10px] font-mono font-black uppercase tracking-[0.5em] text-gray-700 mb-20 relative z-10 italic">
          <Link href="/" className="hover:text-white transition-all underline underline-offset-8">System Root</Link>
          <ChevronRight size={14} className="opacity-20 translate-y-[-1px]" />
          <Link href="/products" className="hover:text-white transition-all underline underline-offset-8">Archive</Link>
          <ChevronRight size={14} className="opacity-20 translate-y-[-1px]" />
          <span className="text-white">// {product.category}</span>
        </nav>

        <div className="grid lg:grid-cols-12 gap-20 xl:gap-32">
          
          {/* LEFT: Visual Showcase */}
          <div className="lg:col-span-12 xl:col-span-7 space-y-12 relative z-10">
            <div className="relative aspect-[4/5] md:aspect-square lg:aspect-[4/5] bg-black rounded-none overflow-hidden border border-white/10 shadow-2xl group">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedImage}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full h-full relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10 pointer-events-none opacity-80 group-hover:opacity-40 transition-opacity duration-1000"></div>
                  <Image
                    src={images[selectedImage]}
                    alt={product.title}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-[1500ms] group-hover:scale-105"
                    priority
                    unoptimized={true}
                    sizes="(max-width: 1024px) 100vw, 60vw"
                  />
                </motion.div>
              </AnimatePresence>

              {discount > 0 && (
                <div className="absolute top-12 left-12 z-20 bg-white text-black px-10 py-5 rounded-none font-mono font-black text-[11px] tracking-[0.4em] uppercase shadow-2xl italic border border-white">
                  DELTA -{discount}%
                </div>
              )}

              {product.stock <= 5 && product.stock > 0 && (
                <div className="absolute bottom-12 left-12 z-20 bg-black/80 backdrop-blur-xl px-10 py-5 rounded-none font-mono font-black text-[11px] tracking-[0.4em] text-white shadow-2xl border border-white/20 uppercase animate-pulse italic">
                  // CRITICAL: {product.stock} UNITS REMAINING
                </div>
              )}
            </div>

            {/* Gallery Navigation */}
            {images.length > 1 && (
              <div className="flex flex-wrap gap-6">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-28 h-36 rounded-none overflow-hidden border-2 transition-all duration-700 bg-black ${
                      selectedImage === idx 
                        ? "border-white scale-110 shadow-2xl opacity-100" 
                        : "border-white/5 opacity-20 hover:opacity-100 scale-95 hover:scale-100 hover:border-white/20 grayscale"
                    }`}
                  >
                    <Image src={img} alt="Thumb" fill className="object-cover" unoptimized={true} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Data Specifications */}
          <div className="lg:col-span-12 xl:col-span-5 flex flex-col justify-center relative z-10">
            <div className="space-y-16">
              <header className="space-y-10">
                <div className="flex flex-wrap items-center gap-6">
                    <span className="text-[10px] font-mono font-black tracking-[0.4em] uppercase text-white bg-white/5 border border-white/10 px-6 py-2 rounded-none italic">
                      // {product.category}
                    </span>
                    <span className="text-[10px] font-mono font-black tracking-[0.4em] uppercase text-gray-800 italic">
                        ID: {(product._id || "REF-000").substring(0, 8).toUpperCase()}
                    </span>
                </div>
                
                <h1 className="text-6xl md:text-8xl xl:text-9xl font-heading font-black text-white tracking-tighter leading-none uppercase italic border-l-4 border-white pl-10">
                  {product.title}.
                </h1>

                <div className="flex items-center gap-10 border-t border-white/5 pt-10">
                    <span className="text-5xl font-mono font-black text-white tracking-tighter italic uppercase leading-none">
                        ${(product.offerPrice || product.price).toFixed(2)}
                    </span>
                    {product.offerPrice && (
                        <span className="text-3xl text-gray-800 line-through font-mono font-black tracking-tighter italic uppercase">
                            ${product.price.toFixed(2)}
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-4 group">
                    <Sparkles size={20} strokeWidth={1} className="text-white opacity-20 group-hover:opacity-100 transition-opacity" />
                    <span className="text-[10px] font-mono font-black text-gray-700 uppercase tracking-[0.4em] italic group-hover:text-white transition-colors duration-500">
                        ESTIMATED PROTOCOL YIELD: <span className="text-white underline underline-offset-8">{estimatedPoints} PTS</span>
                    </span>
                </div>
              </header>

              <div className="text-base text-gray-700 font-mono leading-relaxed max-w-xl whitespace-pre-line italic font-black uppercase tracking-widest border-l border-white/10 pl-10">
                {product.description || "// A precision-engineered essential designed for high-performance integration within contemporary digital and physical ecosystems. Minimalist aesthetics meet maximum functional output."}
              </div>

              {/* Interaction Terminal */}
              <div className="space-y-12 pt-16 border-t border-white/10">
                  <div className="flex items-center justify-between group">
                     <span className="text-[10px] font-mono font-black tracking-[0.5em] uppercase text-gray-800 italic group-hover:text-white transition-colors">// QUANTITY_MODULE</span>
                     <div className="flex items-center gap-4 bg-black p-2 rounded-none border border-white/10 shadow-2xl group-hover:border-white transition-all duration-700">
                        <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="w-12 h-12 flex items-center justify-center rounded-none text-gray-700 hover:text-white hover:bg-white/5 transition-all disabled:opacity-10"
                            disabled={quantity <= 1}
                        >
                            <Minus size={20} strokeWidth={2} />
                        </button>
                        <span className="w-16 text-center font-mono font-black text-white tracking-[0.4em] text-lg italic">{quantity}</span>
                        <button
                            onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
                            className="w-12 h-12 flex items-center justify-center rounded-none text-gray-700 hover:text-white hover:bg-white/5 transition-all disabled:opacity-10"
                            disabled={quantity >= product.stock}
                        >
                            <Plus size={20} strokeWidth={2} />
                        </button>
                     </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-6">
                    <button
                        onClick={handleAddToCart}
                        disabled={isAdding || product.stock === 0}
                        className="flex-[3] h-24 bg-white text-black rounded-none font-mono font-black text-[12px] uppercase tracking-[0.6em] flex items-center justify-center gap-6 border border-white hover:bg-black hover:text-white shadow-2xl active:scale-[0.95] transition-all duration-700 disabled:opacity-30 group relative overflow-hidden italic"
                    >
                        <div className="absolute inset-0 bg-black -translate-x-full group-hover:translate-x-0 transition-transform duration-700 ease-in-out"></div>
                        {isAdding ? (
                            <>
                                <Loader2 className="animate-spin relative z-10" size={24} strokeWidth={1.5} />
                                <span className="relative z-10">SYNCHRONIZING...</span>
                            </>
                        ) : product.stock === 0 ? (
                            <span className="relative z-10">INVENTORY_DEPLETED</span>
                        ) : (
                            <>
                                <ShoppingCart size={24} strokeWidth={1.5} className="relative z-10 group-hover:scale-110 transition-transform" />
                                <span className="relative z-10">EXECUTE_ACQUISITION</span>
                                <ArrowRight size={20} className="group-hover:translate-x-4 transition-transform relative z-10" />
                            </>
                        )}
                    </button>
                    <button
                        onClick={() => toggleWishlist(product)}
                        className={`flex-1 h-24 rounded-none flex items-center justify-center transition-all duration-700 active:scale-95 border group ${
                            isWishlisted 
                            ? "bg-white border-white text-black shadow-2xl" 
                            : "bg-black border-white/10 text-gray-800 hover:border-white hover:text-white shadow-2xl"
                        }`}
                    >
                        <Heart className={`${isWishlisted ? "fill-current" : ""} group-hover:scale-125 transition-transform`} size={32} strokeWidth={1} />
                    </button>
                  </div>
              </div>

              {/* Protocol Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-12 pt-16 border-t border-white/10">
                <div className="flex items-center gap-8 group">
                  <div className="w-16 h-16 bg-black rounded-none flex items-center justify-center text-white border border-white/5 shadow-2xl transition-all duration-700 group-hover:border-white">
                    <Zap size={24} strokeWidth={1} className="opacity-20 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-[9px] font-mono font-black uppercase tracking-[0.4em] text-gray-800 group-hover:text-white transition-colors italic">// LOGISTICS</h4>
                    <p className="font-mono font-black text-[11px] text-gray-500 uppercase tracking-widest italic group-hover:text-white transition-colors">PRIORITY_TRANSIT</p>
                  </div>
                </div>
                <div className="flex items-center gap-8 group">
                  <div className="w-16 h-16 bg-black rounded-none flex items-center justify-center text-white border border-white/5 shadow-2xl transition-all duration-700 group-hover:border-white">
                    <ShieldCheck size={24} strokeWidth={1} className="opacity-20 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-[9px] font-mono font-black uppercase tracking-[0.4em] text-gray-800 group-hover:text-white transition-colors italic">// AUTHENTICITY</h4>
                    <p className="font-mono font-black text-[11px] text-gray-500 uppercase tracking-widest italic group-hover:text-white transition-colors">VERIFIED_ORIGIN</p>
                  </div>
                </div>
                <div className="flex items-center gap-8 group">
                  <div className="w-16 h-16 bg-black rounded-none flex items-center justify-center text-white border border-white/5 shadow-2xl transition-all duration-700 group-hover:border-white">
                    <RefreshCcw size={24} strokeWidth={1} className="opacity-20 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-[9px] font-mono font-black uppercase tracking-[0.4em] text-gray-800 group-hover:text-white transition-colors italic">// RETURNS</h4>
                    <p className="font-mono font-black text-[11px] text-gray-500 uppercase tracking-widest italic group-hover:text-white transition-colors">30-CYCLE_WINDOW</p>
                  </div>
                </div>
                <div className="flex items-center gap-8 group">
                  <div className="w-16 h-16 bg-black rounded-none flex items-center justify-center text-white border border-white/5 shadow-2xl transition-all duration-700 group-hover:border-white">
                    <Info size={24} strokeWidth={1} className="opacity-20 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-[9px] font-mono font-black uppercase tracking-[0.4em] text-gray-800 group-hover:text-white transition-colors italic">// SUPPORT</h4>
                    <p className="font-mono font-black text-[11px] text-gray-500 uppercase tracking-widest italic group-hover:text-white transition-colors">24/7_TERMINAL</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
