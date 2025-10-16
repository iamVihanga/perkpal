import React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  baseUrl: string;
  searchParams: Record<string, string>;
}

export function WireframePagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  baseUrl,
  searchParams
}: PaginationProps) {
  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    return `${baseUrl}?${params.toString()}`;
  };

  const getVisiblePages = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else {
      if (totalPages > 1) {
        rangeWithDots.push(totalPages);
      }
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  const visiblePages = getVisiblePages();
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="border border-gray-300 bg-white rounded-lg p-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Items count info */}
        <div className="text-sm text-gray-600">
          Showing {startItem} to {endItem} of {totalItems} results
        </div>

        {/* Pagination controls */}
        <div className="flex items-center gap-1">
          {/* Previous button */}
          <Button
            variant={currentPage === 1 ? "ghost" : "outline"}
            size="sm"
            asChild={currentPage > 1}
            disabled={currentPage === 1}
            className="flex items-center gap-1"
          >
            {currentPage > 1 ? (
              <Link href={createPageUrl(currentPage - 1)}>
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Link>
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                Previous
              </>
            )}
          </Button>

          {/* Page numbers */}
          <div className="flex items-center gap-1">
            {visiblePages.map((page, index) => (
              <React.Fragment key={index}>
                {page === "..." ? (
                  <div className="px-2 py-1 flex items-center">
                    <MoreHorizontal className="w-4 h-4 text-gray-400" />
                  </div>
                ) : (
                  <Button
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    asChild={currentPage !== page}
                    disabled={currentPage === page}
                    className="min-w-[36px] h-8"
                  >
                    {currentPage === page ? (
                      <span>{page}</span>
                    ) : (
                      <Link href={createPageUrl(page as number)}>{page}</Link>
                    )}
                  </Button>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Next button */}
          <Button
            variant={currentPage === totalPages ? "ghost" : "outline"}
            size="sm"
            asChild={currentPage < totalPages}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1"
          >
            {currentPage < totalPages ? (
              <Link href={createPageUrl(currentPage + 1)}>
                Next
                <ChevronRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                Next
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Page info for mobile */}
      <div className="sm:hidden text-center text-xs text-gray-500 mt-3">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
}
