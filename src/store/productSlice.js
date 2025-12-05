import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ProductsService } from "../services/productsService";

export const fetchProducts = createAsyncThunk("products/fetch", async () => {
  return await ProductsService.getAll();
});

export const createProduct = createAsyncThunk(
  "products/create",
  async (product) => {
    return await ProductsService.create(product);
  }
);

export const updateProduct = createAsyncThunk(
  "products/update",
  async ({ id, data }) => {
    return await ProductsService.update(id, data);
  }
);

export const deleteProduct = createAsyncThunk("products/delete", async (id) => {
  await ProductsService.delete(id);
  return id;
});

const productSlice = createSlice({
  name: "products",
  initialState: {
    list: [],
    loading: false,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.list = state.list.map((p) =>
          p.id === action.payload.id ? action.payload : p
        );
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.list = state.list.filter((p) => p.id !== action.payload);
      });
  },
});

export default productSlice.reducer;
