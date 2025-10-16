import { useQuery } from "@tanstack/react-query";

import { getClient } from "@/lib/rpc/client";

export const useGetSettings = () => {
  const query = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.settings.$get();

      if (!response.ok) {
        const { message } = await response.json();

        throw new Error(message);
      }

      const data = await response.json();

      return data;
    }
  });

  return query;
};
