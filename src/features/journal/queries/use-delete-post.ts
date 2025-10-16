import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useId } from "react";
import { toast } from "sonner";

import { getClient } from "@/lib/rpc/client";

export const useDeletePost = (id: string) => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async () => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.journal[":id"].$delete({
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
      toast.loading("Deleting blog post...", {
        id: toastId
      });
    },
    onSuccess: (data) => {
      toast.success("Blog post deleted successfully!", {
        id: toastId
      });

      queryClient.invalidateQueries({
        queryKey: ["posts"]
      });

      return data;
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete blog post", {
        id: toastId
      });
    }
  });

  return mutation;
};
