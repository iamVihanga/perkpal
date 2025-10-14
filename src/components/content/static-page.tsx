import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getPageData,
  generatePageMetadata,
  generatePageStructuredData
} from "@/lib/cms/page-data";
import { PageSection } from "@/components/content/page-section";
import {
  StaticPageHeader,
  StaticPageFooter
} from "@/components/layout/static-page-layout";

interface StaticPageProps {
  slug: string;
  fallbackTitle?: string;
  fallbackDescription?: string;
}

export async function generateStaticPageMetadata({
  slug,
  fallbackTitle
}: StaticPageProps): Promise<Metadata> {
  const pageData = await getPageData(slug);

  if (!pageData) {
    return {
      title: fallbackTitle || "PerkPal",
      description:
        "Find exclusive perks and deals tailored just for you with PerkPal."
    };
  }

  return generatePageMetadata(pageData, fallbackTitle);
}

export default async function StaticPage({ slug }: StaticPageProps) {
  // Fetch page data server-side
  const pageData = await getPageData(slug);

  if (!pageData) {
    notFound();
  }

  // Generate structured data for SEO
  const structuredData = generatePageStructuredData(pageData);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <StaticPageHeader />

      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <main className="flex-1">
        {/* Page Header */}
        <header className="bg-primary/5 py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {pageData.seoTitle || pageData.title}
            </h1>
            {pageData.seoDescription && (
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                {pageData.seoDescription}
              </p>
            )}
          </div>
        </header>

        {/* Page Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto space-y-16">
            {pageData.sections.map((section) => (
              <PageSection
                key={section.id}
                section={section}
                className="prose prose-lg max-w-none"
              />
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <StaticPageFooter />
    </div>
  );
}
