import { Metadata } from "next";
import StaticPage, {
  generateStaticPageMetadata
} from "@/components/content/static-page";

// ISR: Revalidate every hour for FAQ updates
export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return generateStaticPageMetadata({
    slug: "faq",
    fallbackTitle: "FAQ - PerkPal",
    fallbackDescription:
      "Find answers to frequently asked questions about PerkPal and our services."
  });
}

export default async function FAQPage() {
  return <StaticPage slug="faq" fallbackTitle="Frequently Asked Questions" />;
}
