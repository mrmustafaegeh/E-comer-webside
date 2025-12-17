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
  async ({ id, payload, oldImageUrl }) => {
    const res = await adminService.updateProduct(id, payload);

    // Delete old image if it's a Vercel Blob URL and new image is different
    if (
      oldImageUrl &&
      oldImageUrl.includes("blob.vercel-storage.com") &&
      payload.image &&
      oldImageUrl !== payload.image
    ) {
      try {
        await adminService.deleteImage(oldImageUrl);
      } catch (error) {
        console.warn("Failed to delete old image:", error);
      }
    }

    return res;
  }
);

export const deleteAdminProduct = createAsyncThunk(
  "adminProducts/delete",
  async (product) => {
    await adminService.deleteProduct(product._id || product.id);

    // Delete image from Vercel Blob if it exists
    if (product.image && product.image.includes("blob.vercel-storage.com")) {
      try {
        await adminService.deleteImage(product.image);
      } catch (error) {
        console.warn("Failed to delete product image:", error);
      }
    }

    return product._id || product.id;
  }
);

const adminProductSlice = createSlice({
  name: "adminProducts",
  initialState: {
    items: [],
    loading: false,
    error: null,
    currentProduct: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentProduct: (state, action) => {
      state.currentProduct = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
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

      // Create Product
      .addCase(createAdminProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAdminProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(createAdminProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Update Product
      .addCase(updateAdminProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAdminProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.map((it) =>
          it._id === action.payload._id ? action.payload : it
        );
      })
      .addCase(updateAdminProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Delete Product
      .addCase(deleteAdminProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAdminProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((it) => it._id !== action.payload);
      })
      .addCase(deleteAdminProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearError, setCurrentProduct } = adminProductSlice.actions;
export default adminProductSlice.reducer;
