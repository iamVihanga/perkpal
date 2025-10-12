"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Trash2, Edit } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { IDImageViewer } from "@/modules/media/components/viewer-by-id";
import { SelectPostT } from "@/lib/zod/journal.zod";
import { DeletePost } from "../delete";

// This type is used to define the shape of our data.
export type Post = Omit<SelectPostT, "createdAt"> & {
  createdAt: string;
  updatedAt: string | null;
};

export const createColumns = (
  onUpdateClick: (id: string) => void
): ColumnDef<Post>[] => [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      const title = row.getValue("title") as string;
      const featuredImage = row.original.featuredImage;

      return (
        <div className="flex items-center gap-3">
          {featuredImage?.id && (
            <IDImageViewer
              id={featuredImage.id}
              className="size-10"
              width={40}
              height={40}
              alt={title}
            />
          )}
          <Link
            href={`/dashboard/journal/${row.original.id}`}
            className="font-medium hover:underline cursor-pointer max-w-[200px] truncate"
          >
            {title}
          </Link>
        </div>
      );
    }
  },
  {
    accessorKey: "authorName",
    header: "Author",
    cell: ({ row }) => {
      const authorName = row.getValue("authorName") as string;
      const authorLogo = row.original.authorLogo;

      return (
        <div className="flex items-center gap-2">
          {authorLogo?.id && (
            <IDImageViewer
              id={authorLogo.id}
              className="size-6 rounded-full"
              width={24}
              height={24}
              alt={authorName || "Author"}
            />
          )}
          <span className="text-muted-foreground">
            {authorName || "Anonymous"}
          </span>
        </div>
      );
    }
  },
  {
    accessorKey: "tags",
    header: "Tags",
    cell: ({ row }) => {
      const tags = row.original.tags || [];

      if (tags.length === 0) {
        return <span className="text-muted-foreground text-sm">No tags</span>;
      }

      return (
        <div className="flex flex-wrap gap-1 max-w-[200px]">
          {tags.slice(0, 2).map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {tags.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{tags.length - 2}
            </Badge>
          )}
        </div>
      );
    }
  },
  {
    accessorKey: "shortExcerpt",
    header: "Excerpt",
    cell: ({ row }) => {
      const excerpt = row.getValue("shortExcerpt") as string;

      return (
        <div className="text-muted-foreground max-w-[300px] truncate text-sm">
          {excerpt || "No excerpt available"}
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
        <div className="text-muted-foreground text-sm">
          {date.toLocaleDateString()}
        </div>
      );
    }
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const post = row.original;

      return (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => onUpdateClick(post.id)}
              className="cursor-pointer"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Post
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DeletePost id={post.id}>
              <DropdownMenuItem
                className="cursor-pointer text-red-600 focus:text-red-600"
                onSelect={(e) => e.preventDefault()}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Post
              </DropdownMenuItem>
            </DeletePost>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }
  }
];
