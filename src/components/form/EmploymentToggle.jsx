"use client";
import React from "react";

export default function EmploymentToggle({ checked, onChange, label }) {
  return (
    <div className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-200">
      <input
        id="isEmployee"
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
      />
      <label
        htmlFor="isEmployee"
        className="ml-3 block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
    </div>
  );
}
