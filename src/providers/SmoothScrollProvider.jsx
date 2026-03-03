'use client';

import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';

export default function SmoothScrollProvider({ children }) {
  const initialized = useRef(false);

  useEffect(() => {
    let lenisInstance = null;
    let reqId = null;

    const initLenis = async () => {
      if (initialized.current) return;
      initialized.current = true;

      const Lenis = (await import('lenis')).default;
      
      lenisInstance = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
      });

      function raf(time) {
        lenisInstance?.raf(time);
        reqId = requestAnimationFrame(raf);
      }

      reqId = requestAnimationFrame(raf);
    };

    window.addEventListener('scroll', initLenis, { once: true, passive: true });
    window.addEventListener('touchstart', initLenis, { once: true, passive: true });
    window.addEventListener('mousemove', initLenis, { once: true, passive: true });

    return () => {
      window.removeEventListener('scroll', initLenis);
      window.removeEventListener('touchstart', initLenis);
      window.removeEventListener('mousemove', initLenis);
      if (reqId) cancelAnimationFrame(reqId);
      if (lenisInstance) lenisInstance.destroy();
    };
  }, []);

  return <>{children}</>;
}
