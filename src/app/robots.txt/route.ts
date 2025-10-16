import { getClient } from "@/lib/rpc/server";

export const dynamic = "force-dynamic";
export const revalidate = 3600; // Revalidate every hour

export async function GET() {
  try {
    const rpcClient = await getClient();

    // Fetch robots.txt content from database settings
    const response = await rpcClient.api.settings.$get();

    let robotsContent = "";

    if (response.ok) {
      const settings = await response.json();

      if (settings.robotsTxt) {
        // Strip HTML tags if the content was saved from rich text editor
        robotsContent = settings.robotsTxt
          .replace(/<[^>]*>/g, "") // Remove HTML tags
          .replace(/&nbsp;/g, " ") // Replace &nbsp; with space
          .replace(/&amp;/g, "&") // Replace &amp; with &
          .replace(/&lt;/g, "<") // Replace &lt; with <
          .replace(/&gt;/g, ">") // Replace &gt; with >
          .replace(/&quot;/g, '"') // Replace &quot; with "
          .trim();
      }
    }

    // Fallback to default robots.txt if not configured
    if (!robotsContent) {
      robotsContent = `User-agent: *
Allow: /

# Allow access to static assets
Allow: /_next/static/
Allow: /favicon.ico
Allow: /images/

# Disallow admin and authentication routes
Disallow: /dashboard/
Disallow: /signin
Disallow: /signup
Disallow: /api/

# Sitemap
Sitemap: ${
        process.env.NEXT_PUBLIC_CLIENT_APP_URL || "https://perkpal.com"
      }/sitemap.xml`;
    }

    return new Response(robotsContent, {
      headers: {
        "Content-Type": "text/plain",
        "Cache-Control":
          "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400"
      }
    });
  } catch (error) {
    console.error("Error generating robots.txt:", error);

    // Return default robots.txt on error
    const defaultRobots = `User-agent: *
Allow: /

Sitemap: ${
      process.env.NEXT_PUBLIC_CLIENT_APP_URL || "https://perkpal.com"
    }/sitemap.xml`;

    return new Response(defaultRobots, {
      headers: {
        "Content-Type": "text/plain",
        "Cache-Control": "public, max-age=3600"
      }
    });
  }
}
