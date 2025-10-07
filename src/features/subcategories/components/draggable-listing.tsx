/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { DraggableDataTable } from "@/components/table/draggable-data-table";
import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import DataTableError from "@/components/table/data-table-error";

import { useGetSubcategories } from "../queries/use-get-subcategories";
import { useReorderSubcategories } from "../queries/use-reorder-subcategories";
import { useSubcategoryTableFilters } from "./subcategories-table/use-subcategory-table-filters";
import { createColumns } from "./subcategories-table/columns";
import { SelectSubcategoryT } from "@/lib/zod/categories.zod";

export default function DraggableSubcategoryTable() {
  const { page, limit, searchQuery, setUpdateId, categoryId } =
    useSubcategoryTableFilters();

  const { data, error, isPending } = useGetSubcategories({
    limit,
    page,
    search: searchQuery,
    categoryId
  });

  const { mutate: reorderSubcategories, isPending: isReordering } =
    useReorderSubcategories();

  const handleReorder = (reorderedItems: SelectSubcategoryT[]) => {
    const reorderPayload = {
      items: reorderedItems.map((item, index) => ({
        id: item.id,
        displayOrder: index + 1
      }))
    };

    reorderSubcategories(reorderPayload);
  };

  const getItemId = (item: SelectSubcategoryT) => item.id;

  const handleUpdateClick = (subcategoryId: string) => {
    setUpdateId(subcategoryId);
  };

  const columns = createColumns(handleUpdateClick);

  if (isPending) {
    return <DataTableSkeleton columnCount={5} />;
  }

  if (!data || error) {
    return <DataTableError error={error} />;
  }

  return (
    <DraggableDataTable
      columns={columns as any}
      data={data.data as any}
      totalItems={data.meta.totalCount}
      onReorder={handleReorder}
      getItemId={getItemId}
      isReordering={isReordering}
    />
  );
}
