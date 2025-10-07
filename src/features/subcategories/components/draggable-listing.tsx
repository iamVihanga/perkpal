/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { DraggableDataTable } from "@/components/table/draggable-data-table";
import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import DataTableError from "@/components/table/data-table-error";

import { useGetCategories } from "../queries/use-get-subcategories";
import { useReorderCategories } from "../queries/use-reorder-categories";
import { useCategoryTableFilters } from "./subcategories-table/use-subcategory-table-filters";
import { createColumns } from "./subcategories-table/columns";
import { SelectCategoryT } from "@/lib/zod/categories.zod";

export default function DraggableCategoryTable() {
  const { page, limit, searchQuery, setUpdateId } = useCategoryTableFilters();

  const { data, error, isPending } = useGetCategories({
    limit,
    page,
    search: searchQuery
  });

  const { mutate: reorderCategories, isPending: isReordering } =
    useReorderCategories();

  const handleReorder = (reorderedItems: SelectCategoryT[]) => {
    const reorderPayload = {
      items: reorderedItems.map((item, index) => ({
        id: item.id,
        displayOrder: index + 1
      }))
    };

    reorderCategories(reorderPayload);
  };

  const getItemId = (item: SelectCategoryT) => item.id;

  const handleUpdateClick = (categoryId: string) => {
    setUpdateId(categoryId);
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
