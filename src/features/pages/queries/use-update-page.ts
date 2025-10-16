import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useId } from "react";
import { toast } from "sonner";

import { getClient } from "@/lib/rpc/client";
import { PagesUpdateT } from "@/lib/zod/pages.zod";

interface UpdatePageMutationParams {
  pageSlug: string;
  value: PagesUpdateT;
}

export const useUpdatePage = () => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (values: UpdatePageMutationParams) => {
      const rpcClient = await getClient();

      const pageDataRes = await rpcClient.api.pages.$get({
        query: { slug: values.pageSlug }
      });

      if (!pageDataRes.ok) {
        const { message } = await pageDataRes.json();
        throw new Error(message);
      }

      const pageData = await pageDataRes.json();

      const response = await rpcClient.api.pages[":id"].$put({
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
      toast.loading("Updating page...", {
        id: toastId
      });
    },
    onSuccess: (data) => {
      toast.success("Page updated successfully!", {
        id: toastId
      });

      queryClient.invalidateQueries({
        queryKey: ["pages"]
      });

      return data;
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update page", {
        id: toastId
      });
    }
  });

  return mutation;
};
