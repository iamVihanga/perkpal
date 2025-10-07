import { and, desc, eq, ilike, sql } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { AppRouteHandler } from "@/lib/types/server";

import { db } from "@/database";
import { categories } from "@/database/schema";
import type {
  ListCategoriesRoute,
  CreateCategoryRoute,
  GetCategoryByIdRoute,
  DeleteCategoryRoute,
  UpdateCategoryRoute,
  ReorderCategoriesRoute
} from "./routes";
import { SelectCategoryT } from "@/lib/zod/categories.zod";

// List categories route handler
export const list: AppRouteHandler<ListCategoriesRoute> = async (c) => {
  try {
    const { page = "1", limit = "10", search } = c.req.valid("query");

    // Convert to numbers and validate
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.max(1, Math.min(100, parseInt(limit))); // Cap at 100 items
    const offset = (pageNum - 1) * limitNum;

    // Build search condition for query
    const searchCondition = search
      ? and(
          ilike(categories.name, `%${search}%`)
          // Add more conditions if needed (e.g., description, slug)
        )
      : undefined;

    // Build query with conditions
    const query = db.query.categories.findMany({
      limit: limitNum,
      offset,
      where: searchCondition,
      orderBy: (fields) => {
        return [fields.displayOrder, desc(fields.createdAt)];
      },
      with: {
        subcategories: {
          orderBy: (fields) => [fields.displayOrder, desc(fields.createdAt)],
          with: { ogImage: true }
        },
        ogImage: true
      }
    });

    // Get total count for pagination
    const totalCountQuery = db
      .select({ count: sql<number>`count(*)` })
      .from(categories)
      .where(searchCondition);

    const [categoryEntries, totalEntries] = await Promise.all([
      query,
      totalCountQuery
    ]);

    const totalCount = totalEntries[0]?.count || 0;

    // Calculate pagination pages metadata
    const totalPages = Math.ceil(totalCount / limitNum);

    return c.json(
      {
        data: categoryEntries.map((category) => ({
          ...category,
          description: category.description || null,
          opengraphImage: category.ogImage || undefined,
          displayOrder: category.displayOrder || undefined,
          subcategories: category.subcategories.map((sub) => ({
            ...sub,
            description: sub.description || null,
            opengraphImage: sub.ogImage || undefined,
            displayOrder: sub.displayOrder || undefined
          })) as SelectCategoryT["subcategories"]
        })),
        meta: {
          currentPage: pageNum,
          totalPages,
          totalCount,
          limit: limitNum
        }
      },
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

// Get category by ID handler
export const getById: AppRouteHandler<GetCategoryByIdRoute> = async (c) => {
  try {
    const params = c.req.valid("param");
    const categoryId = params.id;

    const category = await db.query.categories.findFirst({
      where: eq(categories.id, categoryId),
      with: {
        subcategories: {
          orderBy: (fields) => [fields.displayOrder, desc(fields.createdAt)],
          with: { ogImage: true }
        },
        ogImage: true
      }
    });

    if (!category) {
      return c.json(
        { message: HttpStatusPhrases.NOT_FOUND },
        HttpStatusCodes.NOT_FOUND
      );
    }

    return c.json(
      {
        ...category,
        description: category.description || null,
        opengraphImage: category.ogImage || undefined,
        displayOrder: category.displayOrder || undefined,
        subcategories: category.subcategories.map((sub) => ({
          ...sub,
          description: sub.description || null,
          opengraphImage: sub.ogImage || undefined,
          displayOrder: sub.displayOrder || undefined
        })) as SelectCategoryT["subcategories"]
      } as SelectCategoryT,
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

// Create category handler
export const create: AppRouteHandler<CreateCategoryRoute> = async (c) => {
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

    // Calculate next display order
    const maxDisplayOrderResult = await db
      .select({
        maxOrder: sql<number>`COALESCE(MAX(${categories.displayOrder}), 0)`
      })
      .from(categories);

    const nextDisplayOrder = (maxDisplayOrderResult[0]?.maxOrder ?? 0) + 1;

    //   Create new category
    const newCategory = await db
      .insert(categories)
      .values({
        ...body,
        og_image_id: body.ogImageId || null,
        displayOrder: nextDisplayOrder
      })
      .returning();

    if (!newCategory || !newCategory[0])
      throw new Error("Failed to create category");

    //   Select the newly created category with relations
    const createdCategory = await db.query.categories.findFirst({
      where: eq(categories.id, newCategory[0].id),
      with: {
        subcategories: {
          orderBy: (fields) => [fields.displayOrder, desc(fields.createdAt)],
          with: { ogImage: true }
        },
        ogImage: true
      }
    });

    if (!createdCategory)
      throw new Error("Failed to retrieve created category");

    return c.json(
      {
        ...createdCategory,
        description: createdCategory.description || null,
        opengraphImage: createdCategory.ogImage || undefined,
        displayOrder: createdCategory.displayOrder || undefined,
        subcategories: createdCategory.subcategories.map((sub) => ({
          ...sub,
          description: sub.description || null,
          opengraphImage: sub.ogImage || undefined,
          displayOrder: sub.displayOrder || undefined
        })) as SelectCategoryT["subcategories"]
      } as SelectCategoryT,
      HttpStatusCodes.CREATED
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

// Update category handler
export const update: AppRouteHandler<UpdateCategoryRoute> = async (c) => {
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

    const categoryId = params.id;

    //   Check if category exists
    const existingCategory = await db.query.categories.findFirst({
      where: eq(categories.id, categoryId)
    });

    if (!existingCategory) {
      return c.json(
        { message: HttpStatusPhrases.NOT_FOUND },
        HttpStatusCodes.NOT_FOUND
      );
    }

    //   Update category
    const updatedCategories = await db
      .update(categories)
      .set({
        ...body,
        og_image_id: body.ogImageId || null,
        updatedAt: new Date()
      })
      .where(eq(categories.id, categoryId))
      .returning();

    if (!updatedCategories || !updatedCategories[0]) {
      throw new Error("Failed to update category");
    }

    //   Select the updated category with relations
    const updatedCategory = await db.query.categories.findFirst({
      where: eq(categories.id, updatedCategories[0].id),
      with: {
        subcategories: {
          orderBy: (fields) => [fields.displayOrder, desc(fields.createdAt)],
          with: { ogImage: true }
        },
        ogImage: true
      }
    });

    if (!updatedCategory) {
      throw new Error("Failed to retrieve updated category");
    }

    return c.json(
      {
        ...updatedCategory,
        description: updatedCategory.description || null,
        opengraphImage: updatedCategory.ogImage || undefined,
        displayOrder: updatedCategory.displayOrder || undefined,
        subcategories: updatedCategory.subcategories.map((sub) => ({
          ...sub,
          description: sub.description || null,
          opengraphImage: sub.ogImage || undefined,
          displayOrder: sub.displayOrder || undefined
        })) as SelectCategoryT["subcategories"]
      } as SelectCategoryT,
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

// Delete category handler
export const remove: AppRouteHandler<DeleteCategoryRoute> = async (c) => {
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
    const categoryId = params.id;

    //   Check if category exists
    const existingCategory = await db.query.categories.findFirst({
      where: eq(categories.id, categoryId)
    });

    if (!existingCategory) {
      return c.json(
        { message: HttpStatusPhrases.NOT_FOUND },
        HttpStatusCodes.NOT_FOUND
      );
    }

    //   Delete category
    await db.delete(categories).where(eq(categories.id, categoryId));

    return c.json(
      { message: "Category successfully deleted" },
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

// Reorder categories handler
export const reorder: AppRouteHandler<ReorderCategoriesRoute> = async (c) => {
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

    //   Validate all IDs exist
    const categoryIds = body.items.map((item) => item.id);

    const existingCategories = await db.query.categories.findMany({
      where: (fields, { inArray }) => inArray(fields.id, categoryIds)
    });

    //   Check if all categories exist
    if (existingCategories.length !== categoryIds.length) {
      return c.json(
        { message: HttpStatusPhrases.NOT_FOUND },
        HttpStatusCodes.NOT_FOUND
      );
    }

    //   Update category order in a transaction for data consistency
    await db.transaction(async (tx) => {
      const updates = body.items.map((item) =>
        tx
          .update(categories)
          .set({ displayOrder: item.displayOrder, updatedAt: new Date() })
          .where(eq(categories.id, item.id))
      );

      await Promise.all(updates);
    });

    return c.json(
      { message: "Categories successfully reordered" },
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
