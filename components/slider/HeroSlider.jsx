"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import {
  selectSlides,
  selectCurrentSlide,
} from "../../app/store/sliderSelectors";
import { nextSlide, prevSlide } from "../../app/store/sliderSlice";
import { useEffect } from "react";

export default function HeroSlider() {
  const dispatch = useDispatch();
  const slides = useSelector(selectSlides);
  const currentSlide = useSelector(selectCurrentSlide);

  useEffect(() => {
    const interval = setInterval(() => dispatch(nextSlide()), 5000);
    return () => clearInterval(interval);
  }, [dispatch]);

  if (!slides.length) return null;

  const slide = slides[currentSlide];

  return (
    <div className="relative w-full h-[400px] sm:h-[600px] overflow-hidden rounded-2xl shadow-lg">
      <AnimatePresence>
        <motion.img
          key={slide.id}
          src={slide.image}
          alt={slide.title}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>

      {/* Overlay text */}
      <div className="absolute inset-0 bg-black/30 flex flex-col justify-center items-center text-center text-white">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl sm:text-5xl font-bold"
        >
          {slide.title}
        </motion.h2>
        <p className="mt-3 max-w-md text-lg">{slide.subtitle}</p>
      </div>

      {/* Controls */}
      <div className="absolute inset-0 flex justify-between items-center px-4">
        <button onClick={() => dispatch(prevSlide())}>◀</button>
        <button onClick={() => dispatch(nextSlide())}>▶</button>
      </div>
    </div>
  );
}
