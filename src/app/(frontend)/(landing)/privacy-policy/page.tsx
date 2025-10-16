import { Metadata } from "next";
import StaticPage, {
  generateStaticPageMetadata
} from "@/components/content/static-page";

// ISR: Revalidate daily for legal document updates
export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  return generateStaticPageMetadata({
    slug: "privacy-policy",
    fallbackTitle: "Privacy Policy - PerkPal",
    fallbackDescription:
      "Learn how PerkPal protects your privacy and handles your personal information."
  });
}

export default async function PrivacyPage() {
  return <StaticPage slug="privacy-policy" fallbackTitle="Privacy Policy" />;
}
