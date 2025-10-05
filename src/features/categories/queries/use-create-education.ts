import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useId } from "react";
import { toast } from "sonner";

import { getClient } from "@/lib/rpc/client";
import { type InsertEducationSchemaT } from "@/lib/zod/education.zod";

export const useCreateEducation = () => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (values: InsertEducationSchemaT) => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.education.$post({
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
      toast.loading("Creating education entry...", {
        id: toastId
      });
    },
    onSuccess: (data) => {
      toast.success("Education entry created successfully!", {
        id: toastId
      });

      queryClient.invalidateQueries({
        queryKey: ["educations"]
      });

      return data;
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create education entry", {
        id: toastId
      });
    }
  });

  return mutation;
};
