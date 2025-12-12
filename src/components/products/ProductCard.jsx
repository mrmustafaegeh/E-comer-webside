"use client";

import { useRouter } from "next/navigation";
import { useCart } from "../../hooks/useCart";
import { useWishlist } from "../../hooks/useWishlist";
import { FaHeart, FaRegHeart } from "react-icons/fa";

export default function ProductCard({ product }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { wishlistItems, toggleWishlist } = useWishlist();

  // Prevent crash if wishlistItems is undefined
  const safeWishlist = wishlistItems ?? [];

  const isWishlisted = safeWishlist.some((item) => item._id === product._id);

  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 flex flex-col">
      {/* IMAGE */}
      <div
        className="w-full h-60 bg-gray-100 rounded-lg overflow-hidden cursor-pointer"
        onClick={() => router.push(`/products/${product._id}`)}
      >
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* NAME */}
      <h3 className="mt-3 text-lg font-semibold line-clamp-2">
        {product.title}
      </h3>

      {/* CATEGORY */}
      <p className="text-sm text-gray-500">{product.category}</p>

      {/* PRICE */}
      <p className="text-xl font-bold mt-2">${product.price}</p>

      <div className="mt-auto flex items-center justify-between pt-4">
        {/* ADD TO CART */}
        <button
          onClick={() => addToCart(product)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Add to Cart
        </button>

        {/* WISHLIST BUTTON */}
        <button
          onClick={() => toggleWishlist(product)}
          className="text-red-500 text-2xl"
        >
          {isWishlisted ? <FaHeart /> : <FaRegHeart />}
        </button>
      </div>
    </div>
  );
}
