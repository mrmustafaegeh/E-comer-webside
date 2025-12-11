// src/services/adminService.js
import { get, post, put, del, handleRequest } from "./api";

export const adminService = {
  // Product Management
  listProducts: (params = {}) => get("/products", params),
  getProduct: (id) => get(`/products/${id}`),
  createProduct: (productData) => post("/products", productData),
  updateProduct: (id, productData) => put(`/products/${id}`, productData),
  deleteProduct: (id) => del(`/products/${id}`),

  // Category Management
  getCategories: () => {
    // If you have a categories endpoint
    return get("/categories");
    // OR fallback: extract from products
    // return get("/products").then(products => {
    //   const categories = [...new Set(products.map(p => p.category))];
    //   return categories;
    // });
  },

  // Order Management (if you have orders API)
  listOrders: (params = {}) => get("/orders", params),
  getOrder: (id) => get(`/orders/${id}`),
  updateOrderStatus: (id, statusData) =>
    put(`/orders/${id}/status`, statusData),

  // User Management (if you have users API)
  listUsers: (params = {}) => get("/users", params),
  getUser: (id) => get(`/users/${id}`),
  updateUser: (id, userData) => put(`/users/${id}`, userData),
  deleteUser: (id) => del(`/users/${id}`),

  // Dashboard Stats
  getDashboardStats: () => get("/admin/stats"),

  // Featured Products Management
  getFeaturedProducts: () => get("/featured"),
  updateFeaturedProduct: (id, featured) =>
    put(`/products/${id}/featured`, { featured }),

  // Bulk Operations
  bulkUpdateProducts: (ids, updateData) =>
    post("/products/bulk-update", { ids, ...updateData }),
  bulkDeleteProducts: (ids) => del("/products/bulk-delete", { data: { ids } }),

  // Image Upload (if you have upload endpoint)
  uploadImage: (formData) => {
    // For file uploads, you might need a separate config
    return post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Analytics
  getSalesAnalytics: (period = "monthly") =>
    get(`/analytics/sales?period=${period}`),
  getProductAnalytics: () => get("/analytics/products"),

  // Inventory Management
  updateStock: (id, stock) => put(`/products/${id}/stock`, { stock }),
  getLowStockProducts: (threshold = 10) =>
    get("/products/low-stock", { threshold }),
};

// Alternative version if you prefer using handleRequest wrapper:
export const adminServiceWithHandleRequest = {
  listProducts: (params = {}) => handleRequest(() => get("/products", params)),
  getProduct: (id) => handleRequest(() => get(`/products/${id}`)),
  createProduct: (productData) =>
    handleRequest(() => post("/products", productData)),
  updateProduct: (id, productData) =>
    handleRequest(() => put(`/products/${id}`, productData)),
  deleteProduct: (id) => handleRequest(() => del(`/products/${id}`)),
};

// For admin authentication (if you have separate admin auth)
export const adminAuthService = {
  login: (credentials) => post("/admin/login", credentials),
  logout: () => post("/admin/logout"),
  checkAuth: () => get("/admin/check-auth"),
  changePassword: (passwords) => post("/admin/change-password", passwords),
};

export default adminService;
