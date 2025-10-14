import React from "react";
import { Metadata } from "next";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import Link from "next/link";
import {
  getPageData,
  generatePageMetadata,
  generatePageStructuredData
} from "@/lib/cms/page-data";
import { WireframeNavbar } from "@/components/layout/wireframe-navbar";

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
  const session = await auth.api.getSession({
    headers: await headers()
  });

  // Fetch CMS page data server-side
  const pageData = await getPageData("/");

  // If no CMS content is found, fall back to the original design
  if (!pageData || pageData.sections.length === 0) {
    return <></>;
  }

  // Generate structured data for SEO
  const structuredData = generatePageStructuredData(pageData);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Wireframe Navigation */}
      <WireframeNavbar currentPage="landing" />

      <div className="p-8">
        {/* Simple Header */}
        <header className="mb-8 border-b pb-4">
          <h1 className="text-2xl font-bold">
            PerkPal Landing Page - Wireframe
          </h1>
          {session && (
            <p className="text-sm text-gray-600">
              Welcome, {session.user.name || session.user.email}!{" "}
              <Link href="/dashboard" className="text-blue-600 underline">
                Go to Dashboard
              </Link>
            </p>
          )}
        </header>

        {/* SEO Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        {/* Page Data as JSON */}
        <div className="space-y-6">
          <div className="border border-gray-300 p-4 rounded">
            <h2 className="text-lg font-semibold mb-2">Page Metadata</h2>
            <pre className="text-sm bg-gray-100 p-3 rounded overflow-auto">
              {JSON.stringify(
                {
                  id: pageData.id,
                  title: pageData.title,
                  slug: pageData.slug,
                  seoTitle: pageData.seoTitle,
                  seoDescription: pageData.seoDescription,
                  status: pageData.status
                },
                null,
                2
              )}
            </pre>
          </div>

          <div className="border border-gray-300 p-4 rounded">
            <h2 className="text-lg font-semibold mb-2">
              Sections ({pageData.sections.length})
            </h2>
            <div className="space-y-4">
              {pageData.sections.map((section) => (
                <div
                  key={section.id}
                  className="border border-gray-200 p-3 rounded"
                >
                  <h3 className="font-medium mb-2">
                    Section: {section.title || "Untitled"}
                  </h3>
                  <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
                    {JSON.stringify(section, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-gray-300 p-4 rounded">
            <h2 className="text-lg font-semibold mb-2">Structured Data</h2>
            <pre className="text-sm bg-gray-100 p-3 rounded overflow-auto">
              {JSON.stringify(structuredData, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
