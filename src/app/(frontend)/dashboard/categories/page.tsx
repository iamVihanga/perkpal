import React from "react";

import { Separator } from "@/components/ui/separator";
import PageContainer from "@/modules/layouts/page-container";
import { AppPageShell } from "@/modules/layouts/page-shell";

import { CategoryTableActions } from "@/features/categories/components/categories-table/category-table-actions";
import CategoriesTable from "@/features/categories/components/listing";

export default function DashboardCategoriesPage() {
  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <AppPageShell
          title="All Categories"
          description="Manage perk categories here"
          actionComponent={<></>}
        />

        <Separator />

        <CategoryTableActions />

        <CategoriesTable />
      </div>
    </PageContainer>
  );
}
