import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useId } from "react";
import { toast } from "sonner";

import { getClient } from "@/lib/rpc/client";
import { UpdateSubcategoryT } from "@/lib/zod/categories.zod";

export const useUpdateSubcategory = (id: string) => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (values: UpdateSubcategoryT) => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.subcategories[":id"].$put({
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
      toast.loading("Updating subcategory...", {
        id: toastId
      });
    },
    onSuccess: (data) => {
      toast.success("Subcategory updated successfully!", {
        id: toastId
      });

      queryClient.invalidateQueries({
        queryKey: ["subcategories"]
      });

      queryClient.invalidateQueries({
        queryKey: ["subcategories", { id }]
      });

      return data;
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update subcategory", {
        id: toastId
      });
    }
  });

  return mutation;
};
