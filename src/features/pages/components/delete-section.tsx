"use client";
import React from "react";
import { TrashIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SectionsSelectT } from "@/lib/zod/pages.zod";

import { useDeleteSection } from "../queries/use-delete-section";

type Props = {
  section: SectionsSelectT;
};

export function DeleteSection({ section }: Props) {
  const { mutate: deleteSection, isPending: isDeleting } = useDeleteSection();

  const handleSectionDelete = () => {
    deleteSection({
      pageId: section.pageId,
      id: section.id
    });
  };

  if (!section) return <></>;

  return (
    <Button
      onClick={handleSectionDelete}
      variant={"outline"}
      icon={<TrashIcon />}
      loading={isDeleting}
    >
      Remove
    </Button>
  );
}
