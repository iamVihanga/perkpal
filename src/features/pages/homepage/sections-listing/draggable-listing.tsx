/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { DraggableDataTable } from "@/components/table/draggable-data-table";
import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import DataTableError from "@/components/table/data-table-error";

import { createColumns } from "./columns";
import { useGetSections } from "../../queries/use-get-sections";
import { useGetPage } from "../../queries/use-get-page";
import { useReorderSections } from "../../queries/use-reorder-sections";
import { SectionsSelectT } from "@/lib/zod/pages.zod";

export default function DraggableSectionsTable() {
  const {
    data: pageData,
    error: pageError,
    isPending: isPendingPage
  } = useGetPage({ pageSlug: "/" });

  const { data, error, isPending } = useGetSections({
    pageId: pageData?.id || null
  });

  const { mutate: reorderSections, isPending: isReordering } =
    useReorderSections(pageData?.id || "");

  const handleReorder = (reorderedItems: SectionsSelectT[]) => {
    const reorderPayload = {
      items: reorderedItems.map((item, index) => ({
        id: item.id,
        displayOrder: index + 1
      }))
    };

    reorderSections(reorderPayload);
  };

  const getItemId = (item: SectionsSelectT) => item.id;

  const columns = createColumns();

  if (isPendingPage || isPending) {
    return <DataTableSkeleton columnCount={5} />;
  }

  if (!data || pageError || error) {
    return <DataTableError error={error} />;
  }

  return (
    <DraggableDataTable
      columns={columns as any}
      data={data as any}
      totalItems={data.length}
      onReorder={handleReorder}
      getItemId={getItemId}
      isReordering={isReordering}
      showPaginations={false}
    />
  );
}
