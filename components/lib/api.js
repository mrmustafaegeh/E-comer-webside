// lib/api.js
const FAKE_STORE_API = "https://fakestoreapi.com";

export const productAPI = {
  async getProducts() {
    try {
      const response = await fetch(`${FAKE_STORE_API}/products`);
      if (!response.ok) throw new Error("Failed to fetch products");
      return await response.json();
    } catch (error) {
      console.error("Error fetching products:", error);
      return [];
    }
  },

  // Get featured products (best items)
  async getFeaturedProducts() {
    try {
      const response = await fetch(`${FAKE_STORE_API}/products`);
      if (!response.ok) throw new Error("Failed to fetch products");
      const allProducts = await response.json();

      // Filter for best items - you can customize these criteria
      return allProducts
        .filter((product) => {
          // Criteria for "best" items:
          return (
            product.rating.rate >= 4.5 || // High rating (4.5+ stars)
            product.rating.count > 200 || // Popular (200+ reviews)
            product.category === "electronics" || // Electronics are often featured
            product.price > 100 // Premium products
          );
        })
        .slice(0, 4); // Limit to 8 featured products
    } catch (error) {
      console.error("Error fetching featured products:", error);
      return [];
    }
  },

  async getProductsByCategory(category) {
    try {
      const response = await fetch(
        `${FAKE_STORE_API}/products/category/${category}`
      );
      if (!response.ok) throw new Error("Failed to fetch category products");
      return await response.json();
    } catch (error) {
      console.error("Error fetching category products:", error);
      return [];
    }
  },

  async getProduct(id) {
    try {
      const response = await fetch(`${FAKE_STORE_API}/products/${id}`);
      if (!response.ok) throw new Error("Failed to fetch product");
      return await response.json();
    } catch (error) {
      console.error("Error fetching product:", error);
      return null;
    }
  },

  async getCategories() {
    try {
      const response = await fetch(`${FAKE_STORE_API}/products/categories`);
      if (!response.ok) throw new Error("Failed to fetch categories");
      return await response.json();
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  },
};
