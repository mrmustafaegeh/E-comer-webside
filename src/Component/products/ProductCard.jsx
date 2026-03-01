// Component/products/ProductCard.jsx
"use client";

import { useRouter } from "next/navigation";
import { useCart } from "../../hooks/useCart";
import { useWishlist } from "../../hooks/useWishlist";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { useState, memo } from "react";
import Image from "next/image";

import { useAuth } from "../../contexts/AuthContext";

function ProductCard({ product }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { wishlistItems, toggleWishlist } = useWishlist();
  const { user } = useAuth();
  const [isAdding, setIsAdding] = useState(false);
  const [imageError, setImageError] = useState(false);

  const safeWishlist = wishlistItems ?? [];
  const isWishlisted = safeWishlist.some((item) => item._id === product._id);

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    setIsAdding(true);

    const cartProduct = {
      ...product,
      id: product._id,
      name: product.title,
      price: product.offerPrice || product.price,
      qty: 1,
    };

    await addToCart(cartProduct);
    setTimeout(() => setIsAdding(false), 1000);
  };

  const handleToggleWishlist = (e) => {
    e.stopPropagation();
    
    if (!user) {
      router.push("/auth/login?redirect=/wishlist"); 
      return;
    }

    toggleWishlist(product);
  };

  const discount = product.offerPrice
    ? Math.round(((product.price - product.offerPrice) / product.price) * 100)
    : 0;

  return (
    <article
      className="group bg-black rounded-none border border-white/10 hover:border-white transition-all duration-700 cursor-pointer relative overflow-hidden shadow-2xl"
      onClick={() => router.push(`/products/${product.slug || product._id}`)}
    >
      {/* Subtle White Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl pointer-events-none group-hover:bg-white/10 transition-colors duration-1000"></div>

      {/* Image Container */}
      <div className="relative overflow-hidden aspect-[4/5] bg-black border-b border-white/10">
        {!imageError ? (
          <Image
            src={product.image || "/images/default-product.png"}
            alt={product.title}
            className="object-cover grayscale group-hover:grayscale-0 scale-100 group-hover:scale-110 transition-all duration-1000 ease-in-out opacity-80 group-hover:opacity-100"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            quality={80}
            loading="lazy"
            unoptimized={true}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/20 bg-black italic font-mono text-[10px] tracking-widest uppercase">
             // Asset Encrypted
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90 mix-blend-multiply pointer-events-none group-hover:opacity-60 transition-opacity"></div>

        {/* Badges - Top Left */}
        <div className="absolute top-0 left-0 p-6 flex flex-col gap-3 pointer-events-none z-10">
          {discount > 0 && (
            <span className="bg-white text-black text-[9px] font-mono font-black uppercase tracking-[0.3em] px-3 py-1.5 rounded-none shadow-xl italic">
              -{discount}% DELTA
            </span>
          )}
          {product.rating >= 4.8 && (
            <span className="bg-black border border-white text-white text-[9px] font-mono font-black uppercase tracking-[0.3em] px-3 py-1.5 rounded-none shadow-xl italic">
              PRIORITY NODE
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-6 right-6 p-3 rounded-none transition-all duration-700 z-20 backdrop-blur-3xl border ${
            isWishlisted
              ? "bg-white border-white text-black shadow-2xl opacity-100"
              : "bg-black/50 border-white/20 text-gray-500 hover:text-white hover:border-white opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0"
          }`}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} strokeWidth={1.5} />
        </button>

        {/* Quick Add - Slide Up */}
        <div className="absolute inset-x-0 bottom-0 z-20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 shadow-2xl">
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="w-full bg-white text-black py-6 font-mono font-black text-[10px] uppercase tracking-[0.5em] hover:bg-black hover:text-white border-t border-white transition-all duration-500 flex items-center justify-center gap-4 disabled:opacity-50 italic group/btn"
          >
             {isAdding ? "INJECTING PROTOCOL..." : "ACQUIRE ASSET"}
             <ShoppingCart className="w-4 h-4 translate-x-0 group-hover/btn:translate-x-2 transition-transform" />
          </button>
        </div>
      </div>

      {/* Product Info - Clean & Brutalist */}
      <div className="p-8 relative z-10">
        
        {/* Title */}
        <h3 className="font-heading font-black text-white mb-4 text-xl md:text-2xl leading-none uppercase italic group-hover:translate-x-2 transition-transform duration-500 truncate">
          {product.title}
        </h3>

        {/* Price & Rating Row */}
        <div className="flex items-end justify-between border-t border-white/5 pt-6">
            <div className="flex flex-col gap-2">
                {product.offerPrice && (
                    <span className="text-[10px] font-mono text-gray-800 line-through uppercase tracking-widest italic font-black">
                        ${product.price.toFixed(2)}
                    </span>
                )}
                <span className="text-3xl font-mono font-black text-white tracking-tighter uppercase leading-none">
                    ${(product.offerPrice || product.price).toFixed(2)}
                </span>
            </div>

            {/* Minimal Stock Indicator */}
            {product.stock !== undefined && (
                <div className="flex flex-col items-end gap-2">
                   <div className={`w-2 h-2 ${product.stock > 0 ? "bg-white shadow-[0_0_10px_white]" : "bg-gray-800"}`} />
                   <span className="text-[8px] font-mono font-black text-gray-800 uppercase tracking-[0.4em] italic">{product.stock > 0 ? "IN STOCK" : "NULL ASSET"}</span>
                </div>
            )}
        </div>

        {/* Category Label */}
        <p className="text-[9px] text-gray-900 font-mono font-black uppercase tracking-[0.5em] mt-6 pt-6 border-t border-white/5 truncate italic group-hover:text-gray-500 transition-colors duration-700">
          // {product.category}
        </p>
      </div>
    </article>
  );
}

export default memo(ProductCard);