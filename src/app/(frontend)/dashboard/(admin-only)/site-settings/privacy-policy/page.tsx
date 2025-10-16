import React from "react";

import PageContainer from "@/modules/layouts/page-container";
import { AppPageShell } from "@/modules/layouts/page-shell";
import FieldsTable from "@/features/pages/components/fields-listing/listing";
import { CreateFieldDialog } from "@/features/pages/components/create-field";
import { EditPageSettings } from "@/features/pages/components/edit-page-settings";

export default function DashboardTOSPage() {
  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <AppPageShell
          title={`Page: Privacy Policy`}
          description="Update content fields for selected page"
          actionComponent={
            <div className="flex items-center gap-2">
              <EditPageSettings pageSlug="privacy-policy" />
              <CreateFieldDialog pageSlug="privacy-policy" />
            </div>
          }
        />

        <FieldsTable pageSlug="privacy-policy" />
      </div>
    </PageContainer>
  );
}
