import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { AppRouteHandler } from "@/lib/types/server";

import { db } from "@/database";
import { pages } from "@/database/schema/pages.schema";

import type {
  GetPageRouteT,
  CreatePageRouteT,
  DeletePageRouteT,
  UpdatePageRouteT
} from "../routes";
import { PagesSelectT } from "@/lib/zod/pages.zod";

// Get page route handler
export const getPage: AppRouteHandler<GetPageRouteT> = async (c) => {
  try {
    const query = c.req.valid("query");

    let fetchedPage: PagesSelectT | null = null;

    if (query?.id) {
      const pageById = await db.query.pages.findFirst({
        where: (fields, { eq }) => eq(fields.id, query.id as string),
        with: {
          ogImage: true
        },
        columns: {
          og_image_id: false
        }
      });

      if (pageById) {
        fetchedPage = { ...pageById, ogImage: pageById.ogImage! };
      }
    }

    if (query?.slug && !fetchedPage) {
      const pageBySlug = await db.query.pages.findFirst({
        where: (fields, { eq }) => eq(fields.slug, query.slug as string),
        with: {
          ogImage: true
        },
        columns: {
          og_image_id: false
        }
      });

      if (pageBySlug) {
        fetchedPage = { ...pageBySlug, ogImage: pageBySlug.ogImage! };
      }
    }

    if (!fetchedPage) {
      return c.json({ message: "Page not found" }, HttpStatusCodes.NOT_FOUND);
    }

    return c.json(fetchedPage, HttpStatusCodes.OK);
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

// Create page route handler
export const createPage: AppRouteHandler<CreatePageRouteT> = async (c) => {
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

    const body = c.req.valid("json");

    const [createdPage] = await db
      .insert(pages)
      .values({ ...body, og_image_id: body.ogImageId })
      .returning();

    const fetchedPage = await db.query.pages.findFirst({
      where: (fields, { eq }) => eq(fields.id, createdPage.id),
      with: {
        ogImage: true
      },
      columns: {
        og_image_id: false
      }
    });

    if (!fetchedPage) throw new Error("Couldn't fetch created page");

    const preparedResult: PagesSelectT = {
      ...fetchedPage,
      ogImage: fetchedPage.ogImage!
    };

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

// Update page by id route handler
export const updatePage: AppRouteHandler<UpdatePageRouteT> = async (c) => {
  try {
    const session = c.get("session");
    const user = c.get("user");

    if (!session || !user) {
      return c.json(
        { message: HttpStatusPhrases.UNAUTHORIZED },
        HttpStatusCodes.UNAUTHORIZED
      );
    }

    // Check user role
    if (user.role !== "admin") {
      if (user.role !== "contentEditor") {
        return c.json(
          { message: HttpStatusPhrases.FORBIDDEN },
          HttpStatusCodes.FORBIDDEN
        );
      }
    }

    const body = c.req.valid("json");
    const param = c.req.valid("param");

    if (!param?.id)
      return c.json({ message: "ID is required" }, HttpStatusCodes.BAD_REQUEST);

    const [updatedPage] = await db
      .update(pages)
      .set({ ...body, og_image_id: body.ogImageId, updatedAt: new Date() })
      .where(eq(pages.id, param.id))
      .returning();

    const fetchedPage = await db.query.pages.findFirst({
      where: (fields, { eq }) => eq(fields.id, updatedPage.id),
      with: {
        ogImage: true
      },
      columns: {
        og_image_id: false
      }
    });

    if (!fetchedPage) throw new Error("Couldn't fetch updated page");

    const preparedResult: PagesSelectT = {
      ...fetchedPage,
      ogImage: fetchedPage.ogImage!
    };

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

export const deletePage: AppRouteHandler<DeletePageRouteT> = async (c) => {
  try {
    const session = c.get("session");
    const user = c.get("user");

    if (!session || !user) {
      return c.json(
        { message: HttpStatusPhrases.UNAUTHORIZED },
        HttpStatusCodes.UNAUTHORIZED
      );
    }

    // Check user role
    if (user.role !== "admin") {
      if (user.role !== "contentEditor") {
        return c.json(
          { message: HttpStatusPhrases.FORBIDDEN },
          HttpStatusCodes.FORBIDDEN
        );
      }
    }

    const param = c.req.valid("param");

    if (!param?.id)
      return c.json({ message: "ID is required" }, HttpStatusCodes.BAD_REQUEST);

    await db.delete(pages).where(eq(pages.id, param.id)).returning();

    return c.json({ message: "Page deleted successfully" }, HttpStatusCodes.OK);
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
