"use client";

import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import DataTableError from "@/components/table/data-table-error";

import { useGetCategories } from "../queries/use-get-categories";
import { useCategoryTableFilters } from "./categories-table/use-category-table-filters";
import { DraggableCategoriesTable } from "./categories-table/draggable-categories-table";
import { SelectCategoryT } from "@/lib/zod/categories.zod";

export default function EducationTable() {
  const { page, limit, searchQuery } = useCategoryTableFilters();

  const { data, error, isPending } = useGetCategories({
    limit,
    page,
    search: searchQuery
  });

  if (isPending) {
    return <DataTableSkeleton />;
  }

  if (!data || error) {
    return <DataTableError error={error} />;
  }

  return (
    <div className="space-y-4">
      <DraggableCategoriesTable data={data.data as SelectCategoryT[]} />

      {/* Simple pagination info */}
      <div className="flex items-center justify-between px-2">
        <div className="text-sm text-muted-foreground">
          Showing {data.data.length} of {data.meta.totalCount} category entries
        </div>
        <div className="text-sm text-muted-foreground">
          Page {data.meta.currentPage} of {data.meta.totalPages}
        </div>
      </div>
    </div>
  );
}
