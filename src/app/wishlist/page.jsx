// src/app/wishlist/page.jsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useWishlist } from "../../hooks/useWishlist";
import { useAuth } from "../../contexts/AuthContext";

export default function WishlistPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { wishlistItems, toggleWishlist } = useWishlist();

  // ✅ Protect the route
  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login?redirect=/wishlist");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] bg-[#0f1117]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  const items = Array.isArray(wishlistItems) ? wishlistItems : [];

  if (items.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center bg-[#0f1117] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none z-0"></div>
        <div className="relative z-10 w-24 h-24 bg-[#161b27] border border-white/5 shadow-[0_0_30px_rgba(0,0,0,0.5)] rounded-[2rem] flex items-center justify-center mb-8">
          <svg className="w-10 h-10 text-blue-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        <h2 className="text-4xl font-sora font-black text-white tracking-tighter mb-4 relative z-10">Archive Empty.</h2>
        <p className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-[0.2em] mb-10 relative z-10">No assets currently flagged for monitoring</p>
        <Link 
          href="/products" 
          className="relative z-10 bg-blue-600/10 border border-blue-500/30 text-blue-400 font-mono text-xs font-bold uppercase tracking-[0.2em] px-10 py-5 rounded-2xl flex items-center gap-3 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-[0_0_20px_rgba(59,130,246,0.15)] hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] group"
        >
          Explore Network
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#0f1117] min-h-screen relative overflow-hidden py-20 md:py-32">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none z-0"></div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <header className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 border-b border-white/5 pb-8">
          <div>
              <span className="text-[10px] font-mono font-bold text-blue-500 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.8)]"></span>
                Storage Sector
              </span>
              <h1 className="text-4xl md:text-5xl font-sora font-black text-white tracking-tighter">Asset Wishlist.</h1>
          </div>
          <div className="mt-6 md:mt-0 flex items-center gap-2 px-4 py-2 bg-[#161b27] border border-white/10 rounded-xl shadow-inner">
             <span className="text-xs font-mono font-bold text-gray-400 uppercase tracking-[0.2em]">{items.length} Modules Monitored</span>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((product) => (
            <div 
              key={product._id || product.id} 
              className="group flex flex-col bg-[#161b27] border border-white/5 rounded-[2rem] overflow-hidden hover:border-blue-500/30 transition-all duration-500 relative shadow-2xl"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl pointer-events-none group-hover:bg-blue-500/10 transition-colors duration-500 z-0"></div>
              
              <div className="relative aspect-square bg-[#0f1117] overflow-hidden border-b border-white/5 z-10">
                <Link href={`/products/${product._id || product.id}`}>
                  <Image
                    src={product.image || "/images/default-product.png"}
                    alt={product.title || "Product"}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    quality={85}
                    className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90 group-hover:opacity-100"
                    unoptimized={true}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f1117] via-transparent to-transparent opacity-80 mix-blend-multiply pointer-events-none"></div>
                </Link>
                
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    toggleWishlist(product);
                  }}
                  className="absolute top-4 right-4 p-2.5 bg-red-500/10 backdrop-blur-md rounded-xl text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-colors shadow-sm z-20"
                  title="Remove from monitoring"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" fillRule="evenodd" />
                  </svg>
                </button>
              </div>

              <div className="p-6 flex flex-col flex-1 relative z-10">
                <h3 className="font-sora text-sm font-semibold text-gray-200 mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
                  <Link href={`/products/${product._id || product.id}`}>
                    {product.title}
                  </Link>
                </h3>
                
                <div className="flex items-baseline gap-2 mb-6 mt-auto pt-4">
                   <span className="text-xl font-mono font-black text-white tracking-tighter">
                    ${product.price}
                   </span>
                   {product.oldPrice && (
                     <span className="text-[10px] font-mono text-gray-500 line-through">
                       ${product.oldPrice}
                     </span>
                   )}
                </div>

                <Link
                  href={`/products/${product._id || product.id}`}
                  className="block w-full text-center py-3 border border-white/10 text-[10px] uppercase tracking-[0.2em] font-mono font-bold text-gray-400 rounded-xl hover:bg-white/5 hover:text-white hover:border-white/20 transition-all shadow-inner"
                >
                  Access terminal
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
