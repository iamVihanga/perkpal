import { createRoute } from "@hono/zod-openapi";
import { z } from "zod";
import * as HttpStatusCodes from "stoker/http-status-codes";

import { jsonContent } from "stoker/openapi/helpers";

import { errorMessageSchema } from "@/lib/server/helpers";

import {
  analyticsQueryParamsSchema,
  dashboardMetricsSchema,
  recentSubmissionsSchema,
  performanceTrendsSchema
} from "@/lib/zod/analytics.zod";

const tags = ["Analytics"];

// Dashboard overview metrics route
export const getDashboardMetrics = createRoute({
  tags,
  summary: "Get dashboard overview metrics",
  path: "/dashboard",
  method: "get",
  request: {
    query: analyticsQueryParamsSchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      dashboardMetricsSchema,
      "Dashboard metrics including active deals, leads, top perks, and conversion rates"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      errorMessageSchema,
      "Forbidden access"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Internal server error"
    )
  }
});

// Recent submissions route
export const getRecentSubmissions = createRoute({
  tags,
  summary: "Get recent lead submissions",
  path: "/recent-submissions",
  method: "get",
  request: {
    query: z.object({
      limit: z.string().optional().default("10")
    })
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      recentSubmissionsSchema,
      "Recent lead submissions with perk details"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      errorMessageSchema,
      "Forbidden access"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Internal server error"
    )
  }
});

// Performance trends route
export const getPerformanceTrends = createRoute({
  tags,
  summary: "Get performance trends data",
  path: "/trends",
  method: "get",
  request: {
    query: analyticsQueryParamsSchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      performanceTrendsSchema,
      "Performance trends data for charts and graphs"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      errorMessageSchema,
      "Forbidden access"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Internal server error"
    )
  }
});

// Route types for handlers
export type GetDashboardMetricsRoute = typeof getDashboardMetrics;
export type GetRecentSubmissionsRoute = typeof getRecentSubmissions;
export type GetPerformanceTrendsRoute = typeof getPerformanceTrends;
