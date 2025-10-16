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
  insertLeadSchema,
  leadsQueryParamsSchema,
  leadsExportQueryParamsSchema,
  selectLeadSchema
} from "@/lib/zod/leads.zod";

const tags: string[] = ["Leads"];

// List all leads route definition
export const list = createRoute({
  tags,
  summary: "List all Leads",
  path: "/",
  method: "get",
  request: {
    query: leadsQueryParamsSchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(selectLeadSchema)),
      "List all leads with associated perk data"
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

// Get lead by id route definition
export const getOne = createRoute({
  tags,
  summary: "Get single lead",
  path: "/:id",
  method: "get",
  request: {
    params: stringIdParamSchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectLeadSchema,
      "The lead item with associated perk data"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Lead not found"
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      errorMessageSchema,
      "Invalid/Bad request data"
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

// Create lead route definition
export const create = createRoute({
  tags,
  summary: "Submit a new lead",
  path: "/",
  method: "post",
  request: {
    body: jsonContentRequired(insertLeadSchema, "New lead request body payload")
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      selectLeadSchema,
      "The created lead with populated fields"
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

export const remove = createRoute({
  tags,
  summary: "Delete a lead",
  path: "/:id",
  method: "delete",
  request: {
    params: stringIdParamSchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      errorMessageSchema,
      "Lead successfully deleted"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Lead not found"
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

// Export leads as CSV route definition
export const exportCsv = createRoute({
  tags,
  summary: "Export leads as CSV",
  path: "/export",
  method: "get",
  request: {
    query: leadsExportQueryParamsSchema
  },
  responses: {
    [HttpStatusCodes.OK]: {
      content: {
        "text/csv": {
          schema: {
            type: "string",
            format: "binary"
          }
        }
      },
      description: "CSV file containing leads data"
    },
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

// Route type definitions for handler injection
export type ListLeadsRoute = typeof list;
export type GetOneLeadRoute = typeof getOne;
export type CreateLeadRoute = typeof create;
export type DeleteLeadRoute = typeof remove;
export type ExportCsvRoute = typeof exportCsv;
