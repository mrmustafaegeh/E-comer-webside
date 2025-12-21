"use client";
import { motion } from "framer-motion";

const AnimatedBackground = () => {
  return (
    <div className="absolute inset-0">
      <motion.div
        className="absolute top-0 left-0 w-96 h-96 bg-purple-500/30 rounded-full filter blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute top-20 right-0 w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -50, 0],
          y: [0, 50, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, delay: 1 }}
      />
      <motion.div
        className="absolute bottom-0 left-1/3 w-96 h-96 bg-pink-500/20 rounded-full filter blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          x: [0, 30, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 9, repeat: Infinity, delay: 2 }}
      />
    </div>
  );
};
export default AnimatedBackground;
