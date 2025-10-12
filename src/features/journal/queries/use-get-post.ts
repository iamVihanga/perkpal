import { useQuery } from "@tanstack/react-query";

import { getClient } from "@/lib/rpc/client";

interface GetPostParams {
  id?: string;
  slug?: string;
  enabled?: boolean;
}

export const useGetPost = (params: GetPostParams) => {
  const { id, slug, enabled = true } = params;

  const query = useQuery({
    queryKey: ["posts", { id, slug }],
    queryFn: async () => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.journal["get-one"].$get({
        query: {
          ...(id && { id }),
          ...(slug && { slug })
        }
      });

      if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message);
      }

      const data = await response.json();
      return data;
    },
    enabled: enabled && (!!id || !!slug)
  });

  return query;
};
