"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ProductsService } from "@/services/productsService";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    async function load() {
      const all = await ProductsService.getAll();
      const found = all.find((p) => p.id === id);
      setProduct(found);
    }
    load();
  }, [id]);

  if (!product) {
    return (
      <div className="p-10 text-center text-gray-600">Loading product...</div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* Image */}
      <div className="bg-gray-100 h-96 rounded-xl shadow-inner" />

      {/* Info */}
      <div>
        <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
        <p className="text-2xl text-blue-600 font-semibold mb-4">
          ${product.price}
        </p>

        <p className="text-gray-600 mb-6">
          This is a sample description for {product.name}. Later we will store
          real descriptions in the database.
        </p>

        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl">
          Add to Cart
        </button>
      </div>
    </div>
  );
}
