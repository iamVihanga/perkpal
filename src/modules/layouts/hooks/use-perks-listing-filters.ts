"use client";

import { useQueryState } from "nuqs";

import { searchParams } from "@/lib/searchparams";

export function usePerksListingFilters() {
  const [page, setPage] = useQueryState(
    "page",
    searchParams.page.withDefault(1)
  );

  const [limit, setLimit] = useQueryState(
    "limit",
    searchParams.limit.withDefault(10)
  );

  const [subcategoryId, setSubcategoryId] = useQueryState(
    "subcategory",
    searchParams.subcategoryId
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault("")
  );

  const [location, setLocation] = useQueryState(
    "location",
    searchParams.location
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault("global")
  );

  const [search, setSearch] = useQueryState(
    "search",
    searchParams.search
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault("")
  );

  const [sort, setSort] = useQueryState(
    "sort",
    searchParams.sort.withDefault("")
  );

  const resetFilters = () => {
    setSearch("");
    setSort("");
    setLocation("global");
  };

  const isAnyFilterActive =
    search !== "" ||
    location !== "global" ||
    subcategoryId !== "" ||
    sort !== "";

  return {
    search,
    setSearch,

    page,
    setPage,

    limit,
    setLimit,

    subcategoryId,
    setSubcategoryId,

    location,
    setLocation,

    sort,
    setSort,

    // Reset
    resetFilters,
    isAnyFilterActive
  };
}
