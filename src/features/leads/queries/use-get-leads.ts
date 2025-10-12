import { useQuery } from "@tanstack/react-query";

import { getClient } from "@/lib/rpc/client";
import { LeadsQueryParamsSchema } from "@/lib/zod/leads.zod";

export const useGetLeads = (params: LeadsQueryParamsSchema) => {
  const { page = 1, limit = 10, search = "", sort = "desc", perkId } = params;

  const query = useQuery({
    queryKey: ["leads", { page, limit, search, sort, perkId }],
    queryFn: async () => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.leads.$get({
        query: {
          page: page.toString(),
          limit: limit.toString(),
          ...(search && { search }),
          sort,
          ...(perkId && { perkId })
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
