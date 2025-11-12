import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  slides: [
    { id: 1, image: "/images/slide1.jpg", title: "Slide 1" },
    { id: 2, image: "/images/slide2.jpg", title: "Slide 2" },
    { id: 3, image: "/images/slide3.jpg", title: "Slide 3" },
  ],
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
  },
});

export const { nextSlide, prevSlide, goToSlide } = sliderSlice.actions;
export default sliderSlice.reducer;
