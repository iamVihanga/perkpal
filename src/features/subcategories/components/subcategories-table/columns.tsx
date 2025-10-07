"use client";

import { CldImage } from "next-cloudinary";
import { ColumnDef } from "@tanstack/react-table";
import {
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

import { SelectCategoryT } from "@/lib/zod/categories.zod";

import { DeleteCategory } from "../delete";

// This type is used to define the shape of our data.
export type Category = Omit<SelectCategoryT, "createdAt"> & {
  createdAt: string;
  updatedAt: string | null;
};

export const createColumns = (
  onUpdateClick: (id: string) => void
): ColumnDef<Category>[] => [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      const publicId = row.original.opengraphImage?.publicId;

      return (
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center size-8 overflow-hidden">
            {publicId ? (
              <CldImage
                src={publicId}
                alt={name}
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

          <div className="font-medium">{name}</div>
        </div>
      );
    }
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description = row.getValue("description") as string;

      return (
        <div className="text-muted-foreground max-w-[300px] truncate">
          {description ? (
            <div
              dangerouslySetInnerHTML={{
                __html:
                  description.replace(/<[^>]*>/g, "").substring(0, 100) + "..."
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
    accessorKey: "subcategories",
    header: "Subcategories",
    cell: ({ row }) => {
      const subcategories = row.original.subcategories || [];
      return (
        <div className="text-muted-foreground">
          {subcategories.length} Subcategor
          {subcategories.length !== 1 ? "ies" : "y"}
        </div>
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

            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault();
                onUpdateClick(category.id);
              }}
            >
              <MoreHorizontalIcon className="size-4 mr-2" />
              Update Category
            </DropdownMenuItem>

            <DeleteCategory id={category.id}>
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="text-red-600"
              >
                <TrashIcon className="size-4 mr-2" />
                Delete Category
              </DropdownMenuItem>
            </DeleteCategory>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
  }
];
