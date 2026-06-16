"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/primitives";

export default function ProductPagination({ page, totalPages, onPageChange }) {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (page <= 3) {
      pages.push(1, 2, 3, 4, "...", totalPages);
    } else if (page >= totalPages - 2) {
      pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, "...", page - 1, page, page + 1, "...", totalPages);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="secondary"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
      >
        <ChevronLeft size={18} />
      </Button>

      <div className="hidden items-center gap-1 sm:flex">
        {getPageNumbers().map((pageNum, index) =>
          pageNum === "..." ? (
            <span key={`ellipsis-${index}`} className="px-2 text-[var(--text-muted)]">
              …
            </span>
          ) : (
            <Button
              key={pageNum}
              variant={page === pageNum ? "primary" : "secondary"}
              onClick={() => onPageChange(pageNum)}
              className="min-w-[40px] px-3"
            >
              {pageNum}
            </Button>
          )
        )}
      </div>

      <span className="px-2 text-sm text-[var(--text-muted)] sm:hidden">
        {page} / {totalPages}
      </span>

      <Button
        variant="secondary"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        aria-label="Next page"
      >
        <ChevronRight size={18} />
      </Button>
    </div>
  );
}
