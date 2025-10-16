"use client";

import { CldImage } from "next-cloudinary";
import { ColumnDef } from "@tanstack/react-table";
import {
  ChartLine,
  ImageIcon,
  MoreHorizontal,
  MoreHorizontalIcon,
  TrashIcon
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

import { SelectPerkT } from "@/lib/zod/perks.zod";

import { DeletePerk } from "../delete";
import Link from "next/link";

// This type is used to define the shape of our data.
export type Perk = Omit<SelectPerkT, "createdAt"> & {
  createdAt: string;
  updatedAt: string | null;
};

export const createColumns = (
  onUpdateClick: (id: string) => void
): ColumnDef<Perk>[] => [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      const title = row.getValue("title") as string;
      const logoId = row.original.logoImage?.publicId;

      return (
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center size-8 overflow-hidden">
            {logoId ? (
              <CldImage
                src={logoId}
                alt={title}
                width={100}
                height={100}
                className="rounded-md object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full bg-muted rounded-md flex items-center justify-center text-xs text-muted-foreground">
                <ImageIcon className="size-4" />
              </div>
            )}
          </div>

          <div className="font-medium">{title}</div>
        </div>
      );
    }
  },
  {
    accessorKey: "shortDescription",
    header: "Description",
    cell: ({ row }) => {
      const description = row.getValue("shortDescription") as string;

      return (
        <div className="text-muted-foreground max-w-[250px] truncate">
          {description ? (
            <div
              dangerouslySetInnerHTML={{
                __html:
                  description.replace(/<[^>]*>/g, "").substring(0, 60) + "..."
              }}
            />
          ) : (
            "No description"
          )}
        </div>
      );
    }
  },
  {
    accessorKey: "vendorName",
    header: "Vendor"
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const category = row.original.category;

      if (!category) {
        return <div className="text-muted-foreground">No category</div>;
      }

      return (
        <Link
          href={`/dashboard/categories?update=${category.id}`}
          className="text-muted-foreground hover:underline cursor-pointer"
        >
          {category.name}
        </Link>
      );
    }
  },
  {
    accessorKey: "subcategory",
    header: "Sub Category",
    cell: ({ row }) => {
      const subcategory = row.original.subcategory;

      if (!subcategory) {
        return <div className="text-muted-foreground">No subcategory</div>;
      }

      return (
        <Link
          href={`/dashboard/subcategories?update=${subcategory.id}`}
          className="text-muted-foreground hover:underline cursor-pointer"
        >
          {subcategory.name}
        </Link>
      );
    }
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return (
        <div className="text-muted-foreground">{date.toLocaleDateString()}</div>
      );
    }
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const category = row.original;

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

            <DropdownMenuItem asChild>
              <Link href={`/dashboard/leads?perk=${row.original.id}`}>
                <ChartLine className="size-4 mr-2" />
                View Leads
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                onUpdateClick(category.id);
              }}
            >
              <MoreHorizontalIcon className="size-4 mr-2" />
              Update Perk
            </DropdownMenuItem>

            <DeletePerk id={category.id}>
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="text-red-600"
              >
                <TrashIcon className="size-4 mr-2" />
                Delete Perk
              </DropdownMenuItem>
            </DeletePerk>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
  }
];
