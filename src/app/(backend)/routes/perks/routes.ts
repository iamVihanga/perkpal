import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { z } from "zod";

import { errorMessageSchema, getPaginatedSchema } from "@/lib/server/helpers";
import { selectPerkSchema, perksQueryParamsSchema } from "@/lib/zod/perks.zod";

const tags: string[] = ["Perks"];

// List all perks route definition
export const list = createRoute({
  tags,
  summary: "List all perks",
  path: "/",
  method: "get",
  request: {
    query: perksQueryParamsSchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(selectPerkSchema)),
      "List of perks with pagination and other populated fields"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Internal server error"
    )
  }
});

// Route Type Definitions
export type ListPerksRouteT = typeof list;
