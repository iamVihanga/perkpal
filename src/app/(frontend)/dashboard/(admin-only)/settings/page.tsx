"use client";

import React, { useState } from "react";

import PageContainer from "@/modules/layouts/page-container";
import { AppPageShell } from "@/modules/layouts/page-shell";
import type { ViewType } from "@/features/settings/types";
import { SettingsTabBar } from "@/features/settings/components/settings-tab-bar";
import { SettingsTabView } from "@/features/settings/components/settings-tab-view";

export default function SettingsLayout() {
  const [currentView, setCurrentView] = useState<ViewType>("general");

  return (
    <PageContainer scrollable={false}>
      <div className="flex flex-1 flex-col space-y-4">
        <AppPageShell
          title="Global Settings"
          description="Manage application's global settings and configurations."
          actionComponent={undefined}
        />

        <SettingsTabBar tab={currentView} setTab={setCurrentView} />

        <SettingsTabView tab={currentView} />
      </div>
    </PageContainer>
  );
}
