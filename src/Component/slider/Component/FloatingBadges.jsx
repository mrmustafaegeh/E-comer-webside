import { motion } from "framer-motion";

const FloatingBadges = () => {
  return (
    <>
      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-8 -right-8 px-5 py-2.5 bg-black border border-white/20 text-white text-[9px] font-mono tracking-[0.4em] font-black uppercase rounded-none shadow-2xl flex items-center gap-3 backdrop-blur-xl group hover:border-white transition-colors duration-700 italic transform-gpu will-change-transform"
      >
        <div className="w-1.5 h-1.5 bg-white opacity-20 group-hover:opacity-100 transition-opacity"></div>
        Thermal Sector // ACTIVE
      </motion.div>

      <motion.div
        animate={{ x: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity, delay: 0.5, ease: "easeInOut" }}
        className="absolute -bottom-8 -left-8 px-5 py-2.5 bg-black border border-white/20 text-white text-[9px] font-mono tracking-[0.4em] font-black uppercase rounded-none shadow-2xl flex items-center gap-3 backdrop-blur-xl group hover:border-white transition-colors duration-700 italic transform-gpu will-change-transform"
      >
        <div className="w-1.5 h-1.5 bg-white opacity-20 group-hover:opacity-100 transition-opacity shadow-[0_0_10px_rgba(255,255,255,0.8)]"></div>
        Rapid Deployment // v.2.4
      </motion.div>
    </>
  );
};
export default FloatingBadges;
