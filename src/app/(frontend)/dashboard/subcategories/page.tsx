import React from "react";

import { Separator } from "@/components/ui/separator";
import PageContainer from "@/modules/layouts/page-container";
import { AppPageShell } from "@/modules/layouts/page-shell";

import { SubcategoryTableActions } from "@/features/subcategories/components/subcategories-table/subcategory-table-actions";
import DraggableSubcategoryTable from "@/features/subcategories/components/draggable-listing";
import { AddNewSubcategory } from "@/features/subcategories/components/create";
import { UpdateSubcategory } from "@/features/subcategories/components/update";

export default function DashboardSubcategoriesPage() {
  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <AppPageShell
          title="Subcategories"
          description="Manage perk subcategories with reordering"
          actionComponent={
            <>
              <AddNewSubcategory />
              <UpdateSubcategory />
            </>
          }
        />

        <Separator />

        <SubcategoryTableActions />

        <DraggableSubcategoryTable />
      </div>
    </PageContainer>
  );
}
