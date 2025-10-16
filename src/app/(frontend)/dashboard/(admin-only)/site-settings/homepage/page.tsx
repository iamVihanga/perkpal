import React from "react";

import PageContainer from "@/modules/layouts/page-container";
import { AppPageShell } from "@/modules/layouts/page-shell";
import DraggableSectionsTable from "@/features/pages/homepage/sections-listing/draggable-listing";
import { CreatePageSection } from "@/features/pages/components/create-section";
import { EditPageSettings } from "@/features/pages/components/edit-page-settings";

export default function DashboardHomepage() {
  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <AppPageShell
          title="Homepage Sections"
          description="Customize homepage sections to tailor the user experience."
          actionComponent={
            <div className="flex items-center gap-2">
              <EditPageSettings pageSlug="/" />

              <CreatePageSection pageSlug="home" />
            </div>
          }
        />

        <DraggableSectionsTable />
      </div>
    </PageContainer>
  );
}
