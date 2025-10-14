import { Metadata } from "next";
import StaticPage, {
  generateStaticPageMetadata
} from "@/components/content/static-page";

// ISR: Revalidate every 1 hour
export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return generateStaticPageMetadata({
    slug: "about",
    fallbackTitle: "About Us - PerkPal",
    fallbackDescription:
      "Learn more about PerkPal and our mission to bring you the best perks and deals."
  });
}

export default async function AboutPage() {
  return <StaticPage slug="about" fallbackTitle="About Us" />;
}
