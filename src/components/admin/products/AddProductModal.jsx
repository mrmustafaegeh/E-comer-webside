"use client";

import { useState } from "react";
import { useAppDispatch } from "../../../store/hooks";
import { createProduct } from "../../../store/productSlice";

export default function AddProductModal({ onClose }) {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
  });

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    await dispatch(createProduct(form));

    setLoading(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl animate-scale-in">
        <h2 className="text-xl font-bold mb-4">Add Product</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Product Name"
            className="w-full p-3 border rounded-xl"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <input
            type="number"
            placeholder="Price"
            className="w-full p-3 border rounded-xl"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />

          <input
            type="number"
            placeholder="Stock"
            className="w-full p-3 border rounded-xl"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl"
          >
            {loading ? "Adding..." : "Add Product"}
          </button>
        </form>

        <button
          onClick={onClose}
          className="w-full mt-3 py-2 text-gray-600 hover:text-black"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
