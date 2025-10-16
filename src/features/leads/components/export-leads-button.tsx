"use client";

import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useExportLeads } from "../queries/use-export-leads";

interface ExportLeadsButtonProps {
  sort?: "asc" | "desc";
  variant?: "default" | "outline" | "ghost" | "destructive" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  children?: React.ReactNode;
}

export function ExportLeadsButton({
  sort = "desc",
  variant = "outline",
  size = "sm",
  className,
  children
}: ExportLeadsButtonProps) {
  const { mutate: exportLeads, isPending: isExporting } = useExportLeads();

  const handleExport = () => {
    // Export all leads regardless of filters
    exportLeads({
      sort
    });
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleExport}
      disabled={isExporting}
      className={className}
    >
      <Download className="h-4 w-4 mr-2" />
      {children || (isExporting ? "Exporting..." : "Export CSV")}
    </Button>
  );
}
