"use client";

import { Pencil, Trash } from "lucide-react";
import { useState } from "react";
import EditProductModal from "./EditProductModal";
import DeleteProduct from "./DeleteProduct";

export default function ProductTable({ products }) {
  const [editProduct, setEditProduct] = useState(null);

  return (
    <>
      <table className="w-full bg-white shadow rounded-xl overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Price</th>
            <th className="p-3 text-left">Stock</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-b">
              <td className="p-3">{p.name}</td>
              <td className="p-3">${p.price}</td>
              <td className="p-3">{p.stock}</td>
              <td className="p-3 text-right flex gap-3 justify-end">
                {/* Edit */}
                <button
                  onClick={() => setEditProduct(p)}
                  className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600"
                >
                  <Pencil size={16} />
                </button>

                {/* Delete */}
                <DeleteProduct id={p.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editProduct && (
        <EditProductModal
          product={editProduct}
          onClose={() => setEditProduct(null)}
        />
      )}
    </>
  );
}
