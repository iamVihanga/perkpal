import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useId } from "react";

import { getClient } from "@/lib/rpc/client";
import type { UpdatePerkT } from "@/lib/zod/perks.zod";

export const useUpdatePerk = (perkId: string) => {
  const toastId = useId();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: UpdatePerkT) => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.perks[":id"].$put({
        param: {
          id: perkId
        },
        json: data
      });

      if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message);
      }

      const result = await response.json();
      return result;
    },
    onMutate: () => {
      toast.loading("Updating perk...", {
        id: toastId
      });
    },
    onSuccess: (data) => {
      toast.success("Perk updated successfully", { id: toastId });

      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["perks"] });
      queryClient.invalidateQueries({ queryKey: ["perks", { id: perkId }] });
      queryClient.invalidateQueries({
        queryKey: ["perks", { slug: data.slug }]
      });

      // Update the specific perk cache
      queryClient.setQueryData(["perks", { id: perkId }], data);
    },
    onError: (error: Error) => {
      toast.error(`Failed to update perk: ${error.message}`, { id: toastId });
    }
  });

  return mutation;
};
