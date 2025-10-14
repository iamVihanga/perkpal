export async function GET() {
  const robotsContent = `User-agent: *
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

  return new Response(robotsContent, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400"
    }
  });
}
