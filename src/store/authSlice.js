import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token:
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null,
  isLoggedIn: !!(
    typeof window !== "undefined" && localStorage.getItem("accessToken")
  ),
  error: null, // add error state
  isLoading: false, // optional, if you want loading state
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isLoggedIn = true;
      state.error = null;
      if (typeof window !== "undefined")
        localStorage.setItem("accessToken", action.payload.token);
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;
      state.error = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
      }
    },
    setError(state, action) {
      state.error = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
});

export const { setCredentials, logout, setError, clearError } =
  authSlice.actions;
export default authSlice.reducer;
