import { useQuery } from "@tanstack/react-query";

import { getClient } from "@/lib/rpc/client";
import type { OptionalAnalyticsQueryParamsT } from "@/lib/zod/analytics.zod";

export const useGetPerformanceTrends = (
  params: OptionalAnalyticsQueryParamsT = {}
) => {
  const { dateFrom, dateTo, period = "30d" } = params;

  const query = useQuery({
    queryKey: ["analytics", "trends", { dateFrom, dateTo, period }],
    queryFn: async () => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.analytics.trends.$get({
        query: {
          ...(dateFrom && { dateFrom }),
          ...(dateTo && { dateTo }),
          period
        }
      });

      if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message);
      }

      const data = await response.json();
      return data;
    },
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
    staleTime: 5 * 60 * 1000 // Consider data stale after 5 minutes
  });

  return query;
};
