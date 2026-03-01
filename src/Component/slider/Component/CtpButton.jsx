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
        whileHover={{
          scale: 1.05,
        }}
        whileTap={{ scale: 0.95 }}
        className="group relative px-12 py-6 bg-white text-black font-mono text-[10px] uppercase tracking-[0.5em] font-black rounded-none overflow-hidden transition-all hover:bg-black hover:text-white border border-white shadow-2xl active:scale-95 duration-500"
      >
        <div className="absolute inset-0 bg-black -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out"></div>
        <span className="relative z-10 flex items-center justify-center gap-4">
          Initialize Fetch
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
        className="px-12 py-6 bg-black text-gray-700 font-mono text-[10px] uppercase tracking-[0.5em] font-black rounded-none border border-white/10 hover:border-white hover:text-white transition-all duration-500 active:scale-95 italic"
      >
        [ Review Archive ]
      </m.button>
    </m.div>
  );
};
export default memo(CTAButtons);
