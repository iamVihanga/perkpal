import { useQuery } from "@tanstack/react-query";

import { getClient } from "@/lib/rpc/client";

export const useGetPostBySlug = (slug: string, enabled: boolean = true) => {
  const query = useQuery({
    queryKey: ["posts", { slug }],
    queryFn: async () => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.journal["get-one"].$get({
        query: { slug }
      });

      if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message);
      }

      const data = await response.json();
      return data;
    },
    enabled: enabled && !!slug
  });

  return query;
};
