import { useQuery } from "@tanstack/react-query";

import { getClient } from "@/lib/rpc/client";

interface RecentSubmissionsParams {
  limit?: number;
}

export const useGetRecentSubmissions = (
  params: RecentSubmissionsParams = {}
) => {
  const { limit = 10 } = params;

  const query = useQuery({
    queryKey: ["analytics", "recent-submissions", { limit }],
    queryFn: async () => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.analytics["recent-submissions"].$get(
        {
          query: {
            limit: limit.toString()
          }
        }
      );

      if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message);
      }

      const data = await response.json();
      return data;
    },
    refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes
    staleTime: 60 * 1000 // Consider data stale after 1 minute
  });

  return query;
};
