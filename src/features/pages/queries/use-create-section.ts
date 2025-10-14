import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useId } from "react";
import { toast } from "sonner";

import { getClient } from "@/lib/rpc/client";
import { SectionsCreateT } from "@/lib/zod/pages.zod";

interface CreateSectionMutationParams {
  pageSlug: string;
  value: SectionsCreateT;
}

export const useCreateSection = () => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (values: CreateSectionMutationParams) => {
      const rpcClient = await getClient();

      const pageDataRes = await rpcClient.api.pages.$get({
        query: { slug: values.pageSlug }
      });

      if (!pageDataRes.ok) {
        const { message } = await pageDataRes.json();
        throw new Error(message);
      }

      const pageData = await pageDataRes.json();

      const response = await rpcClient.api.pages[":id"].sections.$post({
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
      toast.loading("Creating new section...", {
        id: toastId
      });
    },
    onSuccess: (data) => {
      toast.success("New section created successfully!", {
        id: toastId
      });

      queryClient.invalidateQueries({
        queryKey: ["sections"]
      });

      return data;
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create section", {
        id: toastId
      });
    }
  });

  return mutation;
};
