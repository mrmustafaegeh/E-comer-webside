"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api"; // axios instance
import { useCart } from "@/hooks/useCart";
import Link from "next/link";

export default function ProductDetailsPage({ params }) {
  const { id } = params;

  const { addToCart, increaseQuantity, decreaseQuantity, getCartItem } =
    useCart();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);

  const cartItem = getCartItem(product?.id);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);

        // Fetch related products
        const relatedRes = await api.get(
          `/products/category/${res.data.category}`
        );
        setRelated(relatedRes.data.filter((p) => p.id !== res.data.id));
      } catch (error) {
        console.error("Error loading product:", error);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return (
      <div className="p-10 text-center text-gray-500 text-xl">
        Loading product...
      </div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto p-6">
      {/* MAIN LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* LEFT IMAGE */}
        <div className="flex justify-center">
          <img
            src={product.image}
            alt={product.title}
            className="w-full max-w-md rounded-xl shadow-lg"
          />
        </div>

        {/* RIGHT INFO */}
        <div>
          <h1 className="text-3xl font-semibold mb-3">{product.title}</h1>

          <p className="text-gray-500 text-sm mb-3">
            Category: {product.category}
          </p>

          <p className="text-yellow-500 font-medium mb-2">
            ⭐ {product.rating?.rate} ({product.rating?.count} reviews)
          </p>

          <p className="text-2xl font-bold text-blue-600 mb-4">
            ${product.price}
          </p>

          <p className="text-gray-700 mb-6">{product.description}</p>

          {/* CART CONTROLS */}
          <div className="flex items-center gap-4">
            {cartItem ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => decreaseQuantity(product.id)}
                  className="px-3 py-2 rounded-lg border bg-gray-100"
                >
                  −
                </button>

                <span className="text-lg font-semibold w-6 text-center">
                  {cartItem.qty}
                </span>

                <button
                  onClick={() => increaseQuantity(product.id)}
                  className="px-3 py-2 rounded-lg border bg-gray-100"
                >
                  +
                </button>
              </div>
            ) : (
              <button
                onClick={() => addToCart(product)}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
              >
                Add to Cart
              </button>
            )}
          </div>
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      <section className="mt-20">
        <h2 className="text-2xl font-semibold mb-6">Related Products</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {related.slice(0, 4).map((item) => (
            <Link href={`/products/${item.id}`} key={item.id}>
              <div className="border p-4 rounded-xl hover:shadow-md transition">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-40 object-contain mb-3"
                />
                <p className="font-medium text-sm mb-1">{item.title}</p>
                <p className="text-blue-600 font-bold">${item.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
