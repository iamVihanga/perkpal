import React from "react";

import PageContainer from "@/modules/layouts/page-container";
import { AppPageShell } from "@/modules/layouts/page-shell";
import FieldsTable from "@/features/pages/components/fields-listing/listing";
import { CreateFieldDialog } from "@/features/pages/components/create-field";

export default function DashboardTOSPage() {
  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <AppPageShell
          title={`Page: Terms of Services`}
          description="Update content fields for selected page"
          actionComponent={
            <div className="flex items-center gap-2">
              <CreateFieldDialog pageSlug="terms-of-service" />
            </div>
          }
        />

        <FieldsTable pageSlug="terms-of-service" />
      </div>
    </PageContainer>
  );
}
