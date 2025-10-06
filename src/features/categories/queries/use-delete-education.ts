import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useId } from "react";
import { toast } from "sonner";

import { getClient } from "@/lib/rpc/client";

export const useDeleteEducation = (id: string) => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async () => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.education[":id"].$delete({
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
      toast.loading("Deleting education entry...", {
        id: toastId
      });
    },
    onSuccess: (data) => {
      toast.success("Education entry deleted successfully!", {
        id: toastId
      });

      queryClient.invalidateQueries({
        queryKey: ["educations"]
      });

      return data;
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete education entry", {
        id: toastId
      });
    }
  });

  return mutation;
};
