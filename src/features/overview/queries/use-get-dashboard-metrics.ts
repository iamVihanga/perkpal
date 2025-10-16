import { useQuery } from "@tanstack/react-query";

import { getClient } from "@/lib/rpc/client";
import type { OptionalAnalyticsQueryParamsT } from "@/lib/zod/analytics.zod";

export const useGetDashboardMetrics = (
  params: OptionalAnalyticsQueryParamsT = {}
) => {
  const { dateFrom, dateTo, period = "30d" } = params;

  const query = useQuery({
    queryKey: ["analytics", "dashboard", { dateFrom, dateTo, period }],
    queryFn: async () => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.analytics.dashboard.$get({
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
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    staleTime: 2 * 60 * 1000 // Consider data stale after 2 minutes
  });

  return query;
};
