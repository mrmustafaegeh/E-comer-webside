import { handleRequest, get, productAPI } from "./api";

// Helper function to get API base URL for debugging
const getApiUrl = () => {
  return (
    process.env.NEXT_PUBLIC_API_URL ||
    (process.env.NODE_ENV === "production"
      ? "https://e-comer-webside-1bo2.vercel.app/api"
      : "http://localhost:3000/api")
  );
};

export const productService = {
  // Get all products
  getProducts: async (params = {}) => {
    try {
      console.log(`🛒 Fetching products from: ${getApiUrl()}/products`);
      return await get("/products", params);
    } catch (error) {
      console.error("Error fetching products:", error);
      // Return empty data structure to prevent app crashes
      return {
        products: [],
        total: 0,
        message: "Failed to load products",
        error: error.message,
      };
    }
  },

  // Get single product
  getProduct: async (id) => {
    try {
      console.log(
        `📦 Fetching product ${id} from: ${getApiUrl()}/products/${id}`
      );
      return await get(`/products/${id}`);
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      throw error;
    }
  },

  // Get categories
  getCategories: async () => {
    try {
      console.log(`📂 Fetching categories from: ${getApiUrl()}/categories`);
      // Try dedicated categories endpoint first
      try {
        const categories = await get("/categories");
        if (categories && Array.isArray(categories)) {
          return categories;
        }
      } catch (categoriesError) {
        console.log(
          "Categories endpoint not available, extracting from products..."
        );
      }

      // Fallback: extract from products
      const response = await get("/products");
      const products = response.products || response || [];

      if (Array.isArray(products)) {
        const categories = [
          ...new Set(
            products
              .map((p) => p.category)
              .filter((category) => category && typeof category === "string")
          ),
        ];
        return categories;
      }

      return [];
    } catch (error) {
      console.error("Error fetching categories:", error);
      return [];
    }
  },

  // Get products by category
  getProductsByCategory: async (category) => {
    try {
      console.log(
        `🏷️ Fetching products in category "${category}" from: ${getApiUrl()}/products`
      );
      const response = await get("/products", { category });
      const products = response.products || response || [];

      if (category && Array.isArray(products)) {
        return products.filter(
          (p) =>
            p.category && p.category.toLowerCase() === category.toLowerCase()
        );
      }

      return products;
    } catch (error) {
      console.error(`Error fetching products by category ${category}:`, error);
      return [];
    }
  },

  // Featured products
  async getFeaturedProducts() {
    try {
      console.log(
        `⭐ Fetching featured products from: ${getApiUrl()}/featured`
      );

      // Try featured endpoint first
      const featured = await get("/featured");
      if (featured && Array.isArray(featured)) {
        return featured;
      }

      // Fallback: fetch all and filter
      console.log(
        "Featured endpoint not found, filtering from all products..."
      );
      const response = await this.getProducts();
      const allProducts = response.products || response || [];

      if (!Array.isArray(allProducts)) {
        console.error("Invalid products data structure:", response);
        return [];
      }

      // Filter featured products
      const featuredProducts = allProducts
        .filter((p) => p.featured === true || p.featured === "true")
        .slice(0, 4);

      return featuredProducts;
    } catch (error) {
      console.error("Featured products error:", error);

      // Ultimate fallback: return empty array
      return [];
    }
  },

  // Search products
  searchProducts: async (query, params = {}) => {
    try {
      const allParams = { ...params, q: query };
      return await get("/products/search", allParams);
    } catch (error) {
      console.error("Search error:", error);

      // Fallback client-side search
      const response = await this.getProducts();
      const products = response.products || response || [];

      if (query && Array.isArray(products)) {
        const searchTerm = query.toLowerCase();
        return products.filter(
          (p) =>
            (p.title && p.title.toLowerCase().includes(searchTerm)) ||
            (p.description &&
              p.description.toLowerCase().includes(searchTerm)) ||
            (p.category && p.category.toLowerCase().includes(searchTerm))
        );
      }

      return products;
    }
  },
};
