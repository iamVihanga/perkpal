import { useQuery } from "@tanstack/react-query";

import { getClient } from "@/lib/rpc/client";

interface FilterParams {
  userId: string;
}

export const useGetUser = (params: FilterParams) => {
  const query = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const client = await getClient();

      const response = await client.api.users[":id"].$get({
        param: { id: params.userId }
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
