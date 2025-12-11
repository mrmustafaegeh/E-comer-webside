// lib/productApi.js
import api from "./api";

export const productAPI = {
  async getCategories() {
    const res = await api.get("/products/categories");
    return res.data;
  },

  async getProductsByCategory(category) {
    const res = await api.get(`/products/category/${category}`);
    return res.data;
  },
};
