import React from "react";

import { SectionsWithFieldsT } from "@/lib/cms/page-data";

import { HeroSection } from "../sections/hero";

type Props = {
  title: string;
  data: SectionsWithFieldsT;
};

export default function SectionMapper({ title, data }: Props) {
  const lowerTitle = title.toLowerCase();

  if (lowerTitle.includes("hero")) return <HeroSection data={data} />;

  return <></>;
}
