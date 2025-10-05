import React from "react";

import { Separator } from "@/components/ui/separator";
import PageContainer from "@/modules/layouts/page-container";
import { AppPageShell } from "@/modules/layouts/page-shell";

import { CategoryTableActions } from "@/features/categories/components/categories-table/category-table-actions";
import DraggableCategoryTable from "@/features/categories/components/draggable-listing";

export default function DashboardCategoriesPage() {
  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <AppPageShell
          title="All Categories"
          description="Manage perk categories with drag & drop reordering"
          actionComponent={<></>}
        />

        <Separator />

        <CategoryTableActions />

        <DraggableCategoryTable />
      </div>
    </PageContainer>
  );
}
