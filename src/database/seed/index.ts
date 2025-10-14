import {
  seedPages,
  seedHomepageSections,
  seedAboutPage,
  seedContactPage,
  seedFAQPage,
  seedPrivacyPage,
  seedTOSPage
} from "./pages.seed";

async function main() {
  console.log("🌱 Starting database seeding...");

  try {
    // Seed pages first
    await seedPages();

    // Then seed homepage sections (depends on pages)
    await seedHomepageSections();
    await seedAboutPage();
    await seedContactPage();
    await seedFAQPage();
    await seedPrivacyPage();
    await seedTOSPage();

    console.log("✅ Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Database seeding failed:", error);
    process.exit(1);
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  main()
    .then(() => {
      console.log("🎉 Seeding process finished!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Fatal error during seeding:", error);
      process.exit(1);
    });
}
