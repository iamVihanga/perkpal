import React from "react";

import PageContainer from "@/modules/layouts/page-container";
import { AppPageShell } from "@/modules/layouts/page-shell";
import { Separator } from "@/components/ui/separator";
import { CreatePerk } from "@/features/perks/components/create";

export default function CreatePerkPage() {
  return (
    <PageContainer scrollable={false}>
      <div className="bg-secondary/30 border border-secondary p-6 rounded-lg flex flex-1 flex-col space-y-4 max-w-2xl mx-auto w-full">
        <AppPageShell
          title="Add new Perk"
          description="Complete following form to setup your new perk."
          actionComponent={undefined}
        />

        <Separator />

        <CreatePerk />
      </div>
    </PageContainer>
  );
}
