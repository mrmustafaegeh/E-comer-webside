import { m } from "framer-motion";
import { memo } from "react";

const AnimatedBadge = () => {
  return (
    <m.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      className="inline-flex items-center gap-4 px-6 py-3 rounded-none bg-black border border-white/10 backdrop-blur-3xl group hover:border-white transition-all duration-700"
    >
      <m.span
        animate={{ opacity: [0.2, 1, 0.2] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="relative flex h-2 w-2 items-center justify-center"
      >
        <span className="absolute inline-flex h-full w-full bg-white opacity-20"></span>
        <span className="relative inline-flex h-1.5 w-1.5 bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]"></span>
      </m.span>
      <span className="text-[9px] font-mono font-black uppercase tracking-[0.5em] text-white italic group-hover:tracking-[0.6em] transition-all duration-700">
        // System Sequence Active • v4.0.2
      </span>
    </m.div>
  );
};
export default memo(AnimatedBadge);
