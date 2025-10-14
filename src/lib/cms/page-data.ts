/* eslint-disable @typescript-eslint/no-explicit-any */
import { getClient } from "@/lib/rpc/server";
import {
  PagesSelectT,
  SectionsSelectT,
  ContentFieldsSelectT
} from "@/lib/zod/pages.zod";
import { Metadata } from "next";

export interface PageWithContent extends PagesSelectT {
  sections: (SectionsSelectT & {
    fields: ContentFieldsSelectT[];
  })[];
}

/**
 * Fetch page data with sections and content fields
 * @param slug - The page slug to fetch
 * @returns PageWithContent or null if not found
 */
export async function getPageData(
  slug: string
): Promise<PageWithContent | null> {
  try {
    const rpcClient = await getClient();

    // Fetch page by slug
    const pageResponse = await rpcClient.api.pages.$get({
      query: { slug }
    });

    if (!pageResponse.ok) {
      return null;
    }

    const apiPage = await pageResponse.json();

    // Fetch sections for the page
    const sectionsResponse = await rpcClient.api.pages[":id"].sections.$get({
      param: { id: apiPage.id }
    });

    if (!sectionsResponse.ok) {
      throw new Error("Failed to fetch sections");
    }

    const apiSections = await sectionsResponse.json();

    // Fetch content fields for each section
    const sectionsWithFields = await Promise.all(
      apiSections.map(async (section: any) => {
        const fieldsResponse = await rpcClient.api.pages[":id"].fields.$get({
          param: { id: apiPage.id },
          query: { section_id: section.id }
        });

        // Convert API section to expected format first
        const convertedSection = {
          id: section.id,
          pageId: section.pageId,
          title: section.title,
          description: section.description,
          displayOrder: section.displayOrder,
          createdAt: section.createdAt ? new Date(section.createdAt) : null,
          updatedAt: section.updatedAt ? new Date(section.updatedAt) : null
        };

        if (fieldsResponse.ok) {
          const apiFields = await fieldsResponse.json();
          // Convert API fields to expected format
          const fields = apiFields.map((field: any) => ({
            id: field.id,
            pageId: field.pageId,
            sectionId: field.sectionId,
            key: field.key,
            value: field.value,
            type: field.type,
            metadata: field.metadata,
            displayOrder: field.displayOrder,
            createdAt: field.createdAt ? new Date(field.createdAt) : null,
            updatedAt: field.updatedAt ? new Date(field.updatedAt) : null
          }));

          return { ...convertedSection, fields };
        }

        return { ...convertedSection, fields: [] };
      })
    );

    // Also fetch page-level fields (not tied to any section)
    const pageFieldsResponse = await rpcClient.api.pages[":id"].fields.$get({
      param: { id: apiPage.id },
      query: { section_id: undefined }
    });

    let pageFields: any[] = [];
    if (pageFieldsResponse.ok) {
      const allApiFields = await pageFieldsResponse.json();
      pageFields = allApiFields
        .filter((field: any) => !field.sectionId)
        .map((field: any) => ({
          id: field.id,
          pageId: field.pageId,
          sectionId: field.sectionId,
          key: field.key,
          value: field.value,
          type: field.type,
          metadata: field.metadata,
          displayOrder: field.displayOrder,
          createdAt: field.createdAt ? new Date(field.createdAt) : null,
          updatedAt: field.updatedAt ? new Date(field.updatedAt) : null
        }));
    }

    // Add page-level fields as a virtual section if they exist
    if (pageFields.length > 0) {
      const virtualSection = {
        id: "page-fields",
        pageId: apiPage.id,
        title: "",
        description: "",
        displayOrder: -1,
        createdAt: null,
        updatedAt: null,
        fields: pageFields
      };
      sectionsWithFields.unshift(virtualSection);
    }

    // Convert API page to expected format
    const page = {
      id: apiPage.id,
      title: apiPage.title,
      slug: apiPage.slug,
      status: apiPage.status,
      seoTitle: apiPage.seoTitle,
      seoDescription: apiPage.seoDescription,
      ogImage: apiPage.ogImage,
      createdAt: apiPage.createdAt ? new Date(apiPage.createdAt) : null,
      updatedAt: apiPage.updatedAt ? new Date(apiPage.updatedAt) : null
    };

    return {
      ...page,
      sections: sectionsWithFields
    } as PageWithContent;
  } catch (error) {
    console.error("Error fetching page data:", error);
    return null;
  }
}

/**
 * Generate metadata for a page using the database SEO fields
 */
export function generatePageMetadata(
  page: PageWithContent,
  defaultTitle?: string
): Metadata {
  // Use database SEO fields first, then fallbacks
  const title = page.seoTitle || page.title || defaultTitle || "PerkPal";
  const description =
    page.seoDescription || "Discover amazing perks and deals with PerkPal";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      ...(page.ogImage?.url && {
        images: [
          {
            url: page.ogImage.url,
            width: 1200,
            height: 630,
            alt: title
          }
        ]
      })
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(page.ogImage?.url && {
        images: [page.ogImage.url]
      })
    },
    alternates: {
      canonical: page.slug === "/" ? "/" : `/${page.slug}`
    }
  };
}

/**
 * Generate structured data for a page using database SEO fields
 */
export function generatePageStructuredData(page: PageWithContent) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.seoTitle || page.title,
    description: page.seoDescription || undefined,
    url:
      page.slug === "/"
        ? process.env.NEXT_PUBLIC_CLIENT_APP_URL
        : `${process.env.NEXT_PUBLIC_CLIENT_APP_URL}/${page.slug}`,
    datePublished: page.createdAt
      ? new Date(page.createdAt).toISOString()
      : undefined,
    dateModified: page.updatedAt
      ? new Date(page.updatedAt).toISOString()
      : undefined,
    image: page.ogImage?.url
      ? {
          "@type": "ImageObject",
          url: page.ogImage.url,
          alt: page.seoTitle || page.title
        }
      : undefined,
    isPartOf: {
      "@type": "WebSite",
      name: "PerkPal",
      url: process.env.NEXT_PUBLIC_CLIENT_APP_URL
    }
  };
}
