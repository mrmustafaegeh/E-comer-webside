import { createSlice } from "@reduxjs/toolkit";

// Mock users database
const mockUsers = [
  {
    id: "1",
    email: "admin@example.com",
    password: "admin123",
    role: "admin",
    name: "Admin User",
  },
  {
    id: "2",
    email: "user@example.com",
    password: "user123",
    role: "user",
    name: "Regular User",
  },
];

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

// Async thunks for login/logout
export const login = (credentials) => async (dispatch) => {
  dispatch(loginStart());

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const user = mockUsers.find(
    (u) => u.email === credentials.email && u.password === credentials.password
  );

  if (user) {
    // Remove password before storing
    const { password, ...userWithoutPassword } = user;
    localStorage.setItem("auth", JSON.stringify(userWithoutPassword));
    dispatch(loginSuccess(userWithoutPassword));
  } else {
    dispatch(loginFailure("Invalid email or password"));
  }
};

export const logout = () => (dispatch) => {
  localStorage.removeItem("auth");
  dispatch(authSlice.actions.logout());
};

export const checkAuth = () => (dispatch) => {
  const authData = localStorage.getItem("auth");
  if (authData) {
    const user = JSON.parse(authData);
    dispatch(authSlice.actions.loginSuccess(user));
  }
};

export const { loginStart, loginSuccess, loginFailure, clearError } =
  authSlice.actions;
export default authSlice.reducer;
