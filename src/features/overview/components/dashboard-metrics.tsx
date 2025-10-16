"use client";

import { useGetDashboardMetrics } from "../queries/use-get-dashboard-metrics";
import { MetricCard } from "./metric-card";

interface DashboardMetricsProps {
  period?: "7d" | "30d" | "90d" | "1y";
  dateFrom?: string;
  dateTo?: string;
}

export function DashboardMetrics({
  period = "30d",
  dateFrom,
  dateTo
}: DashboardMetricsProps) {
  const { data, isLoading, error } = useGetDashboardMetrics({
    period,
    dateFrom,
    dateTo
  });

  if (error) {
    return (
      <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        <div className="col-span-full text-center py-8 text-destructive">
          Failed to load dashboard metrics: {error.message}
        </div>
      </div>
    );
  }

  const getPeriodLabel = (periodValue: string) => {
    switch (periodValue) {
      case "7d":
        return "week";
      case "30d":
        return "month";
      case "90d":
        return "quarter";
      case "1y":
        return "year";
      default:
        return "period";
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4  sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Total Active Deals"
        value={data?.totalActiveDeals.count ?? 0}
        change={data?.totalActiveDeals.change ?? 0}
        trend={data?.totalActiveDeals.trend ?? "neutral"}
        description="Currently active perk deals available to users"
        isLoading={isLoading}
      />

      <MetricCard
        title="Leads Collected"
        value={data?.leadsCollected.count ?? 0}
        change={data?.leadsCollected.change ?? 0}
        trend={data?.leadsCollected.trend ?? "neutral"}
        period={getPeriodLabel(data?.leadsCollected.period ?? period)}
        description="New lead submissions from perk forms"
        isLoading={isLoading}
      />

      <MetricCard
        title="Avg Conversion Rate"
        value={
          data?.averageConversionRate.rate
            ? `${data.averageConversionRate.rate.toFixed(1)}%`
            : "0%"
        }
        change={data?.averageConversionRate.change ?? 0}
        trend={data?.averageConversionRate.trend ?? "neutral"}
        description="Average conversion rate across all form-based perks"
        isLoading={isLoading}
      />

      <MetricCard
        title="Top Performing Perks"
        value={data?.topPerformingPerks.length ?? 0}
        change={0}
        trend="neutral"
        description="Number of perks generating leads this period"
        isLoading={isLoading}
      />
    </div>
  );
}
