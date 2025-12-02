import { createSlice } from "@reduxjs/toolkit";

const formSlice = createSlice({
  name: "form",
  initialState: {
    tempForm: null,
  },
  reducers: {
    saveTempForm(state, action) {
      state.tempForm = action.payload;
    },
    clearTempForm(state) {
      state.tempForm = null;
    },
  },
});

export const { saveTempForm, clearTempForm } = formSlice.actions;
export default formSlice.reducer;
