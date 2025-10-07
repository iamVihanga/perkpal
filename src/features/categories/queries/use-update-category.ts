import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useId } from "react";
import { toast } from "sonner";

import { getClient } from "@/lib/rpc/client";
import { UpdateCategoryT } from "@/lib/zod/categories.zod";

export const useUpdateCategory = (id: string) => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (values: UpdateCategoryT) => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.categories[":id"].$put({
        param: { id },
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
      toast.loading("Updating category...", {
        id: toastId
      });
    },
    onSuccess: (data) => {
      toast.success("Category updated successfully!", {
        id: toastId
      });

      queryClient.invalidateQueries({
        queryKey: ["categories"]
      });

      queryClient.invalidateQueries({
        queryKey: ["categories", { id }]
      });

      return data;
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update category", {
        id: toastId
      });
    }
  });

  return mutation;
};
