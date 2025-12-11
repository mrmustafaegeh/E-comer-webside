import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { productService } from "../services/productService";

export const fetchProducts = createAsyncThunk(
  "products/fetchAll",
  async (params = {}) => {
    const data = await productService.getProducts(params);
    return (
      data || {
        products: [],
        pagination: {
          page: 1,
          totalPages: 1,
          pageSize: 12,
          totalItems: 0,
        },
      }
    );
  }
);

export const fetchFeaturedProducts = createAsyncThunk(
  "products/fetchFeatured",
  async () => {
    const data = await productService.getFeaturedProducts();
    return Array.isArray(data) ? data : [];
  }
);

const initialState = {
  products: [],
  featuredProducts: [],
  loading: false,
  featuredLoading: false,
  error: null,
  filters: {
    search: "",
    category: "",
    minPrice: 0,
    maxPrice: 10000,
    sort: "-createdAt",
  },
  pagination: {
    page: 1,
    totalPages: 1,
    pageSize: 12,
    totalItems: 0,
  },
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setFilters(state, action) {
      state.filters = action.payload;
    },
    setPage(state, action) {
      state.pagination.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products || [];
        state.pagination = action.payload.pagination || state.pagination;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchFeaturedProducts.pending, (state) => {
        state.featuredLoading = true;
      })
      .addCase(fetchFeaturedProducts.fulfilled, (state, action) => {
        state.featuredLoading = false;
        state.featuredProducts = action.payload;
      })
      .addCase(fetchFeaturedProducts.rejected, (state, action) => {
        state.featuredLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { setFilters, setPage } = productSlice.actions;
export default productSlice.reducer;
