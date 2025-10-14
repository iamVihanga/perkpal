"use client";

import { ColumnDef } from "@tanstack/react-table";
import { EditIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import { SectionsSelectT } from "@/lib/zod/pages.zod";
import Link from "next/link";

// This type is used to define the shape of our data.
export type Section = Omit<SectionsSelectT, "createdAt"> & {
  createdAt: string;
  updatedAt: string | null;
};

export const createColumns = (): ColumnDef<Section>[] => [
  {
    accessorKey: "title",
    header: "Section Title",
    cell: ({ row }) => {
      return (
        <div className="w-full flex items-center justify-between">
          <span>{row.original.title}</span>

          <Button size={"sm"} variant={"ghost"} icon={<EditIcon />} asChild>
            <Link
              href={`/dashboard/site-settings/homepage/sections/${row.original.id}`}
            >
              Edit Section
            </Link>
          </Button>
        </div>
      );
    }
  }
];
