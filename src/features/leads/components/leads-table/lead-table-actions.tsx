"use client";

import { DataTableResetFilter } from "@/components/table/data-table-reset-filter";
import { useLeadTableFilters } from "./use-lead-table-filters";
import { PerksDropdown } from "@/features/perks/components/perks-dropdown";
import { ExportLeadsButton } from "../export-leads-button";

export function LeadTableActions() {
  const {
    perkId,
    setPerkId,
    sort,

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

      <ExportLeadsButton sort={sort as "asc" | "desc"} />

      <DataTableResetFilter
        isFilterActive={isAnyFilterActive}
        onReset={resetFilters}
      />
    </div>
  );
}
