import React from "react";
import type { SearchParams } from "nuqs/server";

import { loadSearchParams } from "@/lib/searchparams";
import { getClient } from "@/lib/rpc/server";

interface PerksListProps {
  searchParams: Promise<SearchParams>;
  categorySlug?: string;
}

export async function PerksList({
  searchParams,
  categorySlug
}: PerksListProps) {
  const allSearchParams = await loadSearchParams(searchParams);

  const rpcClient = await getClient();

  const perksRes = await rpcClient.api.perks.$get({
    query: {
      page: allSearchParams.page.toString(),
      limit: allSearchParams.limit.toString(),
      ...(allSearchParams.search && { search: allSearchParams.search }),
      ...(allSearchParams.location && { location: allSearchParams.location }),
      ...(categorySlug && { categoryId: categorySlug })
    }
  });

  if (!perksRes.ok) {
    throw new Error("Failed to fetch perks data");
  }

  const perksData = await perksRes.json();

  return <div>{JSON.stringify(perksData, null, 2)}</div>;
}
