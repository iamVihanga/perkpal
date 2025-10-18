"use client";
import React from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useGetSubcategories } from "@/features/subcategories/queries/use-get-subcategories";
import { cn } from "@/lib/utils";
import { usePerksListingFilters } from "../hooks/use-perks-listing-filters";

interface Props {
  categoryId: string;
}

export function SubcategoriesNav({ categoryId }: Props) {
  const { subcategoryId, setSubcategoryId } = usePerksListingFilters();

  const {
    data: subcategories,
    isPending: loadingSubcategories,
    error: subcategoriesError
  } = useGetSubcategories({
    limit: 10,
    page: 1,
    search: "",
    categoryId
  });

  return (
    <div className="flex items-center gap-3">
      {loadingSubcategories &&
        Array(10)
          .fill("_")
          .map((undefined, index) => (
            <Skeleton className="h-12 rounded-full w-44" key={index} />
          ))}

      {subcategories &&
        subcategories.data.length > 0 &&
        !subcategoriesError &&
        subcategories.data.map((subcategory) => (
          <Button
            key={subcategory.id}
            variant="outline"
            className={cn(
              "h-12 rounded-full px-4 bg-transparent hover:bg-accent-green text-accent-green hover:text-amber-100 border border-accent-green",
              {
                "bg-accent-green text-amber-100":
                  subcategoryId === subcategory.id
              }
            )}
            onClick={() => setSubcategoryId(subcategory.id)}
          >
            {subcategory.name}
          </Button>
        ))}
    </div>
  );
}
