import React from "react";
import Link from "next/link";
import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import JournalTable from "@/features/journal/components/listing";
import { JournalTableActions } from "@/features/journal/components/journal-table/journal-table-actions";
import PageContainer from "@/modules/layouts/page-container";
import { AppPageShell } from "@/modules/layouts/page-shell";
import { Separator } from "@/components/ui/separator";

export default function ManageJournalPage() {
  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <AppPageShell
          title="Manage Journal"
          description="Manage all blog posts and create new posts"
          actionComponent={
            <Button asChild icon={<PlusIcon />}>
              <Link href="/dashboard/journal/new">New Post</Link>
            </Button>
          }
        />

        <Separator />

        <JournalTableActions />

        <JournalTable />
      </div>
    </PageContainer>
  );
}
