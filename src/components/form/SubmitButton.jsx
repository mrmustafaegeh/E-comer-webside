"use client";
import React from "react";
import { CheckCircle } from "lucide-react";

export default function SubmitButton({ isSubmitting, disabled }) {
  return (
    <button
      type="submit"
      disabled={disabled || isSubmitting}
      className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 transform hover:scale-105 focus:scale-95 ${
        disabled || isSubmitting
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl"
      }`}
    >
      {isSubmitting ? (
        <div className="flex items-center justify-center">
          <div
            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"
            aria-hidden="true"
          />
          <span>Processing...</span>
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <CheckCircle className="w-5 h-5 mr-2" />
          <span>Submit</span>
        </div>
      )}
    </button>
  );
}
