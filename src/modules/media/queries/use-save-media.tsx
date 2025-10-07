import { useId } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getClient } from "@/lib/rpc/client";
import type { MediaUploadType } from "@/lib/zod/media.zod";

export const useSaveMedia = () => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (values: MediaUploadType) => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.media.$post({
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
      toast.loading("Saving image...", {
        id: toastId
      });
    },
    onSuccess: (data) => {
      toast.success("Image saved successfully!", {
        id: toastId
      });

      queryClient.invalidateQueries({
        queryKey: ["media"]
      });

      return data;
    },
    onError: (error) => {
      toast.error(error.message || "Failed to save image data", {
        id: toastId
      });
    }
  });

  return mutation;
};
