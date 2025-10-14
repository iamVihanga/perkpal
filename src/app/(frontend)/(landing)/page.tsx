import React from "react";
import { Metadata } from "next";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { SignoutButton } from "@/modules/auth/components/signout-button";
import Link from "next/link";
import {
  getPageData,
  generatePageMetadata,
  generatePageStructuredData
} from "@/lib/cms/page-data";
import {
  PageSection,
  HeroSection,
  FeaturesSection
} from "@/components/content/page-section";
import {
  StaticPageHeader,
  StaticPageFooter
} from "@/components/layout/static-page-layout";

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
    return (
      <div className="bg-[#002E1C] text-amber-100 h-screen w-screen flex items-center justify-center flex-col">
        <h1 className="font-palo text-6xl font-black">{`PerkPal.`}</h1>

        <div className="space-y-3 mt-5 text-center">
          {session && (
            <p className="font-palo text-xs font-medium">
              Hello, {session.user.name || session.user.email}
            </p>
          )}

          <div className="flex items-center gap-2">
            {session ? (
              <>
                <SignoutButton className="bg-transparent text-amber-100" />

                <Button
                  asChild
                  className="bg-amber-100 hover:bg-amber-50 text-green-900 hover:text-green-900"
                >
                  <Link href="/dashboard">
                    {session.user.role === "admin" && "Admin"} Dashboard
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button variant={"ghost"} asChild>
                  <Link href="/signin">Sign In</Link>
                </Button>
                <Button variant={"outline"} asChild>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Generate structured data for SEO
  const structuredData = generatePageStructuredData(pageData);

  // Separate different types of sections for specialized rendering
  const heroSections = pageData.sections.filter(
    (section) =>
      section.title?.toLowerCase().includes("hero") ||
      section.title?.toLowerCase().includes("banner") ||
      section.displayOrder === 0
  );

  const featureSections = pageData.sections.filter(
    (section) =>
      section.title?.toLowerCase().includes("feature") ||
      section.title?.toLowerCase().includes("benefit")
  );

  const otherSections = pageData.sections.filter(
    (section) =>
      !heroSections.includes(section) && !featureSections.includes(section)
  );

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
        {/* Auth Status Bar - Keep the original functionality */}
        {session && (
          <div className="bg-primary/10 px-4 py-2 text-center">
            <span className="text-sm">
              Welcome back, {session.user.name || session.user.email}!
            </span>
            <Link
              href="/dashboard"
              className="ml-4 text-primary hover:underline text-sm font-medium"
            >
              Go to Dashboard
            </Link>
          </div>
        )}

        {/* Hero Sections */}
        {heroSections.map((section) => (
          <HeroSection key={section.id} section={section} />
        ))}

        {/* Features Sections */}
        {featureSections.map((section) => (
          <FeaturesSection key={section.id} section={section} />
        ))}

        {/* Other Content Sections */}
        <div className="container mx-auto px-4 py-16 space-y-16">
          {otherSections.map((section) => (
            <PageSection
              key={section.id}
              section={section}
              className="max-w-4xl mx-auto"
            />
          ))}
        </div>

        {/* CTA Section for Auth */}
        {!session && (
          <section className="bg-primary/5 py-16">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold mb-4">
                Get Started with PerkPal
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of users discovering amazing perks and deals.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Button asChild size="lg">
                  <Link href="/signup">Sign Up</Link>
                </Button>
                <Button variant="outline" asChild size="lg">
                  <Link href="/signin">Sign In</Link>
                </Button>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <StaticPageFooter />
    </div>
  );
}
