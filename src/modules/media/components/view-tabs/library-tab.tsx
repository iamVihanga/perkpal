/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from "react";
import { useListMedia } from "../../api/use-list-media";
import { Card } from "@/components/ui/card";
import {
  ImagesIcon,
  Loader2,
  SortAsc,
  SortDesc,
  XIcon,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ImageGridCard from "./image-grid-card";
import { useMediaLibraryStore } from "../../store/library-store";
import { Media } from "@/lib/zod/media.zod";

export function LibraryTab() {
  const { sort, search, page, limit, setSort, setSearch, setPage, setLimit } =
    useMediaLibraryStore();

  const { data, isLoading, error } = useListMedia({
    sort,
    search,
    page,
    limit
  });

  if (error) {
    return (
      <Card className="h-full flex-1 flex items-center justify-center p-0">
        <div className="space-y-2">
          <div className="bg-red-500/20 rounded-full p-3">
            <XIcon className="size-12 text-red-500" />
          </div>

          <div className="space-y-1">
            <h2 className="text-lg font-semibold">Failed to Fetch Images</h2>
            <p>{error.message}</p>
          </div>
        </div>
      </Card>
    );
  }

  const currentPage = parseInt(page);
  const totalPages = data?.meta?.totalPages || 0;
  const totalCount = data?.meta?.totalCount || 0;

  const handlePageChange = (newPage: number) => {
    setPage(newPage.toString());
  };

  return (
    <div className="h-full flex-1 relative flex flex-col">
      {/* Library Heading Bar */}
      <div className="flex items-center justify-between py-2 bg-secondary/60">
        <div className="">
          {isLoading ? (
            <Button
              variant={"ghost"}
              icon={<Loader2 className="text-primary animate-spin" />}
              className="text-muted-foreground"
            >{`Loading your media library...`}</Button>
          ) : data?.meta ? (
            <Button
              variant={"ghost"}
              icon={<ImagesIcon className="text-primary" />}
              className="text-muted-foreground"
            >{`${data.meta.totalCount} Total Images Found`}</Button>
          ) : (
            <></>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Search..."
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSort(sort === "asc" ? "desc" : "asc")}
          >
            {sort === "asc" ? <SortDesc /> : <SortAsc />}
          </Button>
        </div>
      </div>

      {/* Image Grid */}
      <div className="flex-1 p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="size-8 animate-spin text-primary" />
          </div>
        ) : data?.data && data.data.length > 0 ? (
          <div className="grid grid-cols-5 gap-4">
            {data.data.map((item) => (
              <ImageGridCard key={item.id} media={item as unknown as Media} />
            ))}
          </div>
        ) : (
          <Card className="h-64 flex items-center justify-center">
            <div className="text-center space-y-2">
              <ImagesIcon className="size-12 text-muted-foreground mx-auto" />
              <h3 className="text-lg font-semibold">No Images Found</h3>
              <p className="text-muted-foreground">
                Upload some images to get started
              </p>
            </div>
          </Card>
        )}
      </div>

      {/* Pagination Bar */}
      {data?.data && data.data.length > 0 && totalPages > 1 && (
        <div className="border-t bg-background p-4">
          <div className="flex items-center justify-between">
            {/* Results Info */}
            <div className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * parseInt(limit) + 1} to{" "}
              {Math.min(currentPage * parseInt(limit), totalCount)} of{" "}
              {totalCount} results
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-2">
              {/* Previous Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              {/* Next Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="gap-1"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
