import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useId } from "react";
import { toast } from "sonner";

import { getClient } from "@/lib/rpc/client";
import { ContentFieldsCreateT } from "@/lib/zod/pages.zod";

interface CreateFieldMutationParams {
  pageSlug: string;
  value: ContentFieldsCreateT;
}

export const useCreateField = () => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (values: CreateFieldMutationParams) => {
      const rpcClient = await getClient();

      const pageDataRes = await rpcClient.api.pages.$get({
        query: { slug: values.pageSlug }
      });

      if (!pageDataRes.ok) {
        const { message } = await pageDataRes.json();
        throw new Error(message);
      }

      const pageData = await pageDataRes.json();

      const response = await rpcClient.api.pages[":id"].fields.$post({
        param: { id: pageData.id },
        json: values.value
      });

      if (!response.ok) {
        const { message } = await response.json();

        throw new Error(message);
      }

      const data = await response.json();
      return data;
    },
    onMutate: () => {
      toast.loading("Creating new field...", {
        id: toastId
      });
    },
    onSuccess: (data) => {
      toast.success("New field created successfully!", {
        id: toastId
      });

      queryClient.invalidateQueries({
        queryKey: ["fields"]
      });

      return data;
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create field", {
        id: toastId
      });
    }
  });

  return mutation;
};
