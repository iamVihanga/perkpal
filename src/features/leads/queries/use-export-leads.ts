import { useMutation } from "@tanstack/react-query";
import { useId } from "react";
import { toast } from "sonner";

import { getClient } from "@/lib/rpc/client";

interface ExportLeadsParams {
  sort?: "asc" | "desc";
}

export const useExportLeads = () => {
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (params: ExportLeadsParams = {}) => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.leads.export.$get({
        query: {
          ...(params.sort && { sort: params.sort })
        }
      });

      if (!response.ok) {
        throw new Error("Failed to export leads");
      }

      // Get the CSV content as text
      const csvContent = await response.text();

      // Create a blob and download it
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);

      // Create download link
      const link = document.createElement("a");
      link.href = url;

      // Get filename from response headers or generate one
      const contentDisposition = response.headers.get("Content-Disposition");
      const filename =
        contentDisposition?.match(/filename="(.+)"/)?.[1] ||
        `leads-export-${new Date().toISOString().split("T")[0]}.csv`;

      link.download = filename;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return { filename, recordCount: csvContent.split("\n").length - 1 };
    },
    onMutate: () => {
      toast.loading("Preparing export...", {
        id: toastId
      });
    },
    onSuccess: (data) => {
      toast.success(
        `Successfully exported ${data.recordCount} leads to ${data.filename}`,
        {
          id: toastId
        }
      );
    },
    onError: (error) => {
      toast.error(error.message || "Failed to export leads", {
        id: toastId
      });
    }
  });

  return mutation;
};
