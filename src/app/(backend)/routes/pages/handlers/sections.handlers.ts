import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { AppRouteHandler } from "@/lib/types/server";

import { db } from "@/database";

import type {
  GetSectionsByPageRouteT,
  CreateSectionRouteT,
  UpdateSectionRouteT,
  DeleteSectionRouteT,
  ReorderSectionsRouteT
} from "../routes";
import type { SectionsSelectT } from "@/lib/zod/pages.zod";
import { sections } from "@/database/schema";
import { and, eq, sql } from "drizzle-orm";

// Get sections by page route handler
export const getSectionsByPage: AppRouteHandler<
  GetSectionsByPageRouteT
> = async (c) => {
  try {
    const params = c.req.valid("param");

    const sections = await db.query.sections.findMany({
      where: (fields, { eq }) => eq(fields.pageId, params.id),
      orderBy: (fields) => fields.displayOrder
    });

    const preparedResult: SectionsSelectT[] = sections as SectionsSelectT[];

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

// Create new section
export const createSection: AppRouteHandler<CreateSectionRouteT> = async (
  c
) => {
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

    if (!params?.id) throw new Error("Page ID is required");

    // Calculate next display order
    const maxDisplayOrderResult = await db
      .select({
        maxOrder: sql<number>`COALESCE(MAX(${sections.displayOrder}), 0)`
      })
      .from(sections);

    const nextDisplayOrder = (maxDisplayOrderResult[0]?.maxOrder ?? 0) + 1;

    const [createdSection] = await db
      .insert(sections)
      .values({ ...body, pageId: params.id, displayOrder: nextDisplayOrder })
      .returning();

    const preparedResult: SectionsSelectT = createdSection as SectionsSelectT;

    return c.json(preparedResult, HttpStatusCodes.CREATED);
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

// Update section by page and section id
export const updateSection: AppRouteHandler<UpdateSectionRouteT> = async (
  c
) => {
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

    if (!params?.id) throw new Error("Page ID is required");
    if (!params?.sectionId) throw new Error("Section ID is required");

    // Check is section existing with passed id
    const existingSections = await db.query.sections.findFirst({
      where: (fields, { eq }) => eq(fields.id, params.sectionId)
    });

    if (!existingSections)
      return c.json(
        { message: "Section not found" },
        HttpStatusCodes.NOT_FOUND
      );

    const [updatedSection] = await db
      .update(sections)
      .set({ ...body, updatedAt: new Date() })
      .where(
        and(eq(sections.pageId, params.id), eq(sections.id, params.sectionId))
      )
      .returning();

    const preparedResult: SectionsSelectT = updatedSection as SectionsSelectT;

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

// Update section by page and section id
export const deleteSection: AppRouteHandler<DeleteSectionRouteT> = async (
  c
) => {
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

    if (!params?.id) throw new Error("Page ID is required");
    if (!params?.sectionId) throw new Error("Section ID is required");

    // Check is section existing with passed id
    const existingSection = await db.query.sections.findFirst({
      where: (fields, { eq, and }) =>
        and(eq(fields.id, params.sectionId), eq(fields.pageId, params.id))
    });

    if (!existingSection)
      return c.json(
        { message: "Section not found" },
        HttpStatusCodes.NOT_FOUND
      );

    await db
      .delete(sections)
      .where(
        and(eq(sections.pageId, params.id), eq(sections.id, params.sectionId))
      )
      .returning();

    return c.json(
      { message: "Section deleted successfully !" },
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

export const reorderSections: AppRouteHandler<ReorderSectionsRouteT> = async (
  c
) => {
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

    if (!params.id) throw new Error("Page ID is required !");

    //   Validate all IDs exist
    const sectionIds = body.items.map((item) => item.id);

    const existingSections = await db.query.sections.findMany({
      where: (fields, { inArray, and, eq }) =>
        and(inArray(fields.id, sectionIds), eq(fields.pageId, params.id))
    });

    //   Check if all sections exist
    if (existingSections.length !== sectionIds.length) {
      return c.json(
        { message: HttpStatusPhrases.NOT_FOUND },
        HttpStatusCodes.NOT_FOUND
      );
    }

    //   Update sections order in a transaction for data consistency
    await db.transaction(async (tx) => {
      const updates = body.items.map((item) =>
        tx
          .update(sections)
          .set({ displayOrder: item.displayOrder, updatedAt: new Date() })
          .where(eq(sections.id, item.id))
      );

      await Promise.all(updates);
    });

    return c.json(
      { message: "Sections are successfully reordered" },
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
