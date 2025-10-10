"use client";

import React from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";

type Props = {
  startDate: Date | string | null | undefined;
  endDate: Date | string | null | undefined;
  onStartDateChange: (date: Date | null | undefined) => void;
  onEndDateChange: (date: Date | null | undefined) => void;
  className?: string;
};

export function ValidityDateSelector({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  className
}: Props) {
  // Convert string dates to Date objects
  const startDateObject =
    startDate && startDate !== null
      ? typeof startDate === "string"
        ? new Date(startDate)
        : startDate
      : undefined;
  const endDateObject =
    endDate && endDate !== null
      ? typeof endDate === "string"
        ? new Date(endDate)
        : endDate
      : undefined;

  return (
    <div className={cn("flex items-center gap-4", className)}>
      {/* Start Date */}
      <div className="flex-1">
        <label className="text-sm font-medium mb-2 block">Start Date</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal shadow-none",
                !startDateObject && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {startDateObject ? (
                format(startDateObject, "PPP")
              ) : (
                <span>Pick start date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={startDateObject as Date | undefined}
              onSelect={onStartDateChange}
              disabled={(date) => {
                // Disable past dates
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return date < today;
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* End Date */}
      <div className="flex-1">
        <label className="text-sm font-medium mb-2 block">End Date</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal shadow-none",
                !endDateObject && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {endDateObject ? (
                format(endDateObject, "PPP")
              ) : (
                <span>Pick end date (optional)</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={endDateObject as Date | undefined}
              onSelect={onEndDateChange}
              disabled={(date) => {
                // Disable dates before start date
                if (startDateObject) {
                  return date < startDateObject;
                }
                // Disable past dates if no start date
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return date < today;
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
