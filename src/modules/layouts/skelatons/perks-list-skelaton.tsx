import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import React from "react";

type Props = {
  className?: string;
};

export function PerksListSkeleton({ className }: Props) {
  return (
    <div className={cn("grid grid-cols-4 gap-3", className)}>
      {Array.from({ length: 8 }).map((_, index) => (
        <Skeleton
          key={index}
          className="h-64 rounded-lg border border-secondary/50"
        />
      ))}
    </div>
  );
}
