"use client";

import { Trash } from "lucide-react";
import { deleteProduct } from "../../../store/productSlice";
import { useAppDispatch } from "../../../store/hooks";

export default function DeleteProduct({ id }) {
  const dispatch = useAppDispatch();

  async function handleDelete() {
    if (!confirm("Delete this product?")) return;

    await dispatch(deleteProduct(id));
  }

  return (
    <button
      onClick={handleDelete}
      className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600"
    >
      <Trash size={16} />
    </button>
  );
}
