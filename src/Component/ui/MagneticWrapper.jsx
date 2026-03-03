'use client';

import React, { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';

export default function MagneticWrapper({ children, strength = 0.5 }) {
  const container = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && !window.matchMedia("(pointer: fine)").matches) {
      return;
    }
    const el = container.current;
    if (!el) return;

    const onMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { left, top, width, height } = el.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      
      const distanceX = clientX - centerX;
      const distanceY = clientY - centerY;

      gsap.to(el, {
        x: distanceX * strength,
        y: distanceY * strength,
        duration: 0.3,
        ease: 'power3.out',
      });
    };

    const onMouseLeave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.3)',
      });
    };

    el.addEventListener('mousemove', onMouseMove);
    el.addEventListener('mouseleave', onMouseLeave);

    return () => {
      el.removeEventListener('mousemove', onMouseMove);
      el.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [strength]);

  return (
    <div ref={container} className="inline-block">
      {children}
    </div>
  );
}
