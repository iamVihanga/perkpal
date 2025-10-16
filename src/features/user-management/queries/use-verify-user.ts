import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";
import { useId } from "react";

import { getClient } from "@/lib/rpc/client";
import { VerifyUserSchema } from "../schemas/verify-user";

type RequestType = VerifyUserSchema;

export const useVerifyUser = () => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async (values: RequestType) => {
      const client = await getClient();

      const response = await client.api.users.verify.$put({
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
      toast.loading("Verifying user...", { id: toastId });
    },
    onSuccess: () => {
      toast.success("User verified successfully!", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to verify user", {
        id: toastId
      });
    }
  });

  return mutation;
};
