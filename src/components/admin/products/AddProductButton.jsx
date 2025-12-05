"use client";

import { useState } from "react";
import AddProductModal from "./AddProductModal";
import { Plus } from "lucide-react";

export default function AddProductButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl shadow transition"
      >
        <Plus size={18} />
        Add Product
      </button>

      {open && <AddProductModal onClose={() => setOpen(false)} />}
    </>
  );
}
