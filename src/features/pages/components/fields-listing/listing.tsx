/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { DataTable } from "@/components/table/data-table";
import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import DataTableError from "@/components/table/data-table-error";

import { createColumns } from "./columns";
import { useGetFields } from "../../queries/use-get-fields";

interface FieldsTableProps {
  pageSlug: string;
  sectionId?: string | undefined;
}

export default function FieldsTable({ pageSlug, sectionId }: FieldsTableProps) {
  const { data, error, isPending } = useGetFields({
    pageSlug,
    sectionId
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
      data={data}
      totalItems={data.length}
      showPagination={false}
    />
  );
}
