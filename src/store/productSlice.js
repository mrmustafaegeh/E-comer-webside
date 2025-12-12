import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk to fetch products with filters and pagination
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`/api/products?${query}`);
    if (!res.ok) {
      throw new Error("Failed to fetch products");
    }
    return res.json();
  }
);

const initialState = {
  list: [],
  loading: false,
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
    limit: 12,
    totalPages: 1,
    total: 0,
  },
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },
    clearFilters: (state) => {
      state.filters = {
        search: "",
        category: "",
        minPrice: 0,
        maxPrice: 10000,
        sort: "-createdAt",
      };
      state.pagination.page = 1;
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
        state.list = action.payload.products || [];
        state.pagination.total = action.payload.total || 0;
        state.pagination.totalPages = Math.ceil(
          (action.payload.total || 0) / state.pagination.limit
        );
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setFilters, setPage, clearFilters } = productSlice.actions;
export default productSlice.reducer;
