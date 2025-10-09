"use client";

import React, { useState, KeyboardEvent } from "react";
import { X, Plus } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Props = {
  keywords: string[];
  onKeywordsChange: (keywords: string[]) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  maxKeywords?: number;
};

export function Keywords({
  keywords = [],
  onKeywordsChange,
  placeholder = "Add keywords...",
  className,
  disabled = false
}: Props) {
  const [inputValue, setInputValue] = useState("");

  const addKeyword = (keyword: string) => {
    const trimmedKeyword = keyword.trim().toLowerCase();

    // Don't add empty or duplicate keywords
    if (!trimmedKeyword || keywords.includes(trimmedKeyword)) {
      return;
    }

    // Don't exceed max keywords
    // if (keywords.length >= maxKeywords) {
    //   return;
    // }

    onKeywordsChange([...keywords, trimmedKeyword]);
    setInputValue("");
  };

  const removeKeyword = (indexToRemove: number) => {
    const updatedKeywords = keywords.filter(
      (_, index) => index !== indexToRemove
    );
    onKeywordsChange(updatedKeywords);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addKeyword(inputValue);
    } else if (e.key === "Backspace" && !inputValue && keywords.length > 0) {
      // Remove last keyword if input is empty and backspace is pressed
      removeKeyword(keywords.length - 1);
    }
  };

  const handleAddClick = () => {
    addKeyword(inputValue);
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* Keywords Display */}
      {keywords.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {keywords.map((keyword, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="text-sm py-1 px-2 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100"
            >
              {keyword}
              {!disabled && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="ml-1 h-4 w-4 p-0 hover:bg-blue-200"
                  onClick={() => removeKeyword(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </Badge>
          ))}
        </div>
      )}

      {/* Input Field */}
      <div className="flex items-center gap-2">
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 shadow-none h-10"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddClick}
          disabled={disabled || !inputValue.trim()}
          className="px-3 size-10"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Helper Text */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Press Enter or click + to add keywords</span>
      </div>
    </div>
  );
}
