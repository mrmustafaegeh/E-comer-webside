"use client";

import Link from "next/link";
import ProductCard from "./ProductCard";
const FeaturedProducts = ({ products, addToCart }) => (
  <section className="mb-12 mt-12">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-gray-800">Featured Products</h2>
      <Link
        href="/products"
        className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
      >
        View All →
      </Link>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} addToCart={addToCart} />
      ))}
    </div>
  </section>
);

export default FeaturedProducts;
