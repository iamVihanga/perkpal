import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { QueryParamsSchema } from "../types";

export const useListMedia = (queryParams: QueryParamsSchema) => {
  const query = useQuery({
    queryKey: ["media"],
    queryFn: async () => {
      const rpcClient = await client();

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
