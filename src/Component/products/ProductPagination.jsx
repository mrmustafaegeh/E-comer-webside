"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductPagination({ page, totalPages, onPageChange }) {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (page <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(1, "...", page - 1, page, page + 1, "...", totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-4">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="w-16 h-16 flex items-center justify-center bg-black border border-white/10 text-gray-800 hover:text-white hover:border-white disabled:opacity-10 transition-all duration-700 rounded-none shadow-2xl group"
      >
        <ChevronLeft className="w-6 h-6 group-hover:scale-125 transition-transform" strokeWidth={1} />
      </button>

      {/* Page Numbers */}
      <div className="hidden sm:flex items-center gap-4">
        {getPageNumbers().map((pageNum, index) =>
          pageNum === "..." ? (
            <span
              key={`ellipsis-${index}`}
              className="w-12 h-12 flex items-center justify-center font-mono font-black text-gray-800 tracking-tighter"
            >
              ...
            </span>
          ) : (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`w-16 h-16 flex items-center justify-center font-mono font-black text-[11px] uppercase tracking-widest transition-all duration-500 rounded-none shadow-2xl italic ${
                page === pageNum
                  ? "bg-white text-black border border-white"
                  : "bg-black text-gray-800 border border-white/5 hover:border-white hover:text-white"
              }`}
            >
              {pageNum.toString().padStart(2, '0')}
            </button>
          )
        )}
      </div>

      {/* Mobile Page Indicator */}
      <div className="sm:hidden font-mono font-black text-[12px] text-white mx-8 uppercase tracking-[0.5em] italic animate-pulse">
        {page} / {totalPages}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="w-16 h-16 flex items-center justify-center bg-black border border-white/10 text-gray-800 hover:text-white hover:border-white disabled:opacity-10 transition-all duration-700 rounded-none shadow-2xl group"
      >
        <ChevronRight className="w-6 h-6 group-hover:scale-125 transition-transform" strokeWidth={1} />
      </button>
    </div>
  );
}
