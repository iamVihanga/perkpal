/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRouter } from "next/navigation";
import { DraggableDataTable } from "@/components/table/draggable-data-table";
import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import DataTableError from "@/components/table/data-table-error";

import { useGetPerks } from "../queries/use-get-perks";
import { useReorderPerks } from "../queries/use-reorder-perks";
import { usePerksTableFilters } from "./perks-table/use-perks-table-filters";
import { createColumns } from "./perks-table/columns";
import { SelectPerkT } from "@/lib/zod/perks.zod";

export default function DraggablePerkTable() {
  const router = useRouter();
  const { page, limit, searchQuery } = usePerksTableFilters();

  const { data, error, isPending } = useGetPerks({
    limit: limit.toString(),
    page: page.toString(),
    search: searchQuery,
    sort: "desc"
  });

  const { mutate: reorderPerks, isPending: isReordering } = useReorderPerks();

  const handleReorder = (reorderedItems: SelectPerkT[]) => {
    const reorderPayload = {
      items: reorderedItems.map((item, index) => ({
        id: item.id,
        displayOrder: index + 1
      }))
    };

    reorderPerks(reorderPayload);
  };

  const getItemId = (item: SelectPerkT) => item.id;

  const handleUpdateClick = (perkId: string) => {
    router.push(`/dashboard/perks/${perkId}`);
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
