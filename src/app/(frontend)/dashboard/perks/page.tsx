import { PlusIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import PageContainer from "@/modules/layouts/page-container";
import { AppPageShell } from "@/modules/layouts/page-shell";
import { PerksTableActions } from "@/features/perks/components/perks-table/perks-table-actions";
import DraggablePerkTable from "@/features/perks/components/draggable-listing";

export default function PerksPage() {
  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <AppPageShell
          title="Perks Management"
          description="Manage all perks available"
          actionComponent={
            <Button asChild icon={<PlusIcon />}>
              <Link href={`/dashboard/perks/new`}>Create new Perk</Link>
            </Button>
          }
        />

        <Separator />

        <PerksTableActions />

        <DraggablePerkTable />
      </div>
    </PageContainer>
  );
}
