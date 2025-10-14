import { useQuery } from "@tanstack/react-query";

import { getClient } from "@/lib/rpc/client";

export const useGetFields = (params: {
  pageSlug: string;
  sectionId?: string | undefined;
}) => {
  const { pageSlug, sectionId } = params;

  const query = useQuery({
    queryKey: ["fields", { pageSlug, sectionId }],
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

      const response = await rpcClient.api.pages[":id"].fields.$get({
        param: { id: pageData.id },
        query: { section_id: sectionId }
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
