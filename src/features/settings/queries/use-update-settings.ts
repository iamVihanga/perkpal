import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useId } from "react";
import { toast } from "sonner";

import { getClient } from "@/lib/rpc/client";
import { SiteSettingsMapInsertT } from "@/lib/zod/settings.zod";

export const useUpdateSettings = () => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (values: SiteSettingsMapInsertT) => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.settings.$post({
        json: values
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update settings");
      }

      const result = await response.json();
      return result;
    },
    onMutate: () => {
      toast.loading("Updating settings...", { id: toastId });
    },
    onSuccess: (data) => {
      toast.success("Settings updated successfully!", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["settings"] });

      return data;
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update settings", {
        id: toastId
      });
    }
  });

  return mutation;
};
