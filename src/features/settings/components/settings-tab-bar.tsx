"use client";
import React from "react";
import {
  BotIcon,
  GlobeIcon,
  NetworkIcon,
  SettingsIcon,
  TrendingUpIcon
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { ViewType } from "../types";

interface TabBarProps {
  tab: ViewType;
  setTab: React.Dispatch<React.SetStateAction<ViewType>>;
}

export function SettingsTabBar({ tab, setTab }: TabBarProps) {
  return (
    <nav className="border-y border-secondary/90 dark:border-secondary-foreground/10 flex items-center justify-between bg-transparent w-full h-12">
      <div className="flex items-center gap-3 h-full">
        <Button
          variant={"ghost"}
          className={cn(
            `px-4 h-full rounded-none hover:bg-secondary/30 cursor-pointer`,
            tab === "general" && "border-b-2 border-primary"
          )}
          onClick={() => setTab("general")}
        >
          <span
            className={`${
              tab === "general" ? "text-primary" : "text-primary/60"
            } flex items-center gap-3`}
          >
            <SettingsIcon className="size-4" />
            General
          </span>
        </Button>
        <Button
          variant={"ghost"}
          className={cn(
            `px-4 h-full rounded-none hover:bg-secondary/30 cursor-pointer`,
            tab === "seo" && "border-b-2 border-primary"
          )}
          onClick={() => setTab("seo")}
        >
          <span
            className={`${
              tab === "seo" ? "text-primary" : "text-primary/60"
            } flex items-center gap-3`}
          >
            <GlobeIcon className="size-4" />
            SEO
          </span>
        </Button>
        <Button
          variant={"ghost"}
          className={cn(
            `px-4 h-full rounded-none hover:bg-secondary/30 cursor-pointer`,
            tab === "analytics" && "border-b-2 border-primary"
          )}
          onClick={() => setTab("analytics")}
        >
          <span
            className={`${
              tab === "analytics" ? "text-primary" : "text-primary/60"
            } flex items-center gap-3`}
          >
            <TrendingUpIcon className="size-4" />
            Analytics
          </span>
        </Button>
        <Button
          variant={"ghost"}
          className={cn(
            `px-4 h-full rounded-none hover:bg-secondary/30 cursor-pointer`,
            tab === "robots" && "border-b-2 border-primary"
          )}
          onClick={() => setTab("robots")}
        >
          <span
            className={`${
              tab === "robots" ? "text-primary" : "text-primary/60"
            } flex items-center gap-3`}
          >
            <BotIcon className="size-4" />
            Robots
          </span>
        </Button>
        <Button
          variant={"ghost"}
          className={cn(
            `px-4 h-full rounded-none hover:bg-secondary/30 cursor-pointer`,
            tab === "sitemap" && "border-b-2 border-primary"
          )}
          onClick={() => setTab("sitemap")}
        >
          <span
            className={`${
              tab === "sitemap" ? "text-primary" : "text-primary/60"
            } flex items-center gap-3`}
          >
            <NetworkIcon className="size-4" />
            Sitemap
          </span>
        </Button>
      </div>
    </nav>
  );
}
