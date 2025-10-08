import { useId } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getClient } from "@/lib/rpc/client";
import type { CreatePerkT } from "@/lib/zod/perks.zod";

export const useCreatePerk = () => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (values: CreatePerkT) => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.perks.$post({
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
      toast.loading("Creating new perk...", {
        id: toastId
      });
    },
    onSuccess: (data) => {
      toast.success("New perk created successfully!", {
        id: toastId
      });

      queryClient.invalidateQueries({
        queryKey: ["perks"]
      });

      return data;
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create perk", {
        id: toastId
      });
    }
  });

  return mutation;
};
