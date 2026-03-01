import { m } from "framer-motion";
import { memo } from "react";

const ProductIndicators = ({ products, activeProduct, setActiveProduct }) => {
  return (
    <div className="flex gap-4 items-center justify-center lg:justify-start">
      {products.map((_, idx) => (
        <m.button
          key={idx}
          onClick={() => setActiveProduct(idx)}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          aria-label={`Go to slide ${idx + 1}`}
          className={`h-1 transition-all duration-700 rounded-none ${
            idx === activeProduct ? "bg-white w-12 shadow-2xl" : "bg-white/10 hover:bg-white/30 w-6"
          }`}
        />
      ))}
      <span className="ml-4 text-[9px] font-mono font-black text-gray-700 uppercase tracking-[0.5em] italic">
        // Scan Sequence {activeProduct + 1}/{products.length}
      </span>
    </div>
  );
};

export default memo(ProductIndicators);
