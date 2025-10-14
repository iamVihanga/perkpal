import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useId } from "react";
import { toast } from "sonner";

import { getClient } from "@/lib/rpc/client";

interface DeleteSectionMutationParams {
  pageId: string;
  id: string;
}

export const useDeleteSection = () => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (values: DeleteSectionMutationParams) => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.pages[":id"].sections[
        ":sectionId"
      ].$delete({
        param: { id: values.pageId, sectionId: values.id }
      });

      if (!response.ok) {
        const { message } = await response.json();

        throw new Error(message);
      }

      const data = await response.json();
      return data;
    },
    onMutate: () => {
      toast.loading("Deleting section...", {
        id: toastId
      });
    },
    onSuccess: (data) => {
      toast.success("Section deleted successfully!", {
        id: toastId
      });

      queryClient.invalidateQueries({
        queryKey: ["sections"]
      });

      return data;
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete section", {
        id: toastId
      });
    }
  });

  return mutation;
};
