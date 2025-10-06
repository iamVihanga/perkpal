import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useId } from "react";
import { toast } from "sonner";

import { getClient } from "@/lib/rpc/client";
import { type UpdateEducationSchemaT } from "@/lib/zod/education.zod";

export const useUpdateEducation = (id: string) => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (values: UpdateEducationSchemaT) => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.education[":id"].$patch({
        param: { id },
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
      toast.loading("Updating education entry...", {
        id: toastId
      });
    },
    onSuccess: (data) => {
      toast.success("Education entry updated successfully!", {
        id: toastId
      });

      queryClient.invalidateQueries({
        queryKey: ["educations"]
      });

      queryClient.invalidateQueries({
        queryKey: ["educations", { id }]
      });

      return data;
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update education entry", {
        id: toastId
      });
    }
  });

  return mutation;
};
