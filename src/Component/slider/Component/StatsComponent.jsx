import { motion } from "framer-motion";

const StatsSection = () => {
  const stats = [
    { value: "50K+", label: "ACTIVE NODES" },
    { value: "10K+", label: "DATA ARRAYS" },
    { value: "24/7", label: "GLOBAL SYNC" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.7 }}
      className="grid grid-cols-3 gap-12"
    >
      {stats.map((stat, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 + idx * 0.15 }}
          className="text-center lg:text-left flex flex-col gap-2 group cursor-default"
        >
          <motion.div
            whileHover={{ x: 5 }}
            className="text-4xl font-mono font-black text-white tracking-tighter uppercase italic leading-none transition-transform duration-500"
          >
            {stat.value}
          </motion.div>
          <div className="text-[9px] font-mono font-black tracking-[0.4em] uppercase text-gray-700 italic group-hover:text-white transition-colors duration-500">
            // {stat.label}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};
export default StatsSection;
