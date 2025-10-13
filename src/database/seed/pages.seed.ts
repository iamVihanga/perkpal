/* eslint-disable @typescript-eslint/no-unused-vars */
import { SectionsSelectT } from "@/lib/zod/pages.zod";
import { db } from "../index";
import { pages, sections, contentFields } from "../schema";

export async function seedPages() {
  // Check if there are any pages already in the database
  const existingPages = await db.select().from(pages).limit(1);

  if (existingPages.length !== 0) {
    console.log("⚠️ Pages already seeded. Skipping...");
    return;
  }

  // Insert initial pages
  const createdPages = await db
    .insert(pages)
    .values([
      {
        title: "Homepage",
        slug: "/"
      },
      {
        title: "About Us",
        slug: "about"
      },
      {
        title: "Contact Us",
        slug: "contact"
      },
      {
        title: "FAQ",
        slug: "faq"
      },
      {
        title: "Terms of Service",
        slug: "terms-of-service"
      },
      {
        title: "Privacy Policy",
        slug: "privacy-policy"
      }
    ])
    .returning();

  console.log(`✅ Seeded ${createdPages.length} pages.`);
}

// Seed homepage sections
export async function seedHomepageSections() {
  // Check if there are any sections already in the database
  const existingSections = await db.select().from(sections).limit(1);

  if (existingSections.length !== 0) {
    console.log("⚠️ Sections already seeded. Skipping...");
    return;
  }

  // Fetch the homepage to get its ID
  const homepage = await db.query.pages.findFirst({
    where: (fields, { eq }) => eq(fields.slug, "/")
  });

  if (!homepage) {
    console.error("❌ Homepage not found. Cannot seed sections.");
    return;
  }

  // Insert initial sections for the homepage
  const createdSections = await db
    .insert(sections)
    .values([
      {
        title: "Hero Banner",
        pageId: homepage.id
      },
      {
        title: "Featured Perks",
        pageId: homepage.id
      },
      {
        title: "Neweset Perks",
        pageId: homepage.id
      },
      {
        title: "Category Highlights",
        pageId: homepage.id
      },
      {
        title: "Call to Action",
        pageId: homepage.id
      }
    ])
    .returning();

  console.log(`✅ Seeded ${createdSections.length} sections for the homepage.`);

  //   Check if content fields already exist
  const existingContentFields = await db.select().from(contentFields).limit(1);

  if (existingContentFields.length !== 0) {
    console.log("⚠️ Content fields already seeded. Skipping...");
    return;
  }

  const heroBannerSection = createdSections.find(
    (section) => section.title === "Hero Banner"
  );
  const callToActionSection = createdSections.find(
    (section) => section.title === "Call to Action"
  );

  // Seed content fields for each section

  if (heroBannerSection) {
    await db.insert(contentFields).values([
      {
        key: "heading",
        value: "Supercharge Your Hustle.",
        sectionId: heroBannerSection.id,
        pageId: heroBannerSection.pageId
      },
      {
        key: "subheading",
        value: "Place your subheading content here.",
        sectionId: heroBannerSection.id,
        pageId: heroBannerSection.pageId
      },
      {
        key: "cta1Text",
        value: "CTA1",
        sectionId: heroBannerSection.id,
        pageId: heroBannerSection.pageId
      },
      {
        key: "cta1Link",
        value: "cta1-link",
        sectionId: heroBannerSection.id,
        pageId: heroBannerSection.pageId
      },
      {
        key: "cta2Text",
        value: "CTA2",
        sectionId: heroBannerSection.id,
        pageId: heroBannerSection.pageId
      },
      {
        key: "cta2Link",
        value: "cta2-link",
        sectionId: heroBannerSection.id,
        pageId: heroBannerSection.pageId
      },
      {
        key: "image",
        value: "",
        type: "image",
        sectionId: heroBannerSection.id,
        pageId: heroBannerSection.pageId
      }
    ]);
  }

  if (callToActionSection) {
    await db.insert(contentFields).values([
      {
        key: "ctaText",
        value: "Join Now",
        sectionId: callToActionSection.id,
        pageId: callToActionSection.pageId
      }
    ]);
  }

  console.log(`✅ Seeded content fields for the homepage sections.`);
}
