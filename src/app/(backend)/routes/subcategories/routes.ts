import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { z } from "zod";

import {
  errorMessageSchema,
  getPaginatedSchema,
  queryParamsSchema,
  stringIdParamSchema
} from "@/lib/server/helpers";
import {
  createSubcategorySchema,
  selectSubcategorySchema,
  updateSubcategorySchema
} from "@/lib/zod/categories.zod";
import { reorderItemsSchema } from "@/lib/helpers";

const tags: string[] = ["Subcategories"];

// List all subcategories route definition
export const list = createRoute({
  tags,
  summary: "List all subcategories",
  path: "/",
  method: "get",
  request: {
    query: queryParamsSchema.extend({
      categoryId: z.string().optional()
    })
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(selectSubcategorySchema)),
      "List of subcategories with pagination and populated parent category"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Internal server error"
    )
  }
});

// Get subcategory by ID route definition
export const getById = createRoute({
  tags,
  summary: "Get subcategory by ID",
  path: "/:id",
  method: "get",
  request: {
    params: stringIdParamSchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectSubcategorySchema,
      "The subcategory item with populated fields"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Subcategory not found"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Internal server error"
    )
  }
});

// Create subcategory route definition
export const create = createRoute({
  tags,
  summary: "Create a new subcategory",
  path: "/",
  method: "post",
  request: {
    body: jsonContentRequired(
      createSubcategorySchema,
      "New subcategory request body payload"
    )
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      selectSubcategorySchema,
      "The created subcategory with populated parent category"
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      errorMessageSchema,
      "Invalid request payload"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Parent category not found"
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

// Update subcategory route definition
export const update = createRoute({
  tags,
  summary: "Update an existing subcategory",
  path: "/:id",
  method: "put",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(
      updateSubcategorySchema,
      "Update subcategory request body payload"
    )
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectSubcategorySchema,
      "The updated subcategory with populated parent category"
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      errorMessageSchema,
      "Invalid request payload"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Subcategory not found"
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

// Delete subcategory route definition
export const remove = createRoute({
  tags,
  summary: "Delete a subcategory",
  path: "/:id",
  method: "delete",
  request: {
    params: stringIdParamSchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      errorMessageSchema,
      "Subcategory successfully deleted"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Subcategory not found"
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

// Reorder subcategories route definition
export const reorder = createRoute({
  tags,
  summary: "Reorder subcategories",
  method: "patch",
  path: "/reorder",
  request: {
    body: jsonContentRequired(reorderItemsSchema, "Reorder subcategory items")
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      errorMessageSchema,
      "Subcategories reordered successfully"
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
      "Failed to reorder subcategory items"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Subcategory not found"
    )
  }
});

// Route Type Definitions
export type ListSubcategoriesRoute = typeof list;
export type GetSubcategoryByIdRoute = typeof getById;
export type CreateSubcategoryRoute = typeof create;
export type UpdateSubcategoryRoute = typeof update;
export type DeleteSubcategoryRoute = typeof remove;
export type ReorderSubcategoriesRoute = typeof reorder;
