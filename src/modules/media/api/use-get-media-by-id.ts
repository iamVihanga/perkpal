import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

export const useGetMediaByID = (id: string) => {
  const query = useQuery({
    queryKey: ["media"],
    queryFn: async () => {
      const rpcClient = await client();

      const response = await rpcClient.api.media[":id"].$get({
        param: { id }
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
