import { useQuery } from "@tanstack/react-query";

import { getClient } from "@/lib/rpc/client";
import type { PerksQueryParamsSchema } from "@/lib/zod/perks.zod";

export const useGetPerks = (params: PerksQueryParamsSchema) => {
  const { page = 1, limit = 10, search = "", ...filters } = params;

  const query = useQuery({
    queryKey: ["perks", { page, limit, search }],
    queryFn: async () => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.perks.$get({
        query: {
          page: page.toString(),
          limit: limit.toString(),
          ...(search && { search }),
          ...filters
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
