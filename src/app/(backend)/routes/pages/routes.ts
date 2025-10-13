/*

1. Pages Group
    - Get single page by id/slug [Route ✅] [Handler ✅]
    - Create a new page     [Route ✅] [Handler ✅]
    - Update a page by id   [Route ✅] [Handler ✅]
    - Delete a page by id   [Route ✅] [Handler ✅]

2. Sections Group
    - List all sections by page id/slug   [Route ✅] [Handler ✅]
    - Create a new section   [Route ✅] [Handler ✅]
    - Update a section by id   [Route ✅] [Handler ✅]
    - Delete a section by id  [Route ✅] [Handler ✅]
    - Reorder sections    [Route ✅] [Handler ✅]

3. Content Fields Group
    - List all content fields by page id / section id
    - Create a new content field
    - Update a content field by id
    - Delete a content field by id

*/

import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { z } from "zod";

import { errorMessageSchema, stringIdParamSchema } from "@/lib/server/helpers";
import {
  pagesCreateSchema,
  pagesSelectSchema,
  pagesUpdateSchema,
  sectionsCreateSchema,
  sectionsSelectSchema,
  sectionsUpdateSchema
} from "@/lib/zod/pages.zod";
import { reorderItemsSchema } from "@/lib/helpers";

// ====================== Pages Group ==============================
const pages_tags: string[] = ["Pages"];

// Get single post query schema (by id or slug)
const getSinglePageQuerySchema = z
  .object({
    id: z.string().optional(),
    slug: z.string().optional()
  })
  .refine((data) => data.id || data.slug, {
    message: "Either id or slug must be provided"
  });

// ---- #1 - Get single page by id/slug route ----
export const getPage = createRoute({
  tags: pages_tags,
  summary: "Get single page by ID / slug",
  path: "/",
  method: "get",
  request: {
    query: getSinglePageQuerySchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(pagesSelectSchema, "The single page"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Page not found"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Internal server error"
    )
  }
});

// ---- #2 - Create new page route ----
export const createPage = createRoute({
  tags: pages_tags,
  summary: "Create a new page",
  path: "/",
  method: "post",
  request: {
    body: jsonContentRequired(
      pagesCreateSchema,
      "Page data to create a new page"
    )
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      pagesSelectSchema,
      "The newly created page"
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      errorMessageSchema,
      "Invalid request data"
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

// ---- #3 - Update page by id route ----
export const updatePage = createRoute({
  tags: pages_tags,
  summary: "Update an existing page by ID",
  path: "/:id",
  method: "put",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(pagesUpdateSchema, "Page data to update the page")
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(pagesSelectSchema, "The updated page"),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      errorMessageSchema,
      "Invalid request data"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Page not found"
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

// ---- #4 - Delete page by id route ----
export const deletePage = createRoute({
  tags: pages_tags,
  summary: "Delete an existing page by ID",
  path: "/:id",
  method: "delete",
  request: {
    params: stringIdParamSchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(errorMessageSchema, "The deleted page"),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      errorMessageSchema,
      "Invalid request data"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Page not found"
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

// ---- Pages Routes Type Definitions ----
export type GetPageRouteT = typeof getPage;
export type CreatePageRouteT = typeof createPage;
export type UpdatePageRouteT = typeof updatePage;
export type DeletePageRouteT = typeof deletePage;
// ================================================================

// ====================== Sections Group ============================
export const getSectionsByPage = createRoute({
  tags: pages_tags,
  summary: "Get sections by page ID",
  path: "/:id/sections",
  method: "get",
  request: {
    params: stringIdParamSchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(sectionsSelectSchema),
      "All sections related to page"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Page does not exists"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Internal server error"
    )
  }
});

export const createSection = createRoute({
  tags: pages_tags,
  summary: "Create new section",
  path: "/:id/sections",
  method: "post",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(
      sectionsCreateSchema.omit({ pageId: true }),
      "Section create body"
    )
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      sectionsSelectSchema,
      "The newly created section"
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      errorMessageSchema,
      "Invalid request data"
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

export const updateSection = createRoute({
  tags: pages_tags,
  summary: "Update section",
  path: "/:id/sections/:sectionId",
  method: "put",
  request: {
    params: stringIdParamSchema.extend({
      sectionId: z.string().min(1, "Section ID is required")
    }),
    body: jsonContentRequired(
      sectionsUpdateSchema.omit({ pageId: true }),
      "Section update body"
    )
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      sectionsSelectSchema,
      "The updated section"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Section not found"
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

export const deleteSection = createRoute({
  tags: pages_tags,
  summary: "Delete section by ID",
  path: "/:id/sections/:sectionId",
  method: "delete",
  request: {
    params: stringIdParamSchema.extend({
      sectionId: z.string().min(1, "Section ID is required")
    })
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      errorMessageSchema,
      "The section deleted"
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      errorMessageSchema,
      "Invalid request data"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Section not found"
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

// Reorder sections route definition
export const reorderSections = createRoute({
  tags: pages_tags,
  summary: "Reorder sections",
  method: "patch",
  path: "/:id/sections/reorder",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(reorderItemsSchema, "Reorder sections")
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      errorMessageSchema, // For send success message
      "Page sections reordered successfully"
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
      "Failed to reorder section items"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Page not found"
    )
  }
});

// ---- Type Definitions ----
export type GetSectionsByPageRouteT = typeof getSectionsByPage;
export type CreateSectionRouteT = typeof createSection;
export type UpdateSectionRouteT = typeof updateSection;
export type DeleteSectionRouteT = typeof deleteSection;
export type ReorderSectionsRouteT = typeof reorderSections;
