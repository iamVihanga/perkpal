import { Metadata } from "next";
import StaticPage, {
  generateStaticPageMetadata
} from "@/components/content/static-page";

// ISR: Revalidate every hour for contact information updates
export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return generateStaticPageMetadata({
    slug: "contact",
    fallbackTitle: "Contact Us - PerkPal",
    fallbackDescription:
      "Get in touch with the PerkPal team. We would love to hear from you."
  });
}

export default async function ContactPage() {
  return <StaticPage slug="contact" fallbackTitle="Contact Us" />;
}
