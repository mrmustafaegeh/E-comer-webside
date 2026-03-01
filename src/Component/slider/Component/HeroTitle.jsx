"use client";

import { m } from "framer-motion";

const HeroTitle = () => {
  return (
    <div className="space-y-10">
      <m.h1 
        initial={{ clipPath: "inset(0 100% 0 0)", opacity: 0 }}
        animate={{ clipPath: "inset(0 0% 0 0)", opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="text-6xl sm:text-8xl lg:text-[9rem] font-heading font-black tracking-tighter text-white leading-[0.9] uppercase italic text-shadow-3d border-accent-left"
      >
        Monochrome <br className="hidden lg:block"/>
        <span className="text-white opacity-20">Systems</span> Core.
      </m.h1>

      <m.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="text-base sm:text-lg text-gray-700 max-w-xl mx-auto lg:mx-0 font-mono font-black uppercase tracking-[0.4em] leading-relaxed italic"
      >
        // Elevate your everyday operational capacity with premium, production-grade tech essentials designed for the elite.
      </m.p>
    </div>
  );
}

export default HeroTitle;
