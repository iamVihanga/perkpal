"use client";

import React from "react";
import { Loader } from "lucide-react";

import type { ViewType } from "../types";
import { useGetSettings } from "../queries/use-get-settings";

import { GeneralSettingsForm } from "./forms/general-form";
import { SEOSettingsForm } from "./forms/seo-form";
import { AnalyticsSettingsForm } from "./forms/analytics-form";
import { RobotsSettingsForm } from "./forms/robots-form";
import { SitemapSettingsForm } from "./forms/sitemap-form";

interface TabBarProps {
  tab: ViewType;
}

export function SettingsTabView({ tab }: TabBarProps) {
  const { data, isFetching, error } = useGetSettings();

  if (isFetching) {
    return (
      <div className="w-full h-full flex-1 flex items-center justify-center">
        <Loader className="size-6 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex-1 flex items-center justify-center">
        <p className="text-destructive">
          Failed to load settings: {error.message}
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full h-full flex-1 flex items-center justify-center">
        <p className="text-muted-foreground">No settings data available</p>
      </div>
    );
  }

  // At this point, data is guaranteed to be defined
  const settingsData = data;

  if (tab === "general")
    return <GeneralSettingsForm initialData={settingsData} />;
  if (tab === "seo") return <SEOSettingsForm initialData={settingsData} />;
  if (tab === "analytics")
    return <AnalyticsSettingsForm initialData={settingsData} />;
  if (tab === "robots")
    return <RobotsSettingsForm initialData={settingsData} />;
  if (tab === "sitemap")
    return <SitemapSettingsForm initialData={settingsData} />;

  return <div>SettingsTabView</div>;
}
