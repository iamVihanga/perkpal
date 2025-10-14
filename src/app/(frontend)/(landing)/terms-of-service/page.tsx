import { Metadata } from "next";
import StaticPage, {
  generateStaticPageMetadata
} from "@/components/content/static-page";

// ISR: Revalidate daily for legal document updates
export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  return generateStaticPageMetadata({
    slug: "terms-of-service",
    fallbackTitle: "Terms of Service - PerkPal",
    fallbackDescription:
      "Read our terms of service and understand the rules and regulations for using PerkPal."
  });
}

export default async function TermsPage() {
  return (
    <StaticPage slug="terms-of-service" fallbackTitle="Terms of Service" />
  );
}
