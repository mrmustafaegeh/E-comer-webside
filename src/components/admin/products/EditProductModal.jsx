"use client";

import { useState } from "react";
import { updateProduct } from "../../../store/productSlice";
import { useAppDispatch } from "../../../store/hooks";

export default function EditProductModal({ product, onClose }) {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: product.name,
    price: product.price,
    stock: product.stock,
  });

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    await dispatch(
      updateProduct({
        id: product.id,
        data: form,
      })
    );

    setLoading(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-xl font-bold mb-4">Edit Product</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            value={form.name}
            className="w-full p-3 border rounded-xl"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            type="number"
            value={form.price}
            className="w-full p-3 border rounded-xl"
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />

          <input
            type="number"
            value={form.stock}
            className="w-full p-3 border rounded-xl"
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl"
          >
            {loading ? "Saving..." : "Save Changes"}
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
