"use client";

import { DataTableResetFilter } from "@/components/table/data-table-reset-filter";
import { useLeadTableFilters } from "./use-lead-table-filters";
import { PerksDropdown } from "@/features/perks/components/perks-dropdown";

export function LeadTableActions() {
  const {
    perkId,
    setPerkId,

    // Reset
    resetFilters,
    isAnyFilterActive
  } = useLeadTableFilters();

  return (
    <div className="flex flex-wrap items-center gap-4">
      <PerksDropdown
        selected={perkId}
        onSelect={(id) => setPerkId(id)}
        showClearButton={false}
      />

      <DataTableResetFilter
        isFilterActive={isAnyFilterActive}
        onReset={resetFilters}
      />
    </div>
  );
}
