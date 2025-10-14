/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { DataTable } from "@/components/table/data-table";
import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import DataTableError from "@/components/table/data-table-error";

import { createColumns } from "./columns";
import { useParams } from "next/navigation";
import { useGetFields } from "../../queries/use-get-fields";

export default function FieldsTable() {
  const params = useParams<{ id: string }>();

  const { data, error, isPending } = useGetFields({
    pageSlug: "/",
    sectionId: params.id
  });

  if (!params?.id) return <></>;

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
