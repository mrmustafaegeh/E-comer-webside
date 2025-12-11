// src/services/productService.js
import { handleRequest, get } from "./api";

export const productService = {
  // Use your local API instead of fakeStore
  getProducts: (params) => get("/products", params),
  getProduct: (id) => get(`/products/${id}`),
  getCategories: async () => {
    // You might need to create a categories endpoint
    const products = await get("/products");
    const categories = [...new Set(products.map((p) => p.category))];
    return categories;
  },
  getProductsByCategory: (category) => get("/products", { category }),

  // Featured products - use your API endpoint
  async getFeaturedProducts() {
    try {
      return await get("/featured");
    } catch (error) {
      console.error("Featured products error:", error);
      // Fallback: fetch all and filter
      const all = await this.getProducts();
      if (!Array.isArray(all?.products)) return [];
      return all.products.filter((p) => p.featured === true).slice(0, 4);
    }
  },
};
