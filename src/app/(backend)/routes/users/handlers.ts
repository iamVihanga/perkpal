import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { AppRouteHandler } from "@/lib/types/server";

import { db } from "@/database";
import type { GetByIdRouteT, VerifyRouteT } from "./routes";
import { SelectUserSchema } from "@/features/user-management/schemas/select-user";
import { user } from "@/database/schema";
import { eq } from "drizzle-orm";
import { RoleTypes } from "@/lib/helpers";

export const getById: AppRouteHandler<GetByIdRouteT> = async (c) => {
  try {
    const sessionUser = c.get("user");

    if (!sessionUser) {
      return c.json(
        { message: HttpStatusPhrases.UNAUTHORIZED },
        HttpStatusCodes.UNAUTHORIZED
      );
    }

    if (sessionUser?.role !== "admin") {
      return c.json(
        { message: HttpStatusPhrases.FORBIDDEN },
        HttpStatusCodes.FORBIDDEN
      );
    }

    const userId = c.req.param("id");

    if (!userId) {
      throw new Error("User ID is required");
    }

    const existingUser = await db.query.user.findFirst({
      where: (fields, { eq }) => eq(fields.id, userId)
    });

    if (!existingUser) {
      return c.json(
        { message: HttpStatusPhrases.NOT_FOUND },
        HttpStatusCodes.NOT_FOUND
      );
    }

    return c.json(
      {
        ...existingUser,
        role: existingUser.role
      } as SelectUserSchema,
      HttpStatusCodes.OK
    );
  } catch (error) {
    return c.json(
      {
        message:
          (error as Error).message || HttpStatusPhrases.INTERNAL_SERVER_ERROR
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

export const verify: AppRouteHandler<VerifyRouteT> = async (c) => {
  try {
    const sessionUser = c.get("user");

    if (!sessionUser) {
      return c.json(
        { message: HttpStatusPhrases.UNAUTHORIZED },
        HttpStatusCodes.UNAUTHORIZED
      );
    }

    if (sessionUser?.role !== "admin") {
      return c.json(
        { message: HttpStatusPhrases.FORBIDDEN },
        HttpStatusCodes.FORBIDDEN
      );
    }

    const body = c.req.valid("json");

    if (!body?.userId) {
      throw new Error("User ID is required");
    }

    const existingUser = await db.query.user.findFirst({
      where: (fields, { eq }) => eq(fields.id, body.userId)
    });

    if (!existingUser) {
      return c.json(
        { message: HttpStatusPhrases.NOT_FOUND },
        HttpStatusCodes.NOT_FOUND
      );
    }

    const [updatedUser] = await db
      .update(user)
      .set({ emailVerified: body.emailVerified })
      .where(eq(user.id, body.userId))
      .returning();

    if (!updatedUser) {
      return c.json(
        { message: HttpStatusPhrases.INTERNAL_SERVER_ERROR },
        HttpStatusCodes.INTERNAL_SERVER_ERROR
      );
    }

    return c.json(
      { ...updatedUser, role: updatedUser.role as RoleTypes },
      HttpStatusCodes.OK
    );
  } catch (error) {
    return c.json(
      {
        message:
          (error as Error).message || HttpStatusPhrases.INTERNAL_SERVER_ERROR
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};
