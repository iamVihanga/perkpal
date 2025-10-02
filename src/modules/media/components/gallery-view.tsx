"use client";

import { useState } from "react";

import PageContainer from "@/modules/layouts/page-container";
import { AppPageShell } from "@/modules/layouts/page-shell";
import { LibraryTab } from "./view-tabs/library-tab";
import { GalleryTabBar } from "./view-tabs/tab-bar";
import UploadTab from "./view-tabs/upload-tab";
// import UploadTab from "./view-tabs/upload-tab";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Media } from "../types";

export type ActiveTab = "upload" | "library";

export type onUseSelectedT = (selectedFiles: Media[]) => void;

type Props = {
  activeTab?: ActiveTab;
  onUseSelected?: onUseSelectedT;

  modal?: boolean;
  modalOpen?: boolean;
  setModalOpen?: (open: boolean) => void;
};

export default function GalleryView({
  activeTab,
  onUseSelected,

  modal = false,
  modalOpen,
  setModalOpen
}: Props) {
  const [currentTab, setCurrentTab] = useState<ActiveTab>(
    activeTab || "upload"
  );

  if (modal) {
    return (
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="w-full min-w-5xl h-full max-h-[95vh] p-4 sm:p-6">
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
        </DialogContent>
      </Dialog>
    );
  }

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
