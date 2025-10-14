import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useId } from "react";
import { toast } from "sonner";

import { getClient } from "@/lib/rpc/client";
import { ContentFieldsUpdateT } from "@/lib/zod/pages.zod";

interface UpdateFieldMutationParams {
  pageId: string;
  fieldId: string;
  value: ContentFieldsUpdateT["value"];
}

export const useUpdateField = () => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (values: UpdateFieldMutationParams) => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.pages[":id"].fields[":fieldId"].$put(
        {
          param: { id: values.pageId, fieldId: values.fieldId },
          json: { value: values.value }
        }
      );

      if (!response.ok) {
        const { message } = await response.json();

        throw new Error(message);
      }

      const data = await response.json();
      return data;
    },
    onMutate: () => {
      toast.loading("Updating field...", {
        id: toastId
      });
    },
    onSuccess: (data) => {
      toast.success("Field updated successfully!", {
        id: toastId
      });

      queryClient.invalidateQueries({
        queryKey: ["fields"]
      });

      return data;
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update field", {
        id: toastId
      });
    }
  });

  return mutation;
};
