import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { AppRouteHandler } from "@/lib/types/server";

import { db } from "@/database";

import type {
  ListContentFieldsRouteT,
  CreateContentFieldRouteT,
  UpdateContentFieldRouteT,
  DeleteContentFieldRouteT
} from "../routes";
import type { ContentFieldsSelectT } from "@/lib/zod/pages.zod";
import { contentFields } from "@/database/schema";
import { eq, sql } from "drizzle-orm";

// List Handler
export const listContentFields: AppRouteHandler<
  ListContentFieldsRouteT
> = async (c) => {
  try {
    const params = c.req.valid("param");
    const query = c.req.valid("query");

    if (!params?.id) throw new Error("Page ID is required");

    const allFields = await db.query.contentFields.findMany({
      where: (fields, { eq, and }) => {
        const conditions = [];

        conditions.push(eq(fields.pageId, params.id));

        if (query.section_id) {
          conditions.push(eq(fields.sectionId, query.section_id));
        }

        return and(...conditions);
      },
      orderBy: (fields) => [fields.displayOrder]
    });

    const preparedResult: ContentFieldsSelectT[] =
      allFields as ContentFieldsSelectT[];

    return c.json(preparedResult, HttpStatusCodes.OK);
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

export const createContentField: AppRouteHandler<
  CreateContentFieldRouteT
> = async (c) => {
  try {
    const session = c.get("session");
    const user = c.get("user");

    if (!session || !user) {
      return c.json(
        { message: HttpStatusPhrases.UNAUTHORIZED },
        HttpStatusCodes.UNAUTHORIZED
      );
    }

    //   Check user role
    if (user.role !== "admin") {
      if (user.role !== "contentEditor") {
        return c.json(
          { message: HttpStatusPhrases.FORBIDDEN },
          HttpStatusCodes.FORBIDDEN
        );
      }
    }

    const params = c.req.valid("param");
    const body = c.req.valid("json");

    if (!params.id) throw new Error("Page ID is required");

    // Calculate next display order
    const maxDisplayOrderResult = await db
      .select({
        maxOrder: sql<number>`COALESCE(MAX(${contentFields.displayOrder}), 0)`
      })
      .from(contentFields);

    const nextDisplayOrder = (maxDisplayOrderResult[0]?.maxOrder ?? 0) + 1;

    const [newField] = await db
      .insert(contentFields)
      .values({ ...body, pageId: params.id, displayOrder: nextDisplayOrder })
      .returning();

    const preparedResult: ContentFieldsSelectT =
      newField as ContentFieldsSelectT;

    return c.json(preparedResult, HttpStatusCodes.OK);
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

export const updateContentField: AppRouteHandler<
  UpdateContentFieldRouteT
> = async (c) => {
  try {
    const session = c.get("session");
    const user = c.get("user");

    if (!session || !user) {
      return c.json(
        { message: HttpStatusPhrases.UNAUTHORIZED },
        HttpStatusCodes.UNAUTHORIZED
      );
    }

    //   Check user role
    if (user.role !== "admin") {
      if (user.role !== "contentEditor") {
        return c.json(
          { message: HttpStatusPhrases.FORBIDDEN },
          HttpStatusCodes.FORBIDDEN
        );
      }
    }

    const params = c.req.valid("param");
    const body = c.req.valid("json");

    if (!params.id) throw new Error("Page ID is required");

    const existingField = await db.query.contentFields.findFirst({
      where: (fields, { eq, and }) =>
        and(eq(fields.id, params.fieldId), eq(fields.pageId, params.id))
    });

    if (!existingField) {
      return c.json(
        { message: "Content field not found" },
        HttpStatusCodes.NOT_FOUND
      );
    }

    const [updatedField] = await db
      .update(contentFields)
      .set(body)
      .where(eq(contentFields.id, existingField.id))
      .returning();

    const preparedResult: ContentFieldsSelectT =
      updatedField as ContentFieldsSelectT;

    return c.json(preparedResult, HttpStatusCodes.OK);
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

export const deleteContentField: AppRouteHandler<
  DeleteContentFieldRouteT
> = async (c) => {
  try {
    const session = c.get("session");
    const user = c.get("user");

    if (!session || !user) {
      return c.json(
        { message: HttpStatusPhrases.UNAUTHORIZED },
        HttpStatusCodes.UNAUTHORIZED
      );
    }

    //   Check user role
    if (user.role !== "admin") {
      if (user.role !== "contentEditor") {
        return c.json(
          { message: HttpStatusPhrases.FORBIDDEN },
          HttpStatusCodes.FORBIDDEN
        );
      }
    }

    const params = c.req.valid("param");

    if (!params.id) throw new Error("Page ID is required");

    const existingField = await db.query.contentFields.findFirst({
      where: (fields, { eq, and }) =>
        and(eq(fields.id, params.fieldId), eq(fields.pageId, params.id))
    });

    if (!existingField) {
      return c.json(
        { message: "Content field not found" },
        HttpStatusCodes.NOT_FOUND
      );
    }

    await db
      .delete(contentFields)
      .where(eq(contentFields.id, existingField.id));

    return c.json(
      { message: "Content field deleted successfully" },
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
