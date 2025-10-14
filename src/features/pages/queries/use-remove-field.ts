import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useId } from "react";
import { toast } from "sonner";

import { getClient } from "@/lib/rpc/client";

interface RemoveFieldMutationParams {
  pageId: string;
  fieldId: string;
}

export const useRemoveField = () => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (values: RemoveFieldMutationParams) => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.pages[":id"].fields[
        ":fieldId"
      ].$delete({
        param: { id: values.pageId, fieldId: values.fieldId }
      });

      if (!response.ok) {
        const { message } = await response.json();

        throw new Error(message);
      }

      const data = await response.json();
      return data;
    },
    onMutate: () => {
      toast.loading("Deleting field...", {
        id: toastId
      });
    },
    onSuccess: (data) => {
      toast.success("Field deleted successfully!", {
        id: toastId
      });

      queryClient.invalidateQueries({
        queryKey: ["fields"]
      });

      return data;
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete field", {
        id: toastId
      });
    }
  });

  return mutation;
};
