import { useQuery } from "@tanstack/react-query";

import { getClient } from "@/lib/rpc/client";

export const useGetSections = (params: { pageId: string | null }) => {
  const { pageId } = params;

  const query = useQuery({
    queryKey: ["sections", { pageId }],
    queryFn: async () => {
      const rpcClient = await getClient();

      if (!pageId) return [];

      const response = await rpcClient.api.pages[":id"].sections.$get({
        param: { id: pageId }
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
