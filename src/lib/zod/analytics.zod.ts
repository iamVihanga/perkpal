import { z } from "zod";

// Analytics query parameters schema
export const analyticsQueryParamsSchema = z.object({
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  period: z.enum(["7d", "30d", "90d", "1y"]).optional().default("30d")
});

export type AnalyticsQueryParamsT = z.infer<typeof analyticsQueryParamsSchema>;

// Optional version for client-side usage
export type OptionalAnalyticsQueryParamsT = {
  dateFrom?: string;
  dateTo?: string;
  period?: "7d" | "30d" | "90d" | "1y";
};

// Dashboard metrics response schema
export const dashboardMetricsSchema = z.object({
  totalActiveDeals: z.object({
    count: z.number(),
    change: z.number(),
    trend: z.enum(["up", "down", "neutral"])
  }),
  leadsCollected: z.object({
    count: z.number(),
    change: z.number(),
    trend: z.enum(["up", "down", "neutral"]),
    period: z.string()
  }),
  topPerformingPerks: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      slug: z.string(),
      leadCount: z.number(),
      conversionRate: z.number()
    })
  ),
  averageConversionRate: z.object({
    rate: z.number(),
    change: z.number(),
    trend: z.enum(["up", "down", "neutral"])
  })
});

export type DashboardMetricsT = z.infer<typeof dashboardMetricsSchema>;

// Recent submissions schema
export const recentSubmissionsSchema = z.array(
  z.object({
    id: z.string(),
    perkTitle: z.string(),
    perkSlug: z.string(),
    submittedAt: z.string(),
    data: z.record(
      z.string(),
      z.union([z.string(), z.array(z.string()), z.boolean()])
    )
  })
);

export type RecentSubmissionsT = z.infer<typeof recentSubmissionsSchema>;

// Performance trends schema
export const performanceTrendsSchema = z.object({
  daily: z.array(
    z.object({
      date: z.string(),
      leads: z.number(),
      conversions: z.number()
    })
  ),
  weekly: z.array(
    z.object({
      week: z.string(),
      leads: z.number(),
      conversions: z.number()
    })
  ),
  monthly: z.array(
    z.object({
      month: z.string(),
      leads: z.number(),
      conversions: z.number()
    })
  )
});

export type PerformanceTrendsT = z.infer<typeof performanceTrendsSchema>;
