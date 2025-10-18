"use client";

import { usePathname } from "next/navigation";
import React from "react";

import { usePerksListingFilters } from "../hooks/use-perks-listing-filters";
import { CategoriesNav } from "./categories-nav";
import { SubcategoriesNav } from "./subcategories-nav";
import { PerksBreadcrumb } from "../breadcrumbs/perks-breadcrumb";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { EraserIcon } from "lucide-react";

interface PerksFiltersProps {
  children?: React.ReactNode;
}

export function PerksFilters({ children }: PerksFiltersProps) {
  const pathname = usePathname();
  const {
    search,
    setSearch,
    location,
    setLocation,
    sort,
    setSort,
    isAnyFilterActive,
    resetFilters
  } = usePerksListingFilters();

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

      <div className="flex items-start gap-6">
        <Card className="h-full w-[320px] shadow-none bg-white/40">
          <CardHeader>
            <CardTitle className="font-palo text-accent-green">
              Perks Filters
            </CardTitle>
            <CardDescription>Filter perks by various options</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Search */}
            <div className="space-y-1">
              <Label htmlFor="search" className="text-sm">
                Search
              </Label>
              <Input
                type="text"
                id="search"
                placeholder="Search perks..."
                className="shadow-none h-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <Label className="text-sm">Location</Label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger className="w-full h-10 bg-white shadow-none">
                  <SelectValue placeholder="Filter by location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Available Locations</SelectLabel>
                    <SelectItem value="global">Global</SelectItem>
                    <SelectItem value="malaysia">Malaysia</SelectItem>
                    <SelectItem value="singapore">Singapore</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-sm">Sort By</Label>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant={"outline"}
                  className={cn(
                    "px-3 rounded-full bg-transparent hover:bg-accent-green text-accent-green hover:text-amber-100 border border-accent-green ",
                    {
                      "bg-accent-green text-white": sort === "featured"
                    }
                  )}
                  onClick={() => {
                    if (sort === "featured") {
                      setSort("");
                      return;
                    }
                    setSort("featured");
                  }}
                >
                  Featured
                </Button>
                <Button
                  size="sm"
                  variant={"outline"}
                  className={cn(
                    "px-3 rounded-full bg-transparent hover:bg-accent-green text-accent-green hover:text-amber-100 border border-accent-green ",
                    {
                      "bg-accent-green text-white": sort === "newest"
                    }
                  )}
                  onClick={() => {
                    if (sort === "newest") {
                      setSort("");
                      return;
                    }
                    setSort("newest");
                  }}
                >
                  Newest
                </Button>
                <Button
                  size="sm"
                  variant={"outline"}
                  className={cn(
                    "px-3 rounded-full bg-transparent hover:bg-accent-green text-accent-green hover:text-amber-100 border border-accent-green ",
                    {
                      "bg-accent-green text-white": sort === "ending-soon"
                    }
                  )}
                  onClick={() => {
                    if (sort === "ending-soon") {
                      setSort("");
                      return;
                    }
                    setSort("ending-soon");
                  }}
                >
                  Ending Soon
                </Button>
              </div>
            </div>
          </CardContent>

          {isAnyFilterActive && (
            <CardFooter>
              <Button
                size="lg"
                icon={<EraserIcon />}
                onClick={resetFilters}
                className="w-full rounded-lg bg-amber-300 hover:bg-amber-400 text-accent-green font-palo"
              >
                Clear All Filters
              </Button>
            </CardFooter>
          )}
        </Card>

        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
