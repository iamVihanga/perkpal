"use client";

import React from "react";
import { Check, ChevronsUpDown, ImageIcon } from "lucide-react";
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
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";

import { useGetCategories } from "@/features/categories/queries/use-get-categories";
import { cn } from "@/lib/utils";

interface Props {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  label?: string;
  className?: string;
}

export function ParentCategoryFormSelect({
  value,
  onValueChange,
  placeholder = "Select a parent category",
  disabled = false,
  required = false,
  label = "Parent Category",
  className
}: Props) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

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
    if (onValueChange) {
      onValueChange(selectedCategoryId);
    }
    setOpen(false);
  };

  // Find the selected category to display its name
  const selectedCategory = categoriesData?.data?.find(
    (category) => category.id === value
  );

  if (error) {
    return (
      <FormItem className={className}>
        {label && (
          <FormLabel>
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </FormLabel>
        )}
        <div className="text-sm text-destructive">
          Failed to load categories
        </div>
        <FormMessage />
      </FormItem>
    );
  }

  return (
    <FormItem className={className}>
      {label && (
        <FormLabel>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </FormLabel>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className={cn(
                "w-full justify-between",
                !value && "text-muted-foreground"
              )}
              disabled={disabled || isPending}
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
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
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
                        value === category.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <FormMessage />
    </FormItem>
  );
}
