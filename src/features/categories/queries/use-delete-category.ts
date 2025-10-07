import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useId } from "react";
import { toast } from "sonner";

import { getClient } from "@/lib/rpc/client";

export const useDeleteCategory = (id: string) => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async () => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.categories[":id"].$delete({
        param: { id }
      });

      if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message);
      }

      const data = await response.json();
      return data;
    },
    onMutate: () => {
      toast.loading("Category deleting...", {
        id: toastId
      });
    },
    onSuccess: (data) => {
      toast.success("Category deleted successfully!", {
        id: toastId
      });

      queryClient.invalidateQueries({
        queryKey: ["categories"]
      });

      return data;
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete category", {
        id: toastId
      });
    }
  });

  return mutation;
};
