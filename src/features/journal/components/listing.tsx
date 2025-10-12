/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { DataTable } from "@/components/table/data-table";
import { DataTableSkeleton } from "@/components/table/data-table-skeleton";
import DataTableError from "@/components/table/data-table-error";

import { useGetPosts } from "../queries/use-get-posts";
import { useJournalTableFilters } from "./journal-table/use-journal-table-filters";
import { createColumns } from "./journal-table/columns";
import { useRouter } from "next/navigation";

export default function JournalTable() {
  const router = useRouter();
  const { page, limit, searchQuery } = useJournalTableFilters();

  const { data, error, isPending } = useGetPosts({
    limit,
    page,
    search: searchQuery
  });

  const handleUpdateClick = (postId: string) => {
    router.push(`/dashboard/journal/${postId}`);
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
