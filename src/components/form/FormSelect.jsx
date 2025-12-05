// JOB: Reusable select dropdown
// WHY: Consistent select styling with translations
// HOW: Maps through options and translates labels

"use client";

import { useTranslation } from "react-i18next";

export default function FormSelect({
  id,
  label,
  icon: Icon,
  value,
  onChange,
  options = [],
  placeholder,
  error = "",
  required = false,
  className = "",
}) {
  const { t } = useTranslation();
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="flex items-center text-sm font-medium text-gray-700"
        >
          {Icon && <Icon className="w-4 h-4 mr-2 text-gray-500" />}
          {t(label)}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`
            w-full pl-${Icon ? "10" : "4"} pr-10 py-3
            border ${error ? "border-red-300" : "border-gray-300"}
            rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200
            transition-all duration-200 outline-none
            bg-white/50 backdrop-blur-sm appearance-none
          `}
        >
          <option value="">
            {t(placeholder) || placeholder || t("salary.select")}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {t(option.translationKey) || option.label}
            </option>
          ))}
        </select>

        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 animate-fade-in">{t(error)}</p>
      )}
    </div>
  );
}
