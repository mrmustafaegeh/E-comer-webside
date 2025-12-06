"use client";

import { useEffect, useState } from "react";
import { ProductsService } from "../../services/productsService";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function load() {
      const data = await ProductsService.getAll();
      setProducts(data);
    }
    load();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">Our Products</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-white shadow rounded-xl p-5 hover:shadow-xl transition"
          >
            <div className="h-40 bg-gray-100 rounded-xl mb-4" />

            <h2 className="text-xl font-semibold">{p.name}</h2>
            <p className="text-gray-600 mt-1">${p.price}</p>

            <button
              onClick={() => router.push(`/products/${p.id}`)}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl"
            >
              View
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
