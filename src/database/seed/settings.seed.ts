import { db } from "../index";
import { globalSettings } from "../schema";

export async function seedSettings() {
  const existingSettings = await db.select().from(globalSettings).limit(1);

  if (existingSettings.length !== 0) {
    console.log("⚠️ Settings already seeded. Skipping...");
    return;
  }

  const createdSettings = await db
    .insert(globalSettings)
    .values([
      {
        key: "sitemapJson",
        value: JSON.stringify([
          {
            slug: "/",
            title: "Homepage"
          },
          {
            slug: "about",
            title: "About Us"
          },
          { slug: "contact", title: "Contact Us" },
          {
            slug: "faq",
            title: "FAQ"
          },
          {
            slug: "terms-of-service",
            title: "Terms of Service"
          },
          {
            slug: "privacy-policy",
            title: "Privacy Policy"
          }
        ])
      },
      {
        key: "robotsTxt",
        value: `
            User-agent: *
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
            Sitemap: https://perkpal.com/sitemap.xml
        `
      }
    ])
    .returning();

  console.log(`✅ Seeded ${createdSettings.length} settings.`);
}
