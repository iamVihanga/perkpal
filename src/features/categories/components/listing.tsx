/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { DataTable } from "@/components/table/data-table";
import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import DataTableError from "@/components/table/data-table-error";

import { useGetCategories } from "../queries/use-get-categories";
import { useCategoryTableFilters } from "./categories-table/use-category-table-filters";
import { createColumns } from "./categories-table/columns";

export default function CategoryTable() {
  const { page, limit, searchQuery, setUpdateId } = useCategoryTableFilters();

  const { data, error, isPending } = useGetCategories({
    limit,
    page,
    search: searchQuery
  });

  const handleUpdateClick = (categoryId: string) => {
    setUpdateId(categoryId);
  };

  const columns = createColumns(handleUpdateClick);

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
