"use client";
import React from "react";
import Link from "next/link";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useGetCategories } from "@/features/categories/queries/use-get-categories";
import { cn } from "@/lib/utils";

export function CategoriesNav() {
  const {
    data: categories,
    isPending: loadingCategories,
    error: categoriesError
  } = useGetCategories({
    limit: 10,
    page: 1,
    search: ""
  });

  return (
    <div className="flex items-center gap-3">
      {loadingCategories &&
        Array(10)
          .fill("_")
          .map((undefined, index) => (
            <Skeleton className="h-12 rounded-full w-44" key={index} />
          ))}

      {categories &&
        !categoriesError &&
        categories.data.map((category) => (
          <Button
            key={category.id}
            variant="outline"
            className={cn(
              "h-12 rounded-full px-4 bg-transparent hover:bg-accent-green text-accent-green hover:text-amber-100 border border-accent-green"
            )}
            asChild
          >
            <Link href={`/perks/${category.id}`}>{category.name}</Link>
          </Button>
        ))}
    </div>
  );
}
