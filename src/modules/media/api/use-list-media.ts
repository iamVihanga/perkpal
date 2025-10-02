import { useQuery } from "@tanstack/react-query";
import { QueryParamsSchema } from "../types";

import { getClient } from "@/lib/rpc/client";

export const useListMedia = (queryParams: QueryParamsSchema) => {
  const query = useQuery({
    queryKey: ["media", { queryParams }],
    queryFn: async () => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.media.$get({
        query: queryParams
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
