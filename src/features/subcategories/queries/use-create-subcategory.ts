import { useId } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getClient } from "@/lib/rpc/client";
import { type CreateSubcategoryT } from "@/lib/zod/categories.zod";

export const useCreateSubcategory = () => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (values: CreateSubcategoryT) => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.subcategories.$post({
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
      toast.loading("Creating new subcategory...", {
        id: toastId
      });
    },
    onSuccess: (data) => {
      toast.success("Subcategory created successfully!", {
        id: toastId
      });

      queryClient.invalidateQueries({
        queryKey: ["subcategories"]
      });

      return data;
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create subcategory", {
        id: toastId
      });
    }
  });

  return mutation;
};
