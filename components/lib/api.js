// lib/api.js
const FAKE_STORE_API = "https://fakestoreapi.com";

export const productAPI = {
  async getProducts() {
    try {
      const response = await fetch("https://fakestoreapi.com/products");
      return await response.json();
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  },

  async getProductsByCategory(category) {
    try {
      const response = await fetch(
        `https://fakestoreapi.com/products/category/${category}`
      );
      return await response.json();
    } catch (error) {
      console.error("Error fetching category products:", error);
      return [];
    }
  },

  async getProduct(id) {
    try {
      const response = await fetch(`https://fakestoreapi.com/products/${id}`);
      return await response.json();
    } catch (error) {
      console.error("Error fetching product:", error);
      return null;
    }
  },

  async getCategories() {
    try {
      const response = await fetch(
        "https://fakestoreapi.com/products/categories"
      );
      return await response.json();
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  },
};
