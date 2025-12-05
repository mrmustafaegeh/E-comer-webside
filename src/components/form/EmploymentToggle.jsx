// JOB: Toggle switch for employment status
// WHY: Better UX than checkbox for yes/no options

"use client";

import { useTranslation } from "react-i18next";

export default function EmploymentToggle({ checked, onChange, label }) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-200">
      <div className="relative inline-block w-12 mr-3 align-middle select-none">
        <input
          type="checkbox"
          id="isEmployee"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <label
          htmlFor="isEmployee"
          className={`block h-6 w-12 rounded-full cursor-pointer transition-colors duration-200 ease-in ${
            checked ? "bg-green-500" : "bg-gray-300"
          }`}
        >
          <span
            className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ease-in ${
              checked ? "transform translate-x-6" : ""
            }`}
          />
        </label>
      </div>
      <label
        htmlFor="isEmployee"
        className="text-sm font-medium text-gray-700 cursor-pointer"
      >
        {t(label)}
      </label>
    </div>
  );
}
