'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Star, Eye } from 'lucide-react';

export default function ProductCardFloat({ product }) {
  return (
    <Link 
      href={`/products/${product.slug}`}
      className="perspective-1000 group relative block will-change-transform transform transition-transform duration-300 hover:-translate-y-2"
    >
      <div className="product-card animate-quickqart p-6 flex flex-col items-center gap-4 relative overflow-hidden h-full">
        <div className="holo-shimmer" />
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4 z-20">
          <span className="text-[10px] font-mono uppercase tracking-widest bg-cyan-400/10 text-cyan-400 px-3 py-1 rounded-full border border-cyan-400/20 backdrop-blur-md">
            {product.categorySlug || 'New Arrival'}
          </span>
        </div>

        {/* Product Image */}
        <div className="relative w-full overflow-hidden" style={{ aspectRatio: '1 / 1' }}>
          <div className="absolute inset-0 group-hover:scale-110 transition-transform duration-500">
          <Image 
            src={product.image || '/images/placeholder.png'} 
            alt={product.name}
            fill
            className="object-contain drop-shadow-[0_20px_50px_rgba(10,255,232,0.2)] grayscale-[0.2] group-hover:grayscale-0"
            unoptimized={true}
          />
          </div>
        </div>

        {/* Info */}
        <div className="w-full space-y-2 z-20">
          <h3 className="line-clamp-1">{product.name}</h3>
          
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={12} 
                className={`${i < (product.rating || 4) ? 'fill-cyan-400 text-cyan-400' : 'text-cyan-400/20'}`} 
              />
            ))}
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="font-mono text-cyan-400 font-bold text-lg">
              ${product.price}
            </span>
            <div className="flex gap-2">
              <button className="p-2 glass-island hover:bg-cyan-400/20 transition-colors">
                <ShoppingCart size={18} className="text-cyan-400" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </Link>
  );
}
