"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Search, X } from "lucide-react";

interface PerkFiltersProps {
  categories?: Array<{ id: string; name: string; slug: string }>;
  currentFilters: {
    search: string;
    categoryId: string;
    location: string;
    status: string;
    sort: string;
  };
}

const LOCATION_OPTIONS = [
  { value: "Global", label: "Global" },
  { value: "Malaysia", label: "Malaysia" },
  { value: "Singapore", label: "Singapore" }
];

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "expired", label: "Expired" }
];

const SORT_OPTIONS = [
  { value: "desc", label: "Newest First" },
  { value: "asc", label: "Oldest First" }
];

export function WireframePerksFilters({
  categories = [],
  currentFilters
}: PerkFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchInput, setSearchInput] = React.useState(currentFilters.search);

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    // Reset to first page when filtering
    params.set("page", "1");

    router.push(`/perks?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilter("search", searchInput);
  };

  const clearAllFilters = () => {
    router.push("/perks");
    setSearchInput("");
  };

  const hasActiveFilters = Object.values(currentFilters).some(
    (value) => value && value !== "desc"
  );

  return (
    <div className="mb-8 border border-gray-300 p-4 rounded bg-white">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Filters</h2>
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllFilters}
            className="text-gray-600 hover:text-gray-800"
          >
            <X className="w-4 h-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Search */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Search</label>
          <form onSubmit={handleSearchSubmit} className="flex">
            <Input
              type="text"
              placeholder="Search perks..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="rounded-r-none"
            />
            <Button type="submit" size="sm" className="rounded-l-none px-3">
              <Search className="w-4 h-4" />
            </Button>
          </form>
        </div>

        {/* Category Filter */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Category</label>
          <Select
            value={currentFilters.categoryId || "all"}
            onValueChange={(value) =>
              updateFilter("categoryId", value === "all" ? "" : value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Location Filter */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Location</label>
          <Select
            value={currentFilters.location || "all"}
            onValueChange={(value) =>
              updateFilter("location", value === "all" ? "" : value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All Locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              {LOCATION_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Status</label>
          <Select
            value={currentFilters.status || "all"}
            onValueChange={(value) =>
              updateFilter("status", value === "all" ? "" : value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sort */}
        <div className="space-y-2">
          <label className="block text-sm font-medium">Sort</label>
          <Select
            value={currentFilters.sort}
            onValueChange={(value) => updateFilter("sort", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-600">Active filters:</span>
            {currentFilters.search && (
              <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                Search: &ldquo;{currentFilters.search}&rdquo;
                <button
                  onClick={() => updateFilter("search", "")}
                  className="ml-1 hover:bg-blue-200 rounded"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {currentFilters.categoryId && (
              <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                Category:{" "}
                {
                  categories.find((c) => c.id === currentFilters.categoryId)
                    ?.name
                }
                <button
                  onClick={() => updateFilter("categoryId", "")}
                  className="ml-1 hover:bg-green-200 rounded"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {currentFilters.location && (
              <span className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                Location:{" "}
                {
                  LOCATION_OPTIONS.find(
                    (l) => l.value === currentFilters.location
                  )?.label
                }
                <button
                  onClick={() => updateFilter("location", "")}
                  className="ml-1 hover:bg-purple-200 rounded"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {currentFilters.status && (
              <span className="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">
                Status:{" "}
                {
                  STATUS_OPTIONS.find((s) => s.value === currentFilters.status)
                    ?.label
                }
                <button
                  onClick={() => updateFilter("status", "")}
                  className="ml-1 hover:bg-orange-200 rounded"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
