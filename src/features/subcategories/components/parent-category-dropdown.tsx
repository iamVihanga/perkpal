"use client";

import React, { useState } from "react";
import { Check, ChevronsUpDown, XIcon, ImageIcon } from "lucide-react";
import { CldImage } from "next-cloudinary";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

import { useGetCategories } from "@/features/categories/queries/use-get-categories";
import { useSubcategoryTableFilters } from "./subcategories-table/use-subcategory-table-filters";
import { cn } from "@/lib/utils";

interface Props {
  onSelect?: (categoryId: string) => void;
  placeholder?: string;
  showClearButton?: boolean;
  className?: string;
}

export function ParentCategoryDropdown({
  onSelect,
  placeholder = "Filter by parent category",
  showClearButton = true,
  className
}: Props) {
  const { categoryId, setCategoryId } = useSubcategoryTableFilters();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch categories with search functionality
  const {
    data: categoriesData,
    isPending,
    error
  } = useGetCategories({
    page: 1,
    limit: 100, // Get more categories for dropdown
    search: searchQuery
  });

  const handleOnSelect = (selectedCategoryId: string) => {
    setCategoryId(selectedCategoryId);
    setOpen(false);

    if (onSelect) {
      onSelect(selectedCategoryId);
    }
  };

  const handleClear = () => {
    setCategoryId("");
    setSearchQuery("");
    if (onSelect) {
      onSelect("");
    }
  };

  // Find the selected category to display its name
  const selectedCategory = categoriesData?.data?.find(
    (category) => category.id === categoryId
  );

  if (error) {
    return (
      <div className="text-sm text-muted-foreground">
        Failed to load categories
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[250px] justify-between"
          >
            {selectedCategory ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center size-5 overflow-hidden">
                  {selectedCategory.opengraphImage?.publicId ? (
                    <CldImage
                      src={selectedCategory.opengraphImage.publicId}
                      alt={selectedCategory.name}
                      width={20}
                      height={20}
                      className="rounded object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted rounded flex items-center justify-center">
                      <ImageIcon className="size-3 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <span className="truncate">{selectedCategory.name}</span>
              </div>
            ) : (
              placeholder
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[250px] p-0">
          <Command>
            <CommandInput
              placeholder="Search categories..."
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList>
              <CommandEmpty>
                {isPending ? "Loading categories..." : "No categories found."}
              </CommandEmpty>
              <CommandGroup>
                {categoriesData?.data?.map((category) => (
                  <CommandItem
                    key={category.id}
                    value={category.id}
                    onSelect={() => handleOnSelect(category.id)}
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <div className="flex items-center justify-center size-5 overflow-hidden">
                        {category.opengraphImage?.publicId ? (
                          <CldImage
                            src={category.opengraphImage.publicId}
                            alt={category.name}
                            width={20}
                            height={20}
                            className="rounded object-cover w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted rounded flex items-center justify-center">
                            <ImageIcon className="size-3 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <span className="truncate">{category.name}</span>
                    </div>
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        categoryId === category.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Clear Button */}
      {showClearButton && categoryId && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleClear}
          className="h-10 px-3"
        >
          <XIcon className="h-4 w-4" />
          <span className="sr-only">Clear filter</span>
        </Button>
      )}

      {/* Selected Category Badge (Alternative Display) */}
      {selectedCategory && !showClearButton && (
        <Badge variant="outline" className="gap-1">
          <div className="flex items-center gap-1">
            <div className="flex items-center justify-center size-4 overflow-hidden">
              {selectedCategory.opengraphImage?.publicId ? (
                <CldImage
                  src={selectedCategory.opengraphImage.publicId}
                  alt={selectedCategory.name}
                  width={16}
                  height={16}
                  className="rounded object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full bg-muted rounded flex items-center justify-center">
                  <ImageIcon className="size-2 text-muted-foreground" />
                </div>
              )}
            </div>
            {selectedCategory.name}
          </div>
          <button
            onClick={handleClear}
            className="ml-1 hover:bg-muted rounded-full p-0.5"
          >
            <XIcon className="h-3 w-3" />
          </button>
        </Badge>
      )}
    </div>
  );
}
