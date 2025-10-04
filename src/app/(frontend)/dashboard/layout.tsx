import React, { Suspense } from "react";

import { SiteHeader } from "@/components/dashboard/site-header";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

type Props = {
  children?: React.ReactNode;
};

export default function DashboardLayout({ children }: Props) {
  return (
    <Suspense>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)"
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset className="bg-card">
          <SiteHeader />

          <div className="flex flex-1 flex-col">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </Suspense>
  );
}
