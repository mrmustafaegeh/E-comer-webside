// store/sliderSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  slides: [],
  currentSlide: 0,
};

const sliderSlice = createSlice({
  name: "slider",
  initialState,
  reducers: {
    nextSlide: (state) => {
      state.currentSlide = (state.currentSlide + 1) % state.slides.length;
    },
    prevSlide: (state) => {
      state.currentSlide =
        (state.currentSlide - 1 + state.slides.length) % state.slides.length;
    },
    goToSlide: (state, action) => {
      state.currentSlide = action.payload;
    },
    setSlides: (state, action) => {
      state.slides = action.payload;
      state.currentSlide = 0;
    },
  },
});

export const { nextSlide, prevSlide, goToSlide, setSlides } =
  sliderSlice.actions;
export default sliderSlice.reducer;
