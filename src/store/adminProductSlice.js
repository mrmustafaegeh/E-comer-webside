// src/store/slices/adminProductSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { adminService } from "../services/adminService";

export const fetchAdminProducts = createAsyncThunk(
  "adminProducts/fetchAll",
  async () => {
    const res = await adminService.listProducts();
    return res || [];
  }
);

export const createAdminProduct = createAsyncThunk(
  "adminProducts/create",
  async (payload) => {
    const res = await adminService.createProduct(payload);
    return res;
  }
);

export const updateAdminProduct = createAsyncThunk(
  "adminProducts/update",
  async ({ id, payload }) => {
    const res = await adminService.updateProduct(id, payload);
    return res;
  }
);

export const deleteAdminProduct = createAsyncThunk(
  "adminProducts/delete",
  async (id) => {
    await adminService.deleteProduct(id);
    return id;
  }
);

const adminProductSlice = createSlice({
  name: "adminProducts",
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Insert new product
      .addCase(createAdminProduct.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })

      // Update product
      .addCase(updateAdminProduct.fulfilled, (state, action) => {
        state.items = state.items.map((it) =>
          it._id === action.payload._id ? action.payload : it
        );
      })

      // Delete product
      .addCase(deleteAdminProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((it) => it._id !== action.payload);
      });
  },
});

export default adminProductSlice.reducer;
