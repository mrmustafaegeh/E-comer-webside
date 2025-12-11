// src/services/api.js
import axios from "axios";

// First instance - for external APIs if needed
export const backend = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000",
  headers: { "Content-Type": "application/json" },
});

backend.interceptors.request.use(
  (config) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Second instance - for internal Next.js API routes
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

export const handleRequest = async (request) => {
  try {
    const res = await request();
    return res.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw error.response?.data || { message: "Network error" };
  }
};

// Helper methods for internal API
export const get = async (url, params = {}) => {
  try {
    const res = await api.get(url, { params });
    return res.data;
  } catch (error) {
    console.error(`GET ${url} error:`, error.response?.data || error.message);
    throw error.response?.data || { message: "Network error" };
  }
};

export const post = async (url, data = {}) => {
  try {
    const res = await api.post(url, data);
    return res.data;
  } catch (error) {
    console.error(`POST ${url} error:`, error.response?.data || error.message);
    throw error.response?.data || { message: "Network error" };
  }
};

export const put = async (url, data = {}) => {
  try {
    const res = await api.put(url, data);
    return res.data;
  } catch (error) {
    console.error(`PUT ${url} error:`, error.response?.data || error.message);
    throw error.response?.data || { message: "Network error" };
  }
};

export const del = async (url, data = {}) => {
  try {
    const res = await api.delete(url, { data });
    return res.data;
  } catch (error) {
    console.error(
      `DELETE ${url} error:`,
      error.response?.data || error.message
    );
    throw error.response?.data || { message: "Network error" };
  }
};

// Product API methods
export const productAPI = {
  getFeaturedProducts: async () => get("/products/featured"),
  getProductById: async (id) => get(`/products/${id}`),
  getProducts: async (params) => get("/products", params),
};

export default api;
