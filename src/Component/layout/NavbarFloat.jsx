'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { Search, User, Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import MagneticWrapper from '@/Component/ui/MagneticWrapper';
import CartOrb from './CartOrb';
import { useCart } from '@/hooks/useCart';

export default function NavbarFloat() {
  const { t } = useTranslation();
  const { cartItemsCount } = useCart();
  const navRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    gsap.fromTo(navRef.current, 
      { y: -100, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1.2, ease: 'power4.out', delay: 0.5 }
    );
  }, []);

  return (
    <nav 
      ref={navRef}
      className={`fixed top-8 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 ${
        isScrolled ? 'w-[95%] lg:w-[85%]' : 'w-[90%] lg:w-[75%]'
      }`}
    >
      <div className="glass-island px-8 py-3 flex items-center justify-between relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 z-10">
          <div className="w-8 h-8 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_20px_rgba(10,255,232,0.8)]" />
          <span className="font-display text-xl tracking-tighter">QuickQart</span>
        </Link>

        {/* NAV LINKS */}
        <div className="hidden md:flex items-center gap-8 z-10">
          {['Electronics', 'Fashion', 'Home', 'Sports', 'Books'].map((cat) => (
            <MagneticWrapper key={cat} strength={0.2}>
              <Link 
                href={`/category/${cat.toLowerCase()}`}
                className="text-[11px] font-mono uppercase tracking-[0.2em] text-text-secondary hover:text-primary-cyan transition-colors relative group/link"
              >
                {cat}
                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary-cyan group-hover/link:w-full transition-all duration-300" />
              </Link>
            </MagneticWrapper>
          ))}
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-6 z-10">
          <MagneticWrapper strength={0.4}>
            <button className="text-text-secondary hover:text-primary-cyan transition-all">
              <Search size={18} />
            </button>
          </MagneticWrapper>
          
          <CartOrb count={cartItemsCount} />

          <MagneticWrapper strength={0.4}>
            <Link href="/profile">
              <User size={18} className="text-text-secondary hover:text-primary-cyan transition-all" />
            </Link>
          </MagneticWrapper>
          
          <button 
            className="md:hidden text-primary-cyan"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div className={`md:hidden absolute top-full left-0 w-full mt-4 glass-island rounded-[32px] overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        mobileMenuOpen ? 'max-h-[500px] opacity-100 p-8' : 'max-h-0 opacity-0 p-0'
      }`}>
        <div className="flex flex-col gap-6 items-center">
          {['Electronics', 'Fashion', 'Home', 'Sports', 'Books'].map((cat) => (
            <Link 
              key={cat}
              href={`/category/${cat.toLowerCase()}`}
              className="text-lg font-display uppercase tracking-widest text-white hover:text-primary-cyan transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
