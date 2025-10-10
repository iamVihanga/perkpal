import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { z } from "zod";

import {
  errorMessageSchema,
  getPaginatedSchema,
  stringIdParamSchema
} from "@/lib/server/helpers";
import {
  selectPerkSchema,
  perksQueryParamsSchema,
  getSinglePerkQuerySchema,
  createPerkSchema
} from "@/lib/zod/perks.zod";
import { reorderItemsSchema } from "@/lib/helpers";

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

// Get perk by id route definition
export const getOne = createRoute({
  tags,
  summary: "Get single perk",
  path: "/get-one",
  method: "get",
  request: {
    query: getSinglePerkQuerySchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectPerkSchema,
      "The perk item with populated fields"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Perk not found"
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      errorMessageSchema,
      "Invalid request (ID/Slug missing)"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Internal server error"
    )
  }
});

// Create perk route definition
export const create = createRoute({
  tags,
  summary: "Create a new perk",
  path: "/",
  method: "post",
  request: {
    body: jsonContentRequired(createPerkSchema, "New perk request body payload")
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      selectPerkSchema,
      "The created perk with populated fields"
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      errorMessageSchema,
      "Invalid request payload"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Internal server error"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized access"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(
      errorMessageSchema,
      "Forbidden access"
    )
  }
});

// Delete perks route definition
export const remove = createRoute({
  tags,
  summary: "Delete a perk",
  path: "/:id",
  method: "delete",
  request: {
    params: stringIdParamSchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      errorMessageSchema,
      "Perk successfully deleted"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Perk not found"
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

export const reorder = createRoute({
  tags,
  summary: "Reorder perks",
  method: "patch",
  path: "/reorder",
  request: {
    body: jsonContentRequired(reorderItemsSchema, "Reorder perks")
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      errorMessageSchema, // For send success message
      "Perks reordered successfully"
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
      "Failed to reorder perks"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Perks not found"
    )
  }
});

// Route Type Definitions
export type ListPerksRouteT = typeof list;
export type GetPerkRouteT = typeof getOne;
export type CreatePerkRouteT = typeof create;
export type ReorderPerksRouteT = typeof reorder;
export type RemovePerksRouteT = typeof remove;
