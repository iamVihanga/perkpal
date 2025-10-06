import { useId } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getClient } from "@/lib/rpc/client";
import { type CreateCategoryT } from "@/lib/zod/categories.zod";

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (values: CreateCategoryT) => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.categories.$post({
        json: values
      })

      if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message);
      }

      const data = await response.json();
      return data;
    },
    onMutate: () => {
      toast.loading("Creating new category...", {
        id: toastId
      });
    },
    onSuccess: (data) => {
      toast.success("Category created successfully!", {
        id: toastId
      });

      queryClient.invalidateQueries({
        queryKey: ["categories"]
      });

      return data;
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create category", {
        id: toastId
      });
    }
  });

  return mutation;
};
