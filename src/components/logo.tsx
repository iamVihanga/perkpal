import { cn } from "@/lib/utils";
import React from "react";

type Props = {
  className?: string;
  children?: React.ReactNode;
};

export function Logo({ className, children }: Props) {
  return (
    <h1
      className={cn(
        "font-signature text-3xl text-primary-foreground whitespace-nowrap",
        className
      )}
    >
      {children ? children : "PerkPal"}
    </h1>
  );
}
