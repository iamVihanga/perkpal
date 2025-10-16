"use client";

import { useQueryState } from "nuqs";

import { searchParams } from "@/lib/searchparams";

export function useLeadTableFilters() {
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

  const [sort, setSort] = useQueryState(
    "sort",
    searchParams.sort.withDefault("desc")
  );

  const [perkId, setPerkId] = useQueryState(
    "perk",
    searchParams.perk.withDefault("")
  );

  const resetFilters = () => {
    setSearchQuery("");
    setPerkId("");
    setSort("desc");
    setPage(1);
  };

  const isAnyFilterActive = searchQuery !== "" || perkId !== "";

  return {
    // Search
    searchQuery,
    setSearchQuery,

    // Pagination
    page,
    setPage,
    limit,
    setLimit,

    sort,
    setSort,

    // Reset
    resetFilters,
    isAnyFilterActive,

    // Update
    perkId,
    setPerkId
  };
}
