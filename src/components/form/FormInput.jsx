// JOB: Reusable input field with label, icon, and validation
// WHY: Consistent input styling and error handling
// HOW: Uses the t() function for translations
// WHERE: Any form that needs text input

"use client";

import { useTranslation } from "react-i18next";

export default function FormInput({
  label,
  icon: Icon,
  value,
  onChange,
  placeholder,
  type = "text",
  error = "",
  required = false,
  disabled = false,
  className = "",
  name,
}) {
  const { t } = useTranslation();
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="flex items-center text-sm font-medium text-gray-700">
          {t(label)}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Icon className="w-5 h-5" />
          </div>
        )}

        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={t(placeholder) || placeholder}
          disabled={disabled}
          required={required}
          name={name}
          className={`
            w-full ${Icon ? "pl-10" : "pl-4"} pr-4 py-3
            border ${error ? "border-red-300" : "border-gray-300"}
            rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200
            transition-all duration-200 outline-none
            bg-white/50 backdrop-blur-sm
            ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          `}
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 animate-fade-in">{t(error)}</p>
      )}
    </div>
  );
}
