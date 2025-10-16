import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import { count, eq, desc, and, gte, lte } from "drizzle-orm";

import { AppRouteHandler } from "@/lib/types/server";
import { db } from "@/database";
import { perks, leads } from "@/database/schema";

import {
  GetDashboardMetricsRoute,
  GetRecentSubmissionsRoute,
  GetPerformanceTrendsRoute
} from "./routes";

// Get dashboard metrics handler
export const getDashboardMetrics: AppRouteHandler<
  GetDashboardMetricsRoute
> = async (c) => {
  try {
    const session = c.get("session");
    const user = c.get("user");

    if (!session || !user) {
      return c.json(
        { message: HttpStatusPhrases.UNAUTHORIZED },
        HttpStatusCodes.UNAUTHORIZED
      );
    }

    // Check user role - only admin and contentEditor can access analytics
    if (user.role !== "admin" && user.role !== "contentEditor") {
      return c.json(
        { message: HttpStatusPhrases.FORBIDDEN },
        HttpStatusCodes.FORBIDDEN
      );
    }

    const { dateFrom, dateTo, period } = c.req.valid("query");

    // Calculate date range based on period
    const endDate = dateTo ? new Date(dateTo) : new Date();
    let startDate: Date;

    if (dateFrom) {
      startDate = new Date(dateFrom);
    } else {
      switch (period) {
        case "7d":
          startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "30d":
          startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
          break;
        case "90d":
          startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
          break;
        case "1y":
          startDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      }
    }

    // Get previous period for comparison
    const periodDuration = endDate.getTime() - startDate.getTime();
    const previousStartDate = new Date(startDate.getTime() - periodDuration);
    const previousEndDate = new Date(startDate.getTime());

    // 1. Total Active Deals
    const [activeDealsResult] = await db
      .select({ count: count() })
      .from(perks)
      .where(eq(perks.status, "active"));

    // 2. Leads Collected (current period)
    const [currentLeadsResult] = await db
      .select({ count: count() })
      .from(leads)
      .where(
        and(gte(leads.createdAt, startDate), lte(leads.createdAt, endDate))
      );

    // 3. Leads Collected (previous period for comparison)
    const [previousLeadsResult] = await db
      .select({ count: count() })
      .from(leads)
      .where(
        and(
          gte(leads.createdAt, previousStartDate),
          lte(leads.createdAt, previousEndDate)
        )
      );

    // 4. Top Performing Perks
    const topPerformingPerks = await db
      .select({
        id: perks.id,
        title: perks.title,
        slug: perks.slug,
        leadCount: count(leads.id)
      })
      .from(perks)
      .leftJoin(leads, eq(perks.id, leads.perkId))
      .where(
        and(
          eq(perks.status, "active"),
          gte(leads.createdAt, startDate),
          lte(leads.createdAt, endDate)
        )
      )
      .groupBy(perks.id, perks.title, perks.slug)
      .orderBy(desc(count(leads.id)))
      .limit(5);

    // 5. Calculate conversion rates (assuming form submission perks convert)
    const [totalFormPerks] = await db
      .select({ count: count() })
      .from(perks)
      .where(
        and(
          eq(perks.status, "active"),
          eq(perks.redemptionMethod, "form_submission")
        )
      );

    const totalActiveDeals = activeDealsResult.count;
    const currentLeads = currentLeadsResult.count;
    const previousLeads = previousLeadsResult.count;

    // Calculate trends and changes
    const leadsChange =
      previousLeads > 0
        ? ((currentLeads - previousLeads) / previousLeads) * 100
        : currentLeads > 0
        ? 100
        : 0;

    const leadsMap = topPerformingPerks.map((perk) => ({
      ...perk,
      conversionRate:
        totalFormPerks.count > 0
          ? (perk.leadCount / totalFormPerks.count) * 100
          : 0
    }));

    const avgConversionRate =
      leadsMap.length > 0
        ? leadsMap.reduce((sum, perk) => sum + perk.conversionRate, 0) /
          leadsMap.length
        : 0;

    // Calculate trend based on change value
    const leadsTrend: "up" | "down" | "neutral" =
      leadsChange > 0 ? "up" : leadsChange < 0 ? "down" : "neutral";

    const response = {
      totalActiveDeals: {
        count: totalActiveDeals,
        change: 0, // You could implement previous period comparison here
        trend: "neutral" as const
      },
      leadsCollected: {
        count: currentLeads,
        change: Math.round(leadsChange * 100) / 100,
        trend: leadsTrend,
        period: period || "30d"
      },
      topPerformingPerks: leadsMap,
      averageConversionRate: {
        rate: Math.round(avgConversionRate * 100) / 100,
        change: 0, // You could implement previous period comparison here
        trend: "neutral" as const
      }
    };

    return c.json(response, HttpStatusCodes.OK);
  } catch (error) {
    return c.json(
      {
        message:
          (error as Error).message || HttpStatusPhrases.INTERNAL_SERVER_ERROR
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

// Get recent submissions handler
export const getRecentSubmissions: AppRouteHandler<
  GetRecentSubmissionsRoute
> = async (c) => {
  try {
    const session = c.get("session");
    const user = c.get("user");

    if (!session || !user) {
      return c.json(
        { message: HttpStatusPhrases.UNAUTHORIZED },
        HttpStatusCodes.UNAUTHORIZED
      );
    }

    if (user.role !== "admin" && user.role !== "contentEditor") {
      return c.json(
        { message: HttpStatusPhrases.FORBIDDEN },
        HttpStatusCodes.FORBIDDEN
      );
    }

    const { limit = "10" } = c.req.valid("query");
    const limitNum = Math.min(50, parseInt(limit)); // Cap at 50

    const recentSubmissions = await db
      .select({
        id: leads.id,
        perkTitle: perks.title,
        perkSlug: perks.slug,
        submittedAt: leads.createdAt,
        data: leads.data
      })
      .from(leads)
      .innerJoin(perks, eq(leads.perkId, perks.id))
      .orderBy(desc(leads.createdAt))
      .limit(limitNum);

    // Filter out entries with null data and format dates
    const formattedSubmissions = recentSubmissions
      .filter((submission) => submission.data !== null)
      .map((submission) => ({
        id: submission.id,
        perkTitle: submission.perkTitle,
        perkSlug: submission.perkSlug,
        submittedAt: submission.submittedAt!.toISOString(),
        data: submission.data!
      }));

    return c.json(formattedSubmissions, HttpStatusCodes.OK);
  } catch (error) {
    return c.json(
      {
        message:
          (error as Error).message || HttpStatusPhrases.INTERNAL_SERVER_ERROR
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

// Get performance trends handler
export const getPerformanceTrends: AppRouteHandler<
  GetPerformanceTrendsRoute
> = async (c) => {
  try {
    const session = c.get("session");
    const user = c.get("user");

    if (!session || !user) {
      return c.json(
        { message: HttpStatusPhrases.UNAUTHORIZED },
        HttpStatusCodes.UNAUTHORIZED
      );
    }

    if (user.role !== "admin" && user.role !== "contentEditor") {
      return c.json(
        { message: HttpStatusPhrases.FORBIDDEN },
        HttpStatusCodes.FORBIDDEN
      );
    }

    // For now, return mock data. You can implement actual aggregation queries
    // const { dateFrom, dateTo, period } = c.req.valid("query");

    const response = {
      daily: [],
      weekly: [],
      monthly: []
    };

    return c.json(response, HttpStatusCodes.OK);
  } catch (error) {
    return c.json(
      {
        message:
          (error as Error).message || HttpStatusPhrases.INTERNAL_SERVER_ERROR
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};
