import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";

import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import {
  createPostSchema,
  selectPostSchema,
  updatePostSchema
} from "@/lib/zod/journal.zod";
import {
  errorMessageSchema,
  getPaginatedSchema,
  queryParamsSchema,
  stringIdParamSchema
} from "@/lib/server/helpers";

const tags = ["Journal"];

// Get single post query schema (by id or slug)
const getSinglePostQuerySchema = z
  .object({
    id: z.string().optional(),
    slug: z.string().optional()
  })
  .refine((data) => data.id || data.slug, {
    message: "Either id or slug must be provided"
  });

// List all posts route definition
export const list = createRoute({
  tags,
  summary: "List all blog posts",
  path: "/",
  method: "get",
  request: {
    query: queryParamsSchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(selectPostSchema)),
      "List of blog posts with pagination and populated fields"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Internal server error"
    )
  }
});

// Get single post route definition
export const getOne = createRoute({
  tags,
  summary: "Get single blog post",
  path: "/get-one",
  method: "get",
  request: {
    query: getSinglePostQuerySchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectPostSchema,
      "The blog post with populated fields"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Blog post not found"
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

// Create post route definition
export const create = createRoute({
  tags,
  summary: "Create a new blog post",
  path: "/",
  method: "post",
  request: {
    body: jsonContentRequired(
      createPostSchema,
      "New blog post request body payload"
    )
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      selectPostSchema,
      "The created blog post with populated fields"
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      errorMessageSchema,
      "Invalid request payload"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Internal server error"
    )
  }
});

// Update post route definition
export const update = createRoute({
  tags,
  summary: "Update a blog post",
  path: "/:id",
  method: "patch",
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(
      updatePostSchema,
      "Update blog post request body payload"
    )
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectPostSchema,
      "The updated blog post with populated fields"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Blog post not found"
    ),
    [HttpStatusCodes.BAD_REQUEST]: jsonContent(
      errorMessageSchema,
      "Invalid request payload"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Internal server error"
    )
  }
});

// Delete post route definition
export const remove = createRoute({
  tags,
  summary: "Delete a blog post",
  path: "/:id",
  method: "delete",
  request: {
    params: stringIdParamSchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({ message: z.string() }),
      "Blog post deleted successfully"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Blog post not found"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Internal server error"
    )
  }
});

// Export route types for handlers
export type ListPostsRoute = typeof list;
export type GetOnePostRoute = typeof getOne;
export type CreatePostRoute = typeof create;
export type UpdatePostRoute = typeof update;
export type DeletePostRoute = typeof remove;
