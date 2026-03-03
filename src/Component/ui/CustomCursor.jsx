'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && !window.matchMedia("(pointer: fine)").matches) {
      return;
    }
    const onMouseMove = (e) => {
      const { clientX, clientY } = e;
      
      gsap.to(cursorRef.current, {
        x: clientX - 10,
        y: clientY - 10,
        duration: 0.1,
        ease: 'none',
      });

      gsap.to(glowRef.current, {
        x: clientX,
        y: clientY,
        duration: 0.8,
        ease: 'power3.out',
      });
    };

    window.addEventListener('mousemove', onMouseMove);

    const onMouseEnter = () => {
      gsap.to(cursorRef.current, { scale: 3, duration: 0.3 });
    };

    const onMouseLeave = () => {
      gsap.to(cursorRef.current, { scale: 1, duration: 0.3 });
    };

    const interactables = document.querySelectorAll('a, button, [role="button"]');
    interactables.forEach((el) => {
      el.addEventListener('mouseenter', onMouseEnter);
      el.addEventListener('mouseleave', onMouseLeave);
    });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      interactables.forEach((el) => {
        el.removeEventListener('mouseenter', onMouseEnter);
        el.removeEventListener('mouseleave', onMouseLeave);
      });
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="custom-cursor hidden lg:block" />
      <div ref={glowRef} className="custom-cursor-glow hidden lg:block" />
    </>
  );
}
