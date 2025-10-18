import React from "react";
import { Metadata } from "next";
import type { SearchParams } from "nuqs/server";

import { loadSearchParams } from "@/lib/searchparams";
import { PerksFilters } from "@/modules/layouts/components/perks-filters";

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

export default function PerksPage({ searchParams }: PageProps) {
  console.log(searchParams);

  return (
    <PerksFilters>
      <p>List of perks</p>
    </PerksFilters>
  );
}
