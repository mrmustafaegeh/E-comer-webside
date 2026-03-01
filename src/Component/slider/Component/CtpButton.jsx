import { m } from "framer-motion";
import { memo } from "react";

const CTAButtons = () => {
  return (
    <m.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
      className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start"
    >
      <m.button
        className="btn-primary flex items-center justify-center gap-4 group"
      >
        <span className="relative z-10 flex items-center justify-center gap-4">
          // EXECUTE ACQUISITION
          <m.svg
            className="w-4 h-4 group-hover:translate-x-3 transition-transform duration-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </m.svg>
        </span>
      </m.button>

      <m.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-12 py-6 bg-black text-white font-mono text-[10px] uppercase tracking-[0.5em] font-black rounded-none border border-white/10 hover:border-white transition-colors duration-500 active:scale-95 italic transform-gpu will-change-transform"
      >
        [ REVIEW ARCHIVE ]
      </m.button>
    </m.div>
  );
};
export default memo(CTAButtons);
