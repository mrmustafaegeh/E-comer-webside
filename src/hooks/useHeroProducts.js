// hooks/useHeroProducts.js
import { useState, useEffect } from "react";

export function useHeroProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchHeroProducts() {
      try {
        setLoading(true);
        const response = await fetch("/api/hero-products");

        if (!response.ok) {
          throw new Error("Failed to fetch hero products");
        }

        const data = await response.json();

        if (data.success) {
          setProducts(data.products);
        } else {
          setProducts([]); // Fallback to empty array
        }
      } catch (err) {
        console.error("Error fetching hero products:", err);
        setError(err.message);
        setProducts([]); // Fallback to empty array
      } finally {
        setLoading(false);
      }
    }

    fetchHeroProducts();
  }, []);

  return { products, loading, error };
}
