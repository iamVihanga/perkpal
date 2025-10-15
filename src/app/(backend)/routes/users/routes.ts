import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";

import { errorMessageSchema, stringIdParamSchema } from "@/lib/server/helpers";
import { selectUserSchema } from "@/features/user-management/schemas/select-user";
import { verifyUserSchema } from "@/features/user-management/schemas/verify-user";

const tags: string[] = ["Users"];

export const getById = createRoute({
  tags,
  summary: "Get User by ID",
  path: "/:id",
  method: "get",
  request: {
    params: stringIdParamSchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectUserSchema,
      "The selected user details"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "User not found"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(errorMessageSchema, "Forbidden"),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Internal server error"
    )
  }
});

export const verify = createRoute({
  tags,
  summary: "Verify User by ID",
  path: "/verify",
  method: "put",
  request: {
    body: jsonContentRequired(verifyUserSchema, "The user verification details")
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectUserSchema,
      "The updated user details"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "User not found"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthorized"
    ),
    [HttpStatusCodes.FORBIDDEN]: jsonContent(errorMessageSchema, "Forbidden"),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Internal server error"
    )
  }
});

export type GetByIdRouteT = typeof getById;
export type VerifyRouteT = typeof verify;
