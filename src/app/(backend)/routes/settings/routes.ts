import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";

import { errorMessageSchema } from "@/lib/server/helpers";
import { siteSettingsMap, siteSettingsMapInsert } from "@/lib/zod/settings.zod";

const tags: string[] = ["Site Settings"];

// List route definition
export const getSettingsRoute = createRoute({
  tags,
  summary: "Get site settings",
  path: "/",
  method: "get",
  responses: {
    [HttpStatusCodes.OK]: jsonContent(siteSettingsMap, "All Site Settings"),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Something Went Wrong !"
    )
  }
});

// Create Media route Definition
export const upsertSiteSettingsRoute = createRoute({
  tags,
  summary: "Upsert Site Settings",
  method: "post",
  path: "/",
  request: {
    body: jsonContentRequired(siteSettingsMapInsert, "Upsert Site Settings")
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(siteSettingsMap, "Updated Site Settings"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    )
  }
});

// Export types
export type GetSiteSettingsRoute = typeof getSettingsRoute;
export type UpsertSiteSettingsRoute = typeof upsertSiteSettingsRoute;
