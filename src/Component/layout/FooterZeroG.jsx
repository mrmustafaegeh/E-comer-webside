'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, Github, Twitter, Instagram } from 'lucide-react';
import MagneticWrapper from '@/Component/ui/MagneticWrapper';

export default function FooterZeroG() {
  return (
    <footer className="relative w-full overflow-hidden pt-40 pb-20 mt-auto">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
      
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-24 relative z-10">
        
        {/* BRAND */}
        <div className="space-y-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_20px_rgba(10,255,232,0.8)]" />
            <span className="font-display text-2xl tracking-tighter">QuickQart</span>
          </Link>
          <p className="text-text-secondary text-sm font-mono uppercase tracking-widest opacity-60 leading-relaxed">
            The first e-commerce protocol <br /> designed for the infinite void. <br />
            Built for 2026.
          </p>
          <div className="flex gap-4">
            {[Twitter, Github, Instagram].map((Icon, i) => (
              <MagneticWrapper key={i} strength={0.4}>
                <a href="#" className="p-3 glass-island hover:bg-cyan-400/20 transition-all text-cyan-400 hover:text-white">
                  <Icon size={18} />
                </a>
              </MagneticWrapper>
            ))}
          </div>
        </div>

        {/* LINKS */}
        {['Quick Links', 'Resources', 'Sector Info'].map((title, i) => (
          <div key={i} className="space-y-8">
            <h4 className="text-xs font-mono uppercase tracking-[0.4em] text-cyan-400">// {title}</h4>
            <div className="flex flex-col gap-4">
              {['Home', 'Products', 'Categories', 'About', 'Contact'].slice(i, i+4).map((link) => (
                <Link 
                  key={link} 
                  href={`/${link.toLowerCase()}`}
                  className="text-sm font-body uppercase tracking-widest text-text-secondary hover:text-white transition-colors flex items-center gap-2 group"
                >
                  <span className="w-0 h-[1px] bg-cyan-400 group-hover:w-4 transition-all duration-300" />
                  {link}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* BOTTOM */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 pt-20 flex flex-col md:flex-row items-center justify-between gap-8 border-t border-white/5 mt-20 opacity-40">
        <span className="text-[10px] font-mono tracking-widest uppercase">
          © 2026 QUICKQART COMMERCE. ALL RIGHTS RESERVED IN THE VOID.
        </span>
        <div className="flex gap-8 text-[10px] font-mono uppercase tracking-widest">
          <a href="#" className="hover:text-cyan-400 transition-colors">Privacy Protocol</a>
          <a href="#" className="hover:text-cyan-400 transition-colors">Term of Void</a>
        </div>
      </div>

      {/* BACKGROUND TEXT */}
      <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-full text-center select-none pointer-events-none opacity-[0.02]">
        <h2 className="text-[20rem] font-display font-black tracking-tighter uppercase leading-none whitespace-nowrap">
          QUICKQART
        </h2>
      </div>
    </footer>
  );
}
