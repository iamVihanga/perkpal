"use client";

import { DataTableResetFilter } from "@/components/table/data-table-reset-filter";
import { useLeadTableFilters } from "./use-lead-table-filters";

export function LeadTableActions() {
  const {
    // Reset
    resetFilters,
    isAnyFilterActive
  } = useLeadTableFilters();

  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* Todo: add perk filter */}

      <DataTableResetFilter
        isFilterActive={isAnyFilterActive}
        onReset={resetFilters}
      />
    </div>
  );
}
