import { useMutation } from "@tanstack/react-query";
import { useId } from "react";
import { toast } from "sonner";

interface ExportLeadsParams {
  sort?: "asc" | "desc";
}

export const useExportLeads = () => {
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (
      params: ExportLeadsParams = {}
    ): Promise<{ filename: string; recordCount: number }> => {
      // Build query string
      const queryParams = new URLSearchParams();
      if (params.sort) {
        queryParams.append("sort", params.sort);
      }

      const url = `/api/leads/export${
        queryParams.toString() ? `?${queryParams.toString()}` : ""
      }`;

      const response = await fetch(url, {
        method: "GET",
        credentials: "include"
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Failed to export leads" }));
        throw new Error(errorData.message || "Failed to export leads");
      }

      // Get CSV content as blob
      const blob = await response.blob();

      // Get filename from response headers or generate one
      const contentDisposition = response.headers.get("Content-Disposition");
      const filename =
        contentDisposition?.match(/filename="(.+)"/)?.[1] ||
        `leads-export-${new Date().toISOString().split("T")[0]}.csv`;

      // Create download link
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      // Estimate record count from CSV content (approximate)
      const csvText = await blob.text();
      const recordCount = Math.max(0, csvText.split("\n").length - 1); // -1 for header row

      return { filename, recordCount };
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
