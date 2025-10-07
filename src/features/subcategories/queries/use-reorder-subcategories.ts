import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useId } from "react";
import { toast } from "sonner";

import { getClient } from "@/lib/rpc/client";
import { ReorderItemsT } from "@/lib/helpers";

export const useReorderSubcategories = () => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (values: ReorderItemsT) => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.subcategories.reorder.$patch({
        json: values
      });

      if (!response.ok) {
        const { message } = await response.json();

        throw new Error(message);
      }

      const data = await response.json();
      return data;
    },
    onMutate: () => {
      toast.loading("Reordering categories list...", {
        id: toastId
      });
    },
    onSuccess: (data) => {
      toast.success("Categories reordered successfully!", {
        id: toastId
      });

      queryClient.invalidateQueries({
        queryKey: ["subcategories"]
      });

      return data;
    },
    onError: (error) => {
      toast.error(error.message || "Failed to reorder categories", {
        id: toastId
      });
    }
  });

  return mutation;
};
