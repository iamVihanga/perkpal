import { useQuery } from "@tanstack/react-query";

import { getClient } from "@/lib/rpc/client";
import { GetSinglePerkQueryT } from "@/lib/zod/perks.zod";

export const useGetOnePerk = (params: GetSinglePerkQueryT) => {
  const query = useQuery({
    queryKey: ["perks", { ...params }],
    queryFn: async () => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.perks["get-one"].$get({
        query: { ...params }
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
