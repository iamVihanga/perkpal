import React, { Suspense } from "react";
import { Metadata } from "next";
import type { SearchParams } from "nuqs/server";

import { loadSearchParams } from "@/lib/searchparams";
import { PerksFilters } from "@/modules/layouts/components/perks-filters";
import { PerksList } from "@/modules/layouts/components/perks-list";
import { PerksListSkeleton } from "@/modules/layouts/skelatons/perks-list-skelaton";

// ISR: Revalidate every 30 minutes for perks listing
export const revalidate = 1800;

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export async function generateMetadata({
  searchParams
}: PageProps): Promise<Metadata> {
  const {} = await loadSearchParams(searchParams);

  const title = "All Perks";
  const description = "Browse all available perks.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `${process.env.NEXT_PUBLIC_CLIENT_APP_URL}/perks`
    },
    twitter: {
      card: "summary_large_image",
      title,
      description
    },
    alternates: {
      canonical: "/perks"
    }
  };
}

export default async function PerksPage({ searchParams }: PageProps) {
  return (
    <PerksFilters>
      <Suspense fallback={<PerksListSkeleton />}>
        <PerksList searchParams={searchParams} />
      </Suspense>
    </PerksFilters>
  );
}
