// JOB: Display form validation errors
// WHY: Show errors in a consistent, user-friendly way
// HOW: Maps through error array and displays each

"use client";

import { AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function ErrorAlert({ errors = [] }) {
  const { t } = useTranslation();
  if (!errors || errors.length === 0) return null;

  return (
    <div className="mb-6 animate-fade-in">
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 shadow-sm">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-red-800 mb-1">
              {t("form.errors.title", { count: errors.length }) ||
                "Please fix the following errors:"}
            </h3>
            <ul className="text-sm text-red-700 space-y-1">
              {errors.map((error, index) => (
                <li key={index} className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                  {t(error) || error}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
