import { m } from "framer-motion";
import { memo, useState } from "react";
import Image from "next/image";

function HeroProductCard({ product }) {
  const [hasError, setHasError] = useState(false);
  if (!product) return null;

  const cardVariants = {
    initial: { opacity: 0, scale: 0.95, y: 30 },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  const imageSrc = product.imageUrl;
  const isImageUrl =
    typeof imageSrc === "string" &&
    (imageSrc.startsWith("/") || imageSrc.startsWith("http")) &&
    !hasError;

  return (
    <m.div
      variants={cardVariants}
      initial="initial"
      animate="animate"
      className="relative group w-full max-w-md mx-auto"
    >
      {/* Subtle White Glow */}
      <div className="absolute inset-0 bg-white/5 rounded-none blur-3xl transform translate-y-10 group-hover:bg-white/10 transition-colors duration-1000" />

      {/* Card - Elite Brutalist Aesthetic */}
      <div className="relative bg-black rounded-none p-10 shadow-2xl border border-white/10 overflow-hidden group-hover:border-white transition-all duration-700">
        
        {/* Decorative corner accents */}
        <div className="absolute top-0 left-0 w-10 h-10 border-t border-l border-white m-4 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-700 group-hover:m-0"></div>
        <div className="absolute bottom-0 right-0 w-10 h-10 border-b border-r border-white m-4 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-700 group-hover:m-0"></div>

        {/* Image Area */}
        <div className="relative aspect-[4/5] rounded-none overflow-hidden bg-black mb-10 shadow-2xl border border-white/5 group-hover:border-white/20 transition-all duration-1000">
          {isImageUrl ? (
            <Image
              src={imageSrc}
              alt={product.title || "Product"}
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transform scale-100 group-hover:scale-110 transition-all duration-1000 ease-in-out"
              priority
              fetchPriority="high"
              width={600}
              height={750}
              quality={90}
              sizes="(max-width: 768px) 100vw, 500px"
              onError={() => setHasError(true)}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-black text-gray-800">
               <span className="text-4xl opacity-20 mb-6 grayscale">{product.emoji || "✨"}</span>
               <span className="text-[9px] font-mono tracking-[0.5em] uppercase opacity-30 font-black italic underline decoration-white/20">Asset Missing</span>
            </div>
          )}
          
          {/* Subtle Overlay on Image */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80 group-hover:opacity-40 transition-opacity duration-700"></div>
        </div>

        {/* Info Area - Clean Brutalist Typography */}
        <div className="space-y-6 px-2 relative z-10">
          <div className="flex justify-between items-start gap-4">
             <h3 className="text-2xl md:text-3xl font-heading font-black text-white tracking-tighter leading-none uppercase italic group-hover:translate-x-2 transition-transform duration-500">
              {product.title || "Untitled Product"}
            </h3>
            {product.discount && (
               <span className="bg-white text-black px-4 py-2 rounded-none text-[9px] font-mono font-black tracking-[0.3em] uppercase shrink-0 italic shadow-xl">
                 {product.discount}
               </span>
             )}
          </div>

          <div className="flex items-end justify-between pt-4 border-t border-white/5">
            <div className="flex flex-col gap-2">
              {product.oldPrice && (
                <span className="text-[10px] text-gray-700 line-through font-mono tracking-[0.2em] font-black uppercase italic">
                  {product.oldPrice}
                </span>
              )}
              <span className="text-4xl font-mono font-black text-white tracking-tighter uppercase italic leading-none">
                {product.price || ""}
              </span>
            </div>
            
            {/* Minimal Rating */}
            {product.rating > 0 && (
                <div className="flex items-center gap-2 bg-black border border-white/20 px-4 py-2 rounded-none shadow-2xl group-hover:border-white transition-all duration-500">
                  <span className="text-[10px] font-mono font-black text-white tracking-[0.2em]">{product.rating}</span>
                  <svg className="w-3.5 h-3.5 text-white fill-current opacity-20 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                </div>
            )}
          </div>
        </div>
      </div>
    </m.div>
  );
}

export default memo(HeroProductCard);
