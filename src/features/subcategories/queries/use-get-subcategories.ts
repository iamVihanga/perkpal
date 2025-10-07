import { useQuery } from "@tanstack/react-query";

import { getClient } from "@/lib/rpc/client";

interface FilterParams {
  page?: number;
  limit?: number;
  search?: string | null;
  categoryId?: string | null;
}

export const useGetSubcategories = (params: FilterParams) => {
  const { page = 1, limit = 10, search = "", categoryId } = params;

  const query = useQuery({
    queryKey: ["subcategories", { page, limit, search, categoryId }],
    queryFn: async () => {
      const rpcClient = await getClient();

      const response = await rpcClient.api.subcategories.$get({
        query: {
          page: page.toString(),
          limit: limit.toString(),
          ...(search && { search }),
          ...(categoryId && { categoryId })
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
