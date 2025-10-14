export async function getAllPages() {
  try {
    // This would need a new endpoint to list all published pages
    // For now, we'll return the seeded pages
    return [
      { slug: "/", title: "Homepage", updatedAt: new Date() },
      { slug: "about", title: "About Us", updatedAt: new Date() },
      { slug: "contact", title: "Contact Us", updatedAt: new Date() },
      { slug: "faq", title: "FAQ", updatedAt: new Date() },
      {
        slug: "terms-of-service",
        title: "Terms of Service",
        updatedAt: new Date()
      },
      { slug: "privacy-policy", title: "Privacy Policy", updatedAt: new Date() }
    ];
  } catch (error) {
    console.error("Error fetching pages for sitemap:", error);
    return [];
  }
}

export async function generateSitemap() {
  const pages = await getAllPages();
  const baseUrl =
    process.env.NEXT_PUBLIC_CLIENT_APP_URL || "https://perkpal.com";

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages
    .map(
      (page) => `
  <url>
    <loc>${baseUrl}${page.slug === "/" ? "" : `/${page.slug}`}</loc>
    <lastmod>${page.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page.slug === "/" ? "1.0" : "0.8"}</priority>
  </url>`
    )
    .join("")}
</urlset>`;

  return sitemap;
}
