"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  setFilters,
  setPage,
  clearFilters,
} from "../../store/productSlice";
import { addToCart } from "../../store/cartSlice";
import Link from "next/link";
import { ShoppingCart, Heart, Star, Filter, Search, X } from "lucide-react";
import toast from "react-hot-toast";

export default function ProductsPage() {
  const dispatch = useDispatch();
  const {
    products,
    filters,
    pagination,
    loading: isLoading,
    error,
  } = useSelector((state) => state.products);

  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    // Load products on initial mount
    loadProducts();
  }, []);

  const loadProducts = (params = {}) => {
    const combinedParams = { ...filters, ...params };
    dispatch(fetchProducts(combinedParams));
  };

  const handleFilterChange = (key, value) => {
    setLocalFilters({ ...localFilters, [key]: value });
  };

  const applyFilters = () => {
    dispatch(setFilters(localFilters));
    dispatch(setPage(1));
    loadProducts({ ...localFilters, page: 1 });
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    const defaultFilters = {
      search: "",
      category: "",
      minPrice: 0,
      maxPrice: 10000,
      sort: "-createdAt",
    };
    setLocalFilters(defaultFilters);
    dispatch(setFilters(defaultFilters));
    dispatch(setPage(1));
    loadProducts({ ...defaultFilters, page: 1 });
  };

  const handleAddToCart = (product) => {
    dispatch(
      addToCart({
        id: product._id || product.id,
        name: product.name || product.title,
        price: product.salePrice || product.price,
        image: product.thumbnail || product.image,
        quantity: 1,
      })
    );
    toast.success("Added to cart!");
  };

  const handlePageChange = (newPage) => {
    dispatch(setPage(newPage));
    loadProducts({ page: newPage });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Shop Products</h1>
          <p className="text-gray-600 mt-2">Browse our amazing collection</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search & Filter Bar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search products..."
                value={localFilters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && applyFilters()}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>

            {/* Sort Dropdown */}
            <div className="w-full md:w-48">
              <select
                value={localFilters.sort}
                onChange={(e) => {
                  handleFilterChange("sort", e.target.value);
                  applyFilters();
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="-createdAt">Newest First</option>
                <option value="price">Price: Low to High</option>
                <option value="-price">Price: High to Low</option>
                <option value="-rating">Top Rated</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
            >
              <Filter className="w-5 h-5" />
              Filters
              {showFilters && <X className="w-4 h-4" />}
            </button>
          </div>

          {/* Expandable Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={localFilters.category}
                    onChange={(e) =>
                      handleFilterChange("category", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">All Categories</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Books">Books</option>
                    <option value="Home">Home & Garden</option>
                    <option value="Sports">Sports</option>
                  </select>
                </div>

                {/* Min Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min Price ($)
                  </label>
                  <input
                    type="number"
                    value={localFilters.minPrice}
                    onChange={(e) =>
                      handleFilterChange("minPrice", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Max Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Price ($)
                  </label>
                  <input
                    type="number"
                    value={localFilters.maxPrice}
                    onChange={(e) =>
                      handleFilterChange("maxPrice", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Filter Action Buttons */}
              <div className="mt-4 flex gap-2">
                <button
                  onClick={applyFilters}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Apply Filters
                </button>
                <button
                  onClick={handleClearFilters}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Products Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div
                  key={product._id || product.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow group"
                >
                  {/* Product Image */}
                  <Link href={`/products/${product._id || product.id}`}>
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={
                          product.thumbnail ||
                          product.image ||
                          "/images/default-product.png"
                        }
                        alt={product.name || product.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      {product.salePrice && (
                        <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs font-bold rounded">
                          SALE
                        </span>
                      )}
                      {product.stock === 0 && (
                        <span className="absolute top-2 left-2 bg-gray-800 text-white px-2 py-1 text-xs font-bold rounded">
                          OUT OF STOCK
                        </span>
                      )}
                    </div>
                  </Link>

                  {/* Product Info */}
                  <div className="p-4">
                    <Link href={`/products/${product._id || product.id}`}>
                      <h3 className="text-lg font-semibold text-gray-900 hover:text-indigo-600 line-clamp-2 mb-2">
                        {product.name || product.title}
                      </h3>
                    </Link>

                    {/* Rating */}
                    <div className="flex items-center mt-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(product.rating || 0)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 ml-2">
                        ({product.numReviews || 0})
                      </span>
                    </div>

                    {/* Price */}
                    <div className="mt-3 flex items-center justify-between">
                      <div>
                        {product.salePrice ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-bold text-indigo-600">
                              ${product.salePrice.toFixed(2)}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              ${product.price.toFixed(2)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xl font-bold text-gray-900">
                            ${product.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock === 0}
                        className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                      </button>
                      <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <Heart className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination?.totalPages > 1 && (
              <div className="mt-8 flex justify-center items-center gap-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>

                <div className="flex gap-1">
                  {[...Array(pagination.totalPages)].map((_, index) => {
                    const pageNum = index + 1;
                    // Show first page, last page, current page, and pages around current
                    if (
                      pageNum === 1 ||
                      pageNum === pagination.totalPages ||
                      (pageNum >= pagination.page - 1 &&
                        pageNum <= pagination.page + 1)
                    ) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-4 py-2 border rounded-lg transition-colors ${
                            pageNum === pagination.page
                              ? "bg-indigo-600 text-white border-indigo-600"
                              : "border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    } else if (
                      pageNum === pagination.page - 2 ||
                      pageNum === pagination.page + 2
                    ) {
                      return (
                        <span key={pageNum} className="px-2">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg mb-4">No products found</p>
            <button
              onClick={handleClearFilters}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
