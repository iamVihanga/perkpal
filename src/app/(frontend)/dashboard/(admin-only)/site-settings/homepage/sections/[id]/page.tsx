import React from "react";

import PageContainer from "@/modules/layouts/page-container";
import { AppPageShell } from "@/modules/layouts/page-shell";
import DraggableSectionsTable from "@/features/pages/homepage/sections-listing/draggable-listing";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function DashboardHomepageSectionsSinglePage() {
  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <AppPageShell
          title={`Edit Section Details`}
          description="Update content fields for selected section"
          actionComponent={
            <Button asChild icon={<ArrowLeft />} variant="outline">
              <Link href="/dashboard/site-settings/homepage">Go Back</Link>
            </Button>
          }
        />

        {/* <Separator /> */}

        <DraggableSectionsTable />
      </div>
    </PageContainer>
  );
}
