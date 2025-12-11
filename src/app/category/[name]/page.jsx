// app/category/[name]/page.jsx
"use client";

import { useEffect, useState } from "react";
import { productAPI } from "@/lib/productApi";
import Link from "next/link";

export default function CategoryPage({ params }) {
  const { name } = params;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategoryProducts() {
      try {
        const data = await productAPI.getProductsByCategory(name);
        setProducts(data);
      } catch (err) {
        console.error("Error fetching category:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCategoryProducts();
  }, [name]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl font-semibold">
        Loading {name}...
      </div>
    );
  }

  return (
    <div className="px-6 md:px-16 py-10">
      {/* Page Title */}
      <h1 className="text-3xl font-bold capitalize mb-6">
        {name.replace("-", " ")}
      </h1>

      {products.length === 0 ? (
        <p className="text-gray-500">No products found in this category.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link
              href={`/products/${product.id}`}
              key={product.id}
              className="p-4 border rounded-xl shadow hover:shadow-lg transition"
            >
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-48 object-contain mb-4"
              />

              <h2 className="font-semibold text-lg mb-2 line-clamp-2">
                {product.title}
              </h2>

              <p className="text-blue-600 font-bold text-xl mb-2">
                ${product.price}
              </p>

              <p className="text-sm text-gray-500">
                ⭐ {product.rating?.rate} | {product.rating?.count} reviews
              </p>

              <button className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg">
                View Product
              </button>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
