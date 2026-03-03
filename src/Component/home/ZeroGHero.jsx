'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { motion } from 'framer-motion';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useState } from 'react';

const ZeroGCanvas = dynamic(() => import('./ZeroGCanvas'), {
  ssr: false,
  loading: () => <div className="absolute inset-0 z-0 bg-transparent animate-pulse" />
});

export default function ZeroGHero() {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const [load3D, setLoad3D] = useState(false);

  useEffect(() => {
    // Delay loading the heavy 3D canvas so LCP completes first
    const timer = setTimeout(() => setLoad3D(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-text-char', {
        y: 100,
        opacity: 0,
        stagger: 0.05,
        duration: 1,
        ease: 'power4.out',
        delay: 0.8,
      });

      gsap.from('.hero-cta', {
        y: 20,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: 1.5,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const title = "SHOP THE VOID";

  return (
    <section ref={containerRef} className="relative h-screen min-h-[800px] w-full flex items-center justify-center overflow-hidden">
      {/* 3D CANVAS LAZY LOADED */}
      <div className="absolute inset-0 z-0 opacity-40 md:opacity-100">
        {load3D && <ZeroGCanvas />}
      </div>

      {/* CONTENT */}
      <div className="relative z-10 text-center px-6">
        <div ref={textRef} className="mb-8">
          <span className="text-[10px] font-mono tracking-[0.5em] text-cyan-400 uppercase mb-4 block animate-pulse">
            // PROTOCOL: QUICKQART_ACTIVE
          </span>
          <h1 className="text-6xl md:text-[12rem] font-display font-black leading-none flex justify-center overflow-hidden h-[1.1em] md:h-[1.1em]">
            {title.split("").map((char, i) => (
              <span key={i} className="hero-text-char inline-block">
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </h1>
          <p className="max-w-xl mx-auto text-text-secondary text-sm md:text-lg font-body mt-6 uppercase tracking-widest opacity-80">
            E-commerce redefined for the age of QuickQart. <br />
            Floating inventory. 3D physics. Beyond the horizon.
          </p>
        </div>

        <div className="hero-cta flex flex-wrap gap-4 justify-center">
          <Link href="/products" className="btn-glitch text-xs">
            EXPLORE COLLECTIONS
          </Link>
          <Link href="/about" className="px-8 py-4 glass-island text-[10px] font-mono uppercase tracking-widest hover:bg-white/10 transition-colors">
            THE MANIFESTO
          </Link>
        </div>
      </div>

      {/* SCROLL INDICATOR */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-cyan-400/50"
      >
        <span className="text-[9px] font-mono uppercase tracking-widest vertical-rl">SCROLL</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-cyan-400 to-transparent" />
      </motion.div>
    </section>
  );
}
