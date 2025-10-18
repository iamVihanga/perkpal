"use client";

import { usePathname } from "next/navigation";
import React from "react";

import { usePerksListingFilters } from "../hooks/use-perks-listing-filters";
import { CategoriesNav } from "./categories-nav";
import { SubcategoriesNav } from "./subcategories-nav";
import { PerksBreadcrumb } from "../breadcrumbs/perks-breadcrumb";

interface PerksFiltersProps {
  children?: React.ReactNode;
}

export function PerksFilters({ children }: PerksFiltersProps) {
  const pathname = usePathname();
  const {} = usePerksListingFilters();

  const isRootPage = pathname === "/perks";

  const isCategoryPage = pathname?.startsWith("/perks/") ?? false;
  const categoryId = isCategoryPage ? pathname.split("/perks/")[1] : null;

  return (
    <div className="container my-5">
      {/* Category  */}
      <div className="pb-5 mb-5 space-y-4 border-b border-b-accent-green/50">
        <PerksBreadcrumb />

        {isRootPage && <CategoriesNav />}
        {isCategoryPage && categoryId && (
          <SubcategoriesNav categoryId={categoryId} />
        )}
      </div>

      {children}
    </div>
  );
}
