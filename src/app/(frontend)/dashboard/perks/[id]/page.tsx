import React from "react";

import PageContainer from "@/modules/layouts/page-container";
import { AppPageShell } from "@/modules/layouts/page-shell";
import { Separator } from "@/components/ui/separator";
import { UpdatePerk } from "@/features/perks/components/update";

interface UpdatePerkPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function UpdatePerkPage({ params }: UpdatePerkPageProps) {
  const { id } = await params;

  return (
    <PageContainer scrollable={false}>
      <div className="bg-secondary/30 border border-secondary p-6 rounded-lg flex flex-1 flex-col space-y-4 max-w-2xl mx-auto w-full">
        <AppPageShell
          title="Update Perk"
          description="Modify the details of the selected perk."
          actionComponent={undefined}
        />

        <Separator />

        <UpdatePerk perkId={id} />
      </div>
    </PageContainer>
  );
}
