import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useId } from "react";
import { toast } from "sonner";

import { getClient } from "@/lib/rpc/client";

export const useDeleteLead = (id: string) => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async () => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.leads[":id"].$delete({
        param: { id }
      });

      if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message);
      }

      const data = await response.json();
      return data;
    },
    onMutate: () => {
      toast.loading("Lead deleting...", {
        id: toastId
      });
    },
    onSuccess: (data) => {
      toast.success("Lead deleted successfully!", {
        id: toastId
      });

      queryClient.invalidateQueries({
        queryKey: ["Leads"]
      });

      return data;
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete lead", {
        id: toastId
      });
    }
  });

  return mutation;
};
