import { generateSitemap } from "@/lib/cms/sitemap";

// Next.js 15: Force dynamic for real-time data fetching
export const dynamic = "force-dynamic";
// Revalidate every hour (3600 seconds)
export const revalidate = 3600;

export async function GET() {
  try {
    const sitemap = await generateSitemap();

    return new Response(sitemap, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        // Cache for 1 hour, serve stale content for up to 24 hours while revalidating
        "Cache-Control":
          "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400"
      }
    });
  } catch (error) {
    console.error("Error generating sitemap:", error);

    // Return minimal sitemap on error
    const errorSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${
      process.env.NEXT_PUBLIC_CLIENT_APP_URL || "https://perkpal.com"
    }</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;

    return new Response(errorSitemap, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=300" // Cache for 5 minutes on error
      }
    });
  }
}
