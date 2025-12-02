"use client";
import React from "react";
import { CheckCircle } from "lucide-react";

export default function Model({
  onClose,
  title = "Success",
  description = "Form submitted successfully!",
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md z-10">
        <div className="flex flex-col items-center gap-3">
          <div className="bg-green-100 text-green-700 rounded-full p-3">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="text-sm text-gray-600 text-center">{description}</p>
          <button
            onClick={onClose}
            className="mt-4 px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
