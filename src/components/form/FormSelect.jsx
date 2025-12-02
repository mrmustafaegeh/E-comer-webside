"use client";
import React from "react";
import { DollarSign } from "lucide-react";

export default function FormSelect({
  id,
  label,
  value,
  onChange,
  options,
  placeholder,
  t,
}) {
  return (
    <div className="group">
      <label
        htmlFor={id}
        className="flex items-center text-sm font-medium text-gray-700 mb-2"
      >
        <DollarSign className="w-4 h-4 mr-2 text-gray-500" />
        {label}
      </label>

      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none bg-white/50 appearance-none"
      >
        <option value="">{placeholder || "Select"}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
