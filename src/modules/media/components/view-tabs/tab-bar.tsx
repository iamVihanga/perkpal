"use client";

import React from "react";
import { ImagesIcon, UploadIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ActiveTab, onUseSelectedT } from "../gallery-view";
import { useMediaLibraryStore } from "../../store/library-store";

type Props = {
  currentTab: ActiveTab;
  setCurrentTab: React.Dispatch<React.SetStateAction<ActiveTab>>;
  onUseSelected?: onUseSelectedT;
};

export function GalleryTabBar({
  currentTab,
  setCurrentTab,
  onUseSelected
}: Props) {
  const { selectedFiles } = useMediaLibraryStore();

  return (
    <nav className="border-y border-secondary/90 flex items-center justify-between bg-transparent w-full h-12">
      <div className="flex items-center gap-3 h-full">
        {/* Upload selector */}
        <Button
          variant={"ghost"}
          className={cn(
            `px-4 h-full rounded-none hover:bg-secondary/30 cursor-pointer`,
            currentTab === "upload" && "border-b-2 border-primary"
          )}
          onClick={() => setCurrentTab("upload")}
        >
          <span
            className={`${
              currentTab === "upload" ? "text-primary" : "text-primary/60"
            } flex items-center gap-3`}
          >
            <UploadIcon className="size-4" />
            Upload Files
          </span>
        </Button>

        {/* Library selector */}
        <Button
          variant={"ghost"}
          className={cn(
            `px-4 h-full rounded-none hover:bg-secondary/30 cursor-pointer`,
            currentTab === "library" && "border-b-2 border-primary"
          )}
          onClick={() => setCurrentTab("library")}
        >
          <span
            className={`${
              currentTab === "library" ? "text-primary" : "text-primary/60"
            } flex items-center gap-3`}
          >
            <ImagesIcon className="size-4" />
            Media Library
          </span>
        </Button>
      </div>

      {currentTab === "library" && (
        <div className="">
          {selectedFiles.length > 0 && (
            <Button
              className="h-full rounded-none"
              onClick={() => onUseSelected?.(selectedFiles)}
            >
              Use Selected
            </Button>
          )}
        </div>
      )}
    </nav>
  );
}
