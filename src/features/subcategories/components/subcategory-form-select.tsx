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

import { useGetSubcategories } from "@/features/subcategories/queries/use-get-subcategories";
import { cn } from "@/lib/utils";

interface Props {
  value?: string;
  onValueChange?: (value: string) => void;
  categoryId?: string | null;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  label?: string;
  className?: string;
}

export function SubcategoryFormSelect({
  value,
  onValueChange,
  categoryId,
  placeholder = "Select a subcategory",
  disabled = false,
  required = false,
  label = "Subcategory",
  className
}: Props) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  // Fetch subcategories with search functionality and category filter
  const {
    data: subcategoriesData,
    isPending,
    error
  } = useGetSubcategories({
    page: 1,
    limit: 100, // Get more subcategories for dropdown
    search: searchQuery,
    categoryId: categoryId
  });

  const handleOnSelect = (selectedSubcategoryId: string) => {
    if (onValueChange) {
      onValueChange(selectedSubcategoryId);
    }
    setOpen(false);
  };

  // Find the selected subcategory to display its name
  const selectedSubcategory = subcategoriesData?.data?.find(
    (subcategory) => subcategory.id === value
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
          Failed to load subcategories
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
              disabled={disabled || isPending || !categoryId}
            >
              {selectedSubcategory ? (
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center size-5 overflow-hidden">
                    {selectedSubcategory.opengraphImage?.publicId ? (
                      <CldImage
                        src={selectedSubcategory.opengraphImage.publicId}
                        alt={selectedSubcategory.name}
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
                  <span className="truncate">{selectedSubcategory.name}</span>
                </div>
              ) : !categoryId ? (
                "Select a category first"
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
              placeholder="Search subcategories..."
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList>
              <CommandEmpty>
                {isPending
                  ? "Loading subcategories..."
                  : !categoryId
                  ? "Select a category first"
                  : "No subcategories found."}
              </CommandEmpty>
              <CommandGroup>
                {subcategoriesData?.data?.map((subcategory) => (
                  <CommandItem
                    key={subcategory.id}
                    value={subcategory.id}
                    onSelect={() => handleOnSelect(subcategory.id)}
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <div className="flex items-center justify-center size-5 overflow-hidden">
                        {subcategory.opengraphImage?.publicId ? (
                          <CldImage
                            src={subcategory.opengraphImage.publicId}
                            alt={subcategory.name}
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
                      <span className="truncate">{subcategory.name}</span>
                    </div>
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === subcategory.id ? "opacity-100" : "opacity-0"
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
