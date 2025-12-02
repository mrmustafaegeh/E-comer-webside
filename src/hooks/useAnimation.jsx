"use client";

import { motion } from "framer-motion";

// Fade In Up Animation
export const FadeInUp = ({
  children,
  delay = 0,
  duration = 0.6,
  yOffset = 30,
  once = true,
  className = "",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-50px" }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1.0],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Fade In Left Animation
export const FadeInLeft = ({
  children,
  delay = 0,
  duration = 0.6,
  xOffset = -30,
  once = true,
  className = "",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: xOffset }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once, margin: "-50px" }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1.0],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Fade In Right Animation
export const FadeInRight = ({
  children,
  delay = 0,
  duration = 0.6,
  xOffset = 30,
  once = true,
  className = "",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: xOffset }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once, margin: "-50px" }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1.0],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Scale In Animation
export const ScaleIn = ({
  children,
  delay = 0,
  duration = 0.6,
  scale = 0.8,
  once = true,
  className = "",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once, margin: "-50px" }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1.0],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Stagger Container
export const StaggerContainer = ({
  children,
  staggerDelay = 0.1,
  once = true,
  className = "",
}) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-100px" }}
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Stagger Item
export const StaggerItem = ({ children, className = "" }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1.0],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Floating Animation
export const Floating = ({
  children,
  intensity = 0.02,
  duration = 3,
  className = "",
}) => {
  return (
    <motion.div
      animate={{
        y: [0, intensity * -100, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
