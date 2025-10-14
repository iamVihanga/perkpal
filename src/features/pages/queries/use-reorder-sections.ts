import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useId } from "react";
import { toast } from "sonner";

import { getClient } from "@/lib/rpc/client";
import { ReorderItemsT } from "@/lib/helpers";

export const useReorderSections = (pageId: string) => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (values: ReorderItemsT) => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.pages[":id"].sections.reorder.$patch(
        {
          json: values,
          param: { id: pageId }
        }
      );

      if (!response.ok) {
        const { message } = await response.json();

        throw new Error(message);
      }

      const data = await response.json();
      return data;
    },
    onMutate: () => {
      toast.loading("Reordering sections...", {
        id: toastId
      });
    },
    onSuccess: (data) => {
      toast.success("Sections reordered successfully!", {
        id: toastId
      });

      queryClient.invalidateQueries({
        queryKey: ["sections", { pageId }]
      });

      return data;
    },
    onError: (error) => {
      toast.error(error.message || "Failed to reorder sections", {
        id: toastId
      });
    }
  });

  return mutation;
};
