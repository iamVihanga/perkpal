/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { DataTable } from "@/components/table/data-table";
import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import DataTableError from "@/components/table/data-table-error";

import { useGetLeads } from "../queries/use-get-leads";
import { useLeadTableFilters } from "./leads-table/use-lead-table-filters";
import { createColumns } from "./leads-table/columns";

export default function LeadTable() {
  const { page, limit, sort, perkId } = useLeadTableFilters();

  const { data, error, isPending } = useGetLeads({
    limit: limit.toString(),
    page: page.toString(),
    sort: sort as any,
    perkId: perkId || undefined
  });

  const columns = createColumns();

  if (isPending) {
    return <DataTableSkeleton />;
  }

  if (!data || error) {
    return <DataTableError error={error} />;
  }

  return (
    <DataTable
      columns={columns as any}
      data={data.data}
      totalItems={data.meta.totalCount}
    />
  );
}
