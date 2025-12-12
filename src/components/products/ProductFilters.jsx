import { useState } from "react";
import { Search, X, DollarSign } from "lucide-react";

export default function ProductFilters() {
  const [localFilters, setLocalFilters] = useState({
    search: "",
    category: "",
    minPrice: "",
    maxPrice: "",
  });

  const applyFilters = () => {
    console.log("Filters applied:", localFilters);
  };

  const clearFilters = () => {
    setLocalFilters({
      search: "",
      category: "",
      minPrice: "",
      maxPrice: "",
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Filters Row */}
        <div className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[250px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={localFilters.search}
                onChange={(e) =>
                  setLocalFilters({ ...localFilters, search: e.target.value })
                }
                className="w-full bg-gray-50 border border-gray-200 px-3 py-2.5 pl-10 pr-9 rounded-lg text-sm transition-colors focus:bg-white focus:border-blue-500 focus:outline-none"
              />
              {localFilters.search && (
                <button
                  onClick={() =>
                    setLocalFilters({ ...localFilters, search: "" })
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category */}
            <select
              className="bg-gray-50 border border-gray-200 px-4 py-2.5 rounded-lg text-sm transition-colors focus:bg-white focus:border-blue-500 focus:outline-none cursor-pointer min-w-[160px]"
              value={localFilters.category}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, category: e.target.value })
              }
            >
              <option value="">All Categories</option>
              <option value="electronics">Electronics</option>
              <option value="fashion">Fashion</option>
              <option value="home">Home & Garden</option>
              <option value="sports">Sports</option>
            </select>

            {/* Price Inputs */}
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                type="number"
                className="w-28 bg-gray-50 border border-gray-200 px-3 py-2.5 pl-7 rounded-lg text-sm transition-colors focus:bg-white focus:border-blue-500 focus:outline-none"
                placeholder="Min"
                value={localFilters.minPrice}
                onChange={(e) =>
                  setLocalFilters({ ...localFilters, minPrice: e.target.value })
                }
              />
            </div>

            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                type="number"
                className="w-28 bg-gray-50 border border-gray-200 px-3 py-2.5 pl-7 rounded-lg text-sm transition-colors focus:bg-white focus:border-blue-500 focus:outline-none"
                placeholder="Max"
                value={localFilters.maxPrice}
                onChange={(e) =>
                  setLocalFilters({ ...localFilters, maxPrice: e.target.value })
                }
              />
            </div>

            {/* Buttons */}
            <button
              onClick={applyFilters}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors whitespace-nowrap"
            >
              Apply
            </button>
            <button
              onClick={clearFilters}
              className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors whitespace-nowrap"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
