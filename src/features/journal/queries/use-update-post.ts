import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useId } from "react";
import { toast } from "sonner";

import { getClient } from "@/lib/rpc/client";
import { UpdatePostT } from "@/lib/zod/journal.zod";

export const useUpdatePost = (id: string) => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (values: UpdatePostT) => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.journal[":id"].$patch({
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
      toast.loading("Updating blog post...", {
        id: toastId
      });
    },
    onSuccess: (data) => {
      toast.success("Blog post updated successfully!", {
        id: toastId
      });

      queryClient.invalidateQueries({
        queryKey: ["posts"]
      });

      queryClient.invalidateQueries({
        queryKey: ["posts", { id }]
      });

      return data;
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update blog post", {
        id: toastId
      });
    }
  });

  return mutation;
};
