import { useId } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getClient } from "@/lib/rpc/client";
import { type CreatePostT } from "@/lib/zod/journal.zod";

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (values: CreatePostT) => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.journal.$post({
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
      toast.loading("Creating new blog post...", {
        id: toastId
      });
    },
    onSuccess: (data) => {
      toast.success("Blog post created successfully!", {
        id: toastId
      });

      queryClient.invalidateQueries({
        queryKey: ["posts"]
      });

      return data;
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create blog post", {
        id: toastId
      });
    }
  });

  return mutation;
};
