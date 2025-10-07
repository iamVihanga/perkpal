"use client";

import { DataTableSearch } from "@/components/table/data-table-search";
import { DataTableResetFilter } from "@/components/table/data-table-reset-filter";
import { useSubcategoryTableFilters } from "./use-subcategory-table-filters";

import { ParentCategoryDropdown } from "@/features/subcategories/components/parent-category-dropdown";

export function SubcategoryTableActions() {
  const {
    // Search
    searchQuery,
    setSearchQuery,

    // Pagination
    setPage,

    // Reset
    resetFilters,
    isAnyFilterActive
  } = useSubcategoryTableFilters();

  return (
    <div className="w-full flex items-center justify-between">
      <div className="flex items-center gap-4">
        <DataTableSearch
          searchKey="title"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setPage={setPage}
        />
        <DataTableResetFilter
          isFilterActive={isAnyFilterActive}
          onReset={resetFilters}
        />
      </div>
      <ParentCategoryDropdown />
    </div>
  );
}
