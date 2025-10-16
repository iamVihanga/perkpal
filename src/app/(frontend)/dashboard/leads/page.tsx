import React from "react";

import { Separator } from "@/components/ui/separator";
import PageContainer from "@/modules/layouts/page-container";
import { AppPageShell } from "@/modules/layouts/page-shell";
import { LeadTableActions } from "@/features/leads/components/leads-table/lead-table-actions";
import LeadTable from "@/features/leads/components/listing";

export default function LeadsPage() {
  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <AppPageShell
          title="Leads Management"
          description="Manage all leads available"
          actionComponent={undefined}
        />

        <Separator />

        <LeadTableActions />

        <LeadTable />
      </div>
    </PageContainer>
  );
}
