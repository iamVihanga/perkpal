import { useId } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getClient } from "@/lib/rpc/client";
import { type InsertLeadSchema } from "@/lib/zod/leads.zod";

export const useCreateLead = () => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (values: InsertLeadSchema) => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.leads.$post({
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
      toast.loading("Submitting lead...", {
        id: toastId
      });
    },
    onSuccess: (data) => {
      toast.success("New lead submitted successfully !", {
        id: toastId
      });

      queryClient.invalidateQueries({
        queryKey: ["leads"]
      });

      return data;
    },
    onError: (error) => {
      toast.error(error.message || "Failed to submit lead", {
        id: toastId
      });
    }
  });

  return mutation;
};
