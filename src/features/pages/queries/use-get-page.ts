import { useQuery } from "@tanstack/react-query";

import { getClient } from "@/lib/rpc/client";

export const useGetPage = (params: { pageSlug: string }) => {
  const { pageSlug } = params;

  const query = useQuery({
    queryKey: ["pages", { pageSlug }],
    queryFn: async () => {
      const rpcClient = await getClient();

      const pageDataRes = await rpcClient.api.pages.$get({
        query: { slug: pageSlug }
      });

      if (!pageDataRes.ok) {
        const { message } = await pageDataRes.json();
        throw new Error(message);
      }

      const pageData = await pageDataRes.json();

      return pageData;
    }
  });

  return query;
};
