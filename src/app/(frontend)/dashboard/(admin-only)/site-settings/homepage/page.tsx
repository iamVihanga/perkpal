import React from "react";

import PageContainer from "@/modules/layouts/page-container";
import { AppPageShell } from "@/modules/layouts/page-shell";
import DraggableSectionsTable from "@/features/pages/homepage/sections-listing/draggable-listing";
import { CreatePageSection } from "@/features/pages/components/create-section";

export default function DashboardHomepage() {
  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <AppPageShell
          title="Homepage Sections"
          description="Customize homepage sections to tailor the user experience."
          actionComponent={<CreatePageSection pageSlug="/" />}
        />

        <DraggableSectionsTable />
      </div>
    </PageContainer>
  );
}
