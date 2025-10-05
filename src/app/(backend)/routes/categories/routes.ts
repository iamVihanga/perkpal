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
  createCategorySchema,
  selectCategorySchema,
  updateCategorySchema
} from "@/lib/zod/categories.zod";
import { reorderItemsSchema } from "@/lib/helpers";

const tags: string[] = ["Categories"];

// List all categories route definition
export const list = createRoute({
  tags,
  summary: "List all categories",
  path: "/",
  method: "get",
  request: {
    query: queryParamsSchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(selectCategorySchema)),
      "List of categories with pagination and populated subcategories"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Internal server error"
    )
  }
});

// Get category by ID route definition
export const getById = createRoute({
  tags,
  summary: "Get category by ID",
  path: "/:id",
  method: "get",
  request: {
    params: stringIdParamSchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectCategorySchema,
      "The category item with populated subcategories"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Category not found"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Internal server error"
    )
  }
});

// Create category route definition
export const create = createRoute({
  tags,
  summary: "Create a new category",
  path: "/",
  method: "post",
  request: {
    body: jsonContentRequired(
      createCategorySchema,
      "New category request body payload"
    )
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      selectCategorySchema,
      "The created category with populated subcategories"
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      errorMessageSchema,
      "Invalid request payload"
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

// Update category route definition
export const update = createRoute({
  tags,
  summary: "Update an existing category",
  path: "/:id",
  method: "put",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(
      updateCategorySchema,
      "Update category request body payload"
    )
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectCategorySchema,
      "The updated category with populated subcategories"
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      errorMessageSchema,
      "Invalid request payload"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Category not found"
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

// Delete category route definition
export const remove = createRoute({
  tags,
  summary: "Delete a category",
  path: "/:id",
  method: "delete",
  request: {
    params: stringIdParamSchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      errorMessageSchema, // For send error message
      "Category successfully deleted"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Category not found"
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

// Reorder categories route definition
export const reorder = createRoute({
  tags,
  summary: "Reorder categories",
  method: "patch",
  path: "/reorder",
  request: {
    body: jsonContentRequired(reorderItemsSchema, "Reorder education items")
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      errorMessageSchema, // For send success message
      "Categories reordered successfully"
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
      "Failed to reorder education items"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Category not found"
    )
  }
});

// Route Type Definitions
export type ListCategoriesRoute = typeof list;
export type GetCategoryByIdRoute = typeof getById;
export type CreateCategoryRoute = typeof create;
export type UpdateCategoryRoute = typeof update;
export type DeleteCategoryRoute = typeof remove;
export type ReorderCategoriesRoute = typeof reorder;
