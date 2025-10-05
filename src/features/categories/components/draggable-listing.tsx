"use client";

import { DraggableDataTable } from "@/components/table/draggable-data-table";
import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import DataTableError from "@/components/table/data-table-error";

import { useGetCategories } from "../queries/use-get-categories";
import { useReorderCategories } from "../queries/use-reorder-categories";
import { useCategoryTableFilters } from "./categories-table/use-category-table-filters";
import { columns } from "./categories-table/columns";
import { SelectCategoryT } from "@/lib/zod/categories.zod";

export default function DraggableCategoryTable() {
  const { page, limit, searchQuery } = useCategoryTableFilters();

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

  if (isPending) {
    return <DataTableSkeleton columnCount={5} />;
  }

  if (!data || error) {
    return <DataTableError error={error} />;
  }

  return (
    <DraggableDataTable
      columns={columns}
      data={data.data}
      totalItems={data.meta.totalCount}
      onReorder={handleReorder}
      getItemId={getItemId}
      isReordering={isReordering}
    />
  );
}
