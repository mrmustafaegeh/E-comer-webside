"use client";

import React, { useRef, useEffect } from "react";

export default function MagneticWrapper({ children, strength = 0.5 }) {
  const container = useRef(null);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      !window.matchMedia("(pointer: fine)").matches
    ) {
      return;
    }
    const el = container.current;
    if (!el) return;

    const onMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { left, top, width, height } = el.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      const x = (clientX - centerX) * strength;
      const y = (clientY - centerY) * strength;
      el.style.transform = `translate(${x}px, ${y}px)`;
    };

    const onMouseLeave = () => {
      el.style.transform = "translate(0px, 0px)";
    };

    el.addEventListener("mousemove", onMouseMove);
    el.addEventListener("mouseleave", onMouseLeave);

    return () => {
      el.removeEventListener("mousemove", onMouseMove);
      el.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [strength]);

  return (
    <div
      ref={container}
      className="inline-block transition-transform duration-300 ease-out"
    >
      {children}
    </div>
  );
}
