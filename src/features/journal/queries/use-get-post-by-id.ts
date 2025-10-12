import { useQuery } from "@tanstack/react-query";

import { getClient } from "@/lib/rpc/client";

export const useGetPostById = (id: string, enabled: boolean = true) => {
  const query = useQuery({
    queryKey: ["posts", { id }],
    queryFn: async () => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.journal["get-one"].$get({
        query: { id }
      });

      if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message);
      }

      const data = await response.json();
      return data;
    },
    enabled: enabled && !!id
  });

  return query;
};
