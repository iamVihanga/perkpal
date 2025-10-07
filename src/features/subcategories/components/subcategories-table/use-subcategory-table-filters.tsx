"use client";

import { useQueryState } from "nuqs";

import { searchParams } from "@/lib/searchparams";

export function useSubcategoryTableFilters() {
  const [searchQuery, setSearchQuery] = useQueryState(
    "q",
    searchParams.q
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault("")
  );

  const [page, setPage] = useQueryState(
    "page",
    searchParams.page.withDefault(1)
  );

  const [limit, setLimit] = useQueryState(
    "limit",
    searchParams.limit.withDefault(10)
  );

  const [updateId, setUpdateId] = useQueryState(
    "update",
    searchParams.update.withDefault("")
  );

  const [categoryId, setCategoryId] = useQueryState(
    "category",
    searchParams.category.withDefault("")
  );

  const resetFilters = () => {
    setSearchQuery("");
    setCategoryId("");
    setPage(1);
  };

  const isAnyFilterActive = searchQuery !== "" || categoryId !== "";

  return {
    // Search
    searchQuery,
    setSearchQuery,

    // Pagination
    page,
    setPage,
    limit,
    setLimit,

    // Reset
    resetFilters,
    isAnyFilterActive,

    // Update
    updateId,
    setUpdateId,

    // Category
    categoryId,
    setCategoryId
  };
}
