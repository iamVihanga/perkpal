import { getClient } from "@/lib/rpc/server";

export interface SitemapPage {
  slug: string;
  title: string;
  priority?: string;
  changefreq?: string;
  lastmod?: string;
}

export async function getAllPages(): Promise<SitemapPage[]> {
  try {
    const rpcClient = await getClient();

    // Fetch sitemap settings from database
    const response = await rpcClient.api.settings.$get();

    if (!response.ok) {
      console.error("Failed to fetch settings for sitemap");
      return [];
    }

    const settings = await response.json();

    // Parse sitemapJson from database
    if (!settings.sitemapJson) {
      console.warn("No sitemap configuration found in database");
      return [];
    }

    try {
      const pages = JSON.parse(settings.sitemapJson);

      if (!Array.isArray(pages)) {
        console.error("Invalid sitemap JSON format");
        return [];
      }

      return pages.map((page: SitemapPage) => ({
        slug: page.slug || "/",
        title: page.title || "Untitled",
        priority: page.priority || "0.5",
        changefreq: page.changefreq || "weekly",
        lastmod: page.lastmod || new Date().toISOString().split("T")[0]
      }));
    } catch (parseError) {
      console.error("Error parsing sitemap JSON:", parseError);
      return [];
    }
  } catch (error) {
    console.error("Error fetching pages for sitemap:", error);
    return [];
  }
}

export async function generateSitemap() {
  const pages = await getAllPages();
  const baseUrl =
    process.env.NEXT_PUBLIC_CLIENT_APP_URL || "https://perkpal.com";

  // If no pages configured, return empty sitemap
  if (pages.length === 0) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
</urlset>`;
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages
    .map(
      (page) => `
  <url>
    <loc>${baseUrl}${
        page.slug.startsWith("/") ? page.slug : `/${page.slug}`
      }</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
    )
    .join("")}
</urlset>`;

  return sitemap;
}
