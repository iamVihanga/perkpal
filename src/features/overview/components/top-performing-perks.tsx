"use client";

import { TrendingUp, ExternalLink } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

import { useGetDashboardMetrics } from "../queries/use-get-dashboard-metrics";
import { DashboardMetricsT } from "@/lib/zod/analytics.zod";
import Link from "next/link";

interface TopPerformingPerksProps {
  period?: "7d" | "30d" | "90d" | "1y";
  dateFrom?: string;
  dateTo?: string;
}

export function TopPerformingPerks({
  period = "30d",
  dateFrom,
  dateTo
}: TopPerformingPerksProps) {
  const { data, isLoading, error } = useGetDashboardMetrics({
    period,
    dateFrom,
    dateTo
  });

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Perks</CardTitle>
          <CardDescription className="text-destructive">
            Failed to load performance data: {error.message}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Perks</CardTitle>
          <CardDescription>Loading performance data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="animate-pulse bg-muted h-4 w-3/4 rounded" />
                  <div className="animate-pulse bg-muted h-6 w-16 rounded" />
                </div>
                <div className="animate-pulse bg-muted h-2 w-full rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const topPerks = data?.topPerformingPerks || [];
  const maxLeads = Math.max(
    ...topPerks.map(
      (perk: DashboardMetricsT["topPerformingPerks"][number]) => perk.leadCount
    ),
    1
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Top Performing Perks
        </CardTitle>
        <CardDescription>
          Perks generating the most leads this{" "}
          {period === "7d"
            ? "week"
            : period === "30d"
            ? "month"
            : period === "90d"
            ? "quarter"
            : "year"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {topPerks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No performance data available for this period
          </div>
        ) : (
          <div className="space-y-4">
            {topPerks.map(
              (
                perk: DashboardMetricsT["topPerformingPerks"][number],
                index: number
              ) => (
                <div key={perk.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <Badge variant="outline" className="text-xs font-mono">
                        #{index + 1}
                      </Badge>
                      <span className="font-medium truncate text-sm">
                        {perk.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-sm font-medium">
                        {perk.leadCount} leads
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        asChild
                      >
                        <a
                          href={`/dashboard/perks/${perk.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-3 w-3" />
                          <span className="sr-only">View perk details</span>
                        </a>
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress
                      value={(perk.leadCount / maxLeads) * 100}
                      className="flex-1 h-2"
                    />
                    <span className="text-xs text-muted-foreground min-w-fit">
                      {perk.conversionRate.toFixed(1)}% CVR
                    </span>
                  </div>
                </div>
              )
            )}
          </div>
        )}
        {topPerks.length > 0 && (
          <div className="mt-6 text-center">
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/perks">View all perks</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
