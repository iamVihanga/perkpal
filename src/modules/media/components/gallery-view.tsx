/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";

import PageContainer from "@/modules/layouts/page-container";
import { AppPageShell } from "@/modules/layouts/page-shell";
import { GalleryTabBar } from "./view-tabs/tab-bar";
import UploadTab from "./view-tabs/upload-tab";
import { LibraryTab } from "./view-tabs/library-tab";
import { Media } from "@/lib/zod/media.zod";
// import UploadTab from "./view-tabs/upload-tab";

export type ActiveTab = "upload" | "library";

export type onUseSelectedT = (selectedFiles: Media[]) => void;

type Props = {
  modal?: boolean;
  activeTab?: ActiveTab;
  onUseSelected?: onUseSelectedT;
};

export default function GalleryView({
  modal = false,
  activeTab,
  onUseSelected
}: Props) {
  const [currentTab, setCurrentTab] = useState<ActiveTab>(
    activeTab || "upload"
  );

  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-1 flex-col space-y-4 ">
        <AppPageShell
          title="Media Gallery"
          description="Manage your media files here"
          actionComponent={<></>}
        />

        <div className="space-y-3 h-full flex-1">
          <GalleryTabBar
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            onUseSelected={onUseSelected}
          />

          <div className="my-3 h-full flex-1 pb-4">
            {currentTab === "upload" && (
              <UploadTab
                currentTab={currentTab}
                setCurrentTab={setCurrentTab}
              />
            )}
            {currentTab === "library" && <LibraryTab />}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
