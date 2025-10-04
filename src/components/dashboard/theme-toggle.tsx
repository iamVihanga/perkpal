"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ThemeToggle({
  children,
  className
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  const { theme, setTheme } = useTheme();

  const handleToggle = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  return (
    <div onClick={handleToggle}>
      {children ? (
        children
      ) : (
        <Button
          className={cn("", className)}
          icon={theme === "light" ? <Moon /> : <Sun />}
          variant="ghost"
        >
          {theme === "light" ? "Switch Dark" : "Switch Light"}
        </Button>
      )}
    </div>
  );
}
