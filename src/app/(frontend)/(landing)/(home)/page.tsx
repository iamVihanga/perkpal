import React from "react";
import { Metadata } from "next";
import {
  getPageData,
  generatePageMetadata,
  generatePageStructuredData
} from "@/lib/cms/page-data";
import SectionMapper from "@/modules/layouts/components/section-mapper";

// ISR: Revalidate every 15 minutes for landing page content
export const revalidate = 900;

// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getPageData("/");

  if (!pageData) {
    return {
      title: "PerkPal - Discover Amazing Perks and Deals",
      description:
        "Find exclusive perks and deals tailored just for you with PerkPal."
    };
  }

  return generatePageMetadata(
    pageData,
    "PerkPal - Discover Amazing Perks and Deals"
  );
}

export default async function Home() {
  // Fetch CMS page data server-side
  const pageData = await getPageData("/");

  // If no CMS content is found, fall back to the original design
  if (!pageData || pageData.sections.length === 0) {
    return <></>;
  }

  // Generate structured data for SEO
  const structuredData = generatePageStructuredData(pageData);

  return (
    <div className="min-h-screen">
      {/* SEO Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {pageData.sections.map((section) => (
        <SectionMapper key={section.id} title={section.title} data={section} />
      ))}
    </div>
  );
}
