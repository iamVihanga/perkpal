import React from "react";

import { SectionsWithFieldsT } from "@/lib/cms/page-data";
import { ContentFieldsSelectT } from "@/lib/zod/pages.zod";
import { ContentFieldRenderer } from "@/components/content/content-field-renderer";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type Props = {
  data: SectionsWithFieldsT;
};

export function HeroSection({ data }: Props) {
  const section = data;

  const fields = section.fields || [];
  const fieldsByKey = fields.reduce((acc, field) => {
    acc[field.key] = field;
    return acc;
  }, {} as Record<string, ContentFieldsSelectT>);

  const heroImage = fieldsByKey["image"] || fieldsByKey["background_image"];
  const heroTitle = fieldsByKey["heading"] || fieldsByKey["title"];
  const heroSubtitle = fieldsByKey["subheading"] || fieldsByKey["subtitle"];

  const ctaList = [
    {
      text: fieldsByKey["cta1Text"].value,
      link: fieldsByKey["cta1Link"].value
    },
    { text: fieldsByKey["cta2Text"].value, link: fieldsByKey["cta2Link"].value }
  ];

  return (
    <section className="container min-h-[550px] grid grid-cols-2 overflow-hidden">
      <div className="h-full flex flex-col justify-center max-w-4xl mx-auto px-4">
        {heroTitle && (
          <ContentFieldRenderer
            field={heroTitle}
            className="text-6xl font-black mb-6 text-accent-green font-palo"
          />
        )}
        {heroSubtitle && (
          <ContentFieldRenderer
            field={heroSubtitle}
            className="text-lg mb-8 opacity-90 font-palo"
          />
        )}

        <div className="mt-2 flex items-center gap-3">
          <Button
            asChild
            className="h-14 bg-amber-300 hover:bg-amber-400 text-accent-green rounded-2xl font-bold"
            size="lg"
          >
            <Link href={ctaList[0].link}>{ctaList[0].text}</Link>
          </Button>
          <Button
            asChild
            className="h-14 bg-accent-green hover:bg-accent-green/80 text-amber-200 rounded-2xl font-bold"
            size="lg"
          >
            <Link href={ctaList[1].link}>{ctaList[1].text}</Link>
          </Button>
        </div>
      </div>

      {/* Background Image */}
      {heroImage && (
        <div className="h-full flex flex-col justify-center items-center">
          <ContentFieldRenderer
            field={heroImage}
            className="size-[420px] object-cover rounded-full overflow-hidden"
          />
        </div>
      )}
    </section>
  );
}
