import { useQuery } from "@tanstack/react-query";

import { getClient } from "@/lib/rpc/client";

interface FilterParams {
  page?: number;
  limit?: number;
  search?: string | null;
}

export const useGetPosts = (params: FilterParams) => {
  const { page = 1, limit = 10, search = "" } = params;

  const query = useQuery({
    queryKey: ["posts", { page, limit, search }],
    queryFn: async () => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.journal.$get({
        query: {
          page: page.toString(),
          limit: limit.toString(),
          ...(search && { search })
        }
      });

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
