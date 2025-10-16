import React from "react";

import { Separator } from "@/components/ui/separator";
import PageContainer from "@/modules/layouts/page-container";
import { AppPageShell } from "@/modules/layouts/page-shell";
import { CreateUserDialog } from "@/features/user-management/components/create-user-dialog";
import { UsersTableActions } from "@/features/user-management/components/users-table/users-table-actions";
import { UsersListing } from "@/features/user-management/components/users-listing";

export default function UserManagementPage() {
  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <AppPageShell
          title="Manage Users"
          description="Manage users with different roles and permissions."
          actionComponent={<CreateUserDialog />}
        />

        <Separator />

        <UsersTableActions />

        <UsersListing />
      </div>
    </PageContainer>
  );
}
