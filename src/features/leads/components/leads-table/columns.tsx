"use client";

import { ColumnDef } from "@tanstack/react-table";
import { EyeIcon, MoreHorizontal, TrashIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import { SelectLeadSchema } from "@/lib/zod/leads.zod";

import { DeleteLead } from "../delete";
import Link from "next/link";

// This type is used to define the shape of our data.
export type Lead = Omit<SelectLeadSchema, "createdAt"> & {
  createdAt: string;
  updatedAt: string | null;
};

export const createColumns = (): ColumnDef<Lead>[] => [
  {
    accessorKey: "ip",
    header: "IP",
    cell: ({ row }) => {
      return (
        <div className="text-muted-foreground max-w-[150px] truncate">
          {row.original.ip || "-"}
        </div>
      );
    }
  },
  {
    accessorKey: "createdAt",
    header: "Submitted At",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return (
        <div className="text-muted-foreground">{date.toLocaleDateString()}</div>
      );
    }
  },
  {
    accessorKey: "data",
    header: "Response",
    cell: () => {
      return (
        <Button size="sm" icon={<EyeIcon />}>
          Inspect Lead
        </Button>
      );
    }
  },
  {
    accessorKey: "perk",
    header: "Perk",
    cell: ({ row }) => {
      if (!row.original?.perk) {
        return <span className="text-muted-foreground">-</span>;
      }

      return (
        <Link
          href={`/dashboard/perks/${row.original.perk.id}`}
          className="text-muted-foreground hover:underline cursor-pointer"
        >
          {row.original.perk?.title || "-"}
        </Link>
      );
    }
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const lead = row.original;

      return (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>

            <DeleteLead id={lead.id}>
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="text-red-600"
              >
                <TrashIcon className="size-4 mr-2" />
                Delete Lead
              </DropdownMenuItem>
            </DeleteLead>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
  }
];
