"use client";

import React from "react";

import PageContainer from "@/modules/layouts/page-container";
import { AppPageShell } from "@/modules/layouts/page-shell";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import FieldsTable from "@/features/pages/homepage/fields-listing/listing";
import { CreateFieldDialog } from "@/features/pages/components/create-field";
import { useParams } from "next/navigation";

export default function DashboardHomepageSectionsSinglePage() {
  const { id } = useParams<{ id: string }>();

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <AppPageShell
          title={`Edit Section Details`}
          description="Update content fields for selected section"
          actionComponent={
            <div className="flex items-center gap-2">
              <Button asChild icon={<ArrowLeft />} variant="outline">
                <Link href="/dashboard/site-settings/homepage">Go Back</Link>
              </Button>

              <CreateFieldDialog pageSlug="/" sectionId={id} />
            </div>
          }
        />

        {/* <Separator /> */}

        <FieldsTable />
      </div>
    </PageContainer>
  );
}
