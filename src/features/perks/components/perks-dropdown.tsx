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

import { cn } from "@/lib/utils";
import { useGetPerks } from "../queries/use-get-perks";

interface Props {
  selected?: string | null;
  onSelect?: (perkId: string) => void;
  placeholder?: string;
  showClearButton?: boolean;
  className?: string;
}

export function PerksDropdown({
  selected,
  onSelect,
  placeholder = "Filter by perks",
  showClearButton = true,
  className
}: Props) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch perks with search functionality
  const {
    data: perksData,
    isPending,
    error
  } = useGetPerks({
    page: "1",
    limit: "20", // Get more perks for dropdown
    search: searchQuery,
    sort: "desc"
  });

  const handleOnSelect = (selectedPerkId: string) => {
    setOpen(false);

    if (onSelect) {
      onSelect(selectedPerkId);
    }
  };

  const handleClear = () => {
    if (onSelect) {
      onSelect("");
    }
  };

  // Find the selected perk to display its name
  const selectedPerk = perksData?.data?.find((perk) => perk.id === selected);

  if (error) {
    return (
      <div className="text-sm text-muted-foreground">Failed to load perks</div>
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
            className="w-[250px] justify-between overflow-hidden"
          >
            {selectedPerk ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center size-5 overflow-hidden">
                  {selectedPerk.logoImage?.publicId ? (
                    <CldImage
                      src={selectedPerk.logoImage.publicId}
                      alt={selectedPerk.title}
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
                <span className="truncate">{selectedPerk.title}</span>
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
              placeholder="Search perks..."
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList>
              <CommandEmpty>
                {isPending ? "Loading perks..." : "No perks found."}
              </CommandEmpty>
              <CommandGroup>
                {perksData?.data?.map((perk) => (
                  <CommandItem
                    key={perk.id}
                    value={perk.id}
                    onSelect={() => handleOnSelect(perk.id)}
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <div className="flex items-center justify-center size-5 overflow-hidden">
                        {perk.logoImage?.publicId ? (
                          <CldImage
                            src={perk.logoImage.publicId}
                            alt={perk.title}
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
                      <span className="truncate">{perk.title}</span>
                    </div>
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        selected === perk.id ? "opacity-100" : "opacity-0"
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
      {showClearButton && selected && (
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
    </div>
  );
}
