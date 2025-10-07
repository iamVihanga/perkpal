import { and, desc, eq, ilike, sql } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { AppRouteHandler } from "@/lib/types/server";

import { db } from "@/database";
import { subcategories, categories } from "@/database/schema";
import type {
  ListSubcategoriesRoute,
  CreateSubcategoryRoute,
  GetSubcategoryByIdRoute,
  DeleteSubcategoryRoute,
  UpdateSubcategoryRoute,
  ReorderSubcategoriesRoute
} from "./routes";
import { SelectSubcategoryT } from "@/lib/zod/categories.zod";

// List subcategories route handler
export const list: AppRouteHandler<ListSubcategoriesRoute> = async (c) => {
  try {
    const {
      page = "1",
      limit = "10",
      search,
      categoryId
    } = c.req.valid("query");

    // Convert to numbers and validate
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.max(1, Math.min(100, parseInt(limit))); // Cap at 100 items
    const offset = (pageNum - 1) * limitNum;

    // Build search and filter conditions
    const searchCondition = search
      ? ilike(subcategories.name, `%${search}%`)
      : undefined;

    const categoryFilterCondition = categoryId
      ? eq(subcategories.categoryId, categoryId)
      : undefined;

    const whereCondition =
      searchCondition && categoryFilterCondition
        ? and(searchCondition, categoryFilterCondition)
        : searchCondition || categoryFilterCondition;

    // Build query with conditions
    const query = db.query.subcategories.findMany({
      limit: limitNum,
      offset,
      where: whereCondition,
      orderBy: (fields) => {
        return [fields.displayOrder, desc(fields.createdAt)];
      },
      with: {
        ogImage: true,
        category: {
          with: {
            ogImage: true
          }
        }
      }
    });

    // Get total count for pagination
    const totalCountQuery = db
      .select({ count: sql<number>`count(*)` })
      .from(subcategories)
      .where(whereCondition);

    const [subcategoryEntries, totalEntries] = await Promise.all([
      query,
      totalCountQuery
    ]);

    const totalCount = totalEntries[0]?.count || 0;

    // Calculate pagination pages metadata
    const totalPages = Math.ceil(totalCount / limitNum);

    return c.json(
      {
        data: subcategoryEntries.map((subcategory) => ({
          ...subcategory,
          // Only fix the problematic fields
          opengraphImage: subcategory.ogImage || undefined,
          category: subcategory.category
            ? {
                ...subcategory.category,
                ogImageId: subcategory.category.og_image_id
              }
            : undefined
        })) as SelectSubcategoryT[],
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

// Get subcategory by ID handler
export const getById: AppRouteHandler<GetSubcategoryByIdRoute> = async (c) => {
  try {
    const params = c.req.valid("param");
    const subcategoryId = params.id;

    const subcategory = await db.query.subcategories.findFirst({
      where: eq(subcategories.id, subcategoryId),
      with: {
        ogImage: true,
        category: {
          with: {
            ogImage: true
          }
        }
      }
    });

    if (!subcategory) {
      return c.json(
        { message: HttpStatusPhrases.NOT_FOUND },
        HttpStatusCodes.NOT_FOUND
      );
    }

    return c.json(
      {
        ...subcategory,
        // Only fix the problematic fields
        opengraphImage: subcategory.ogImage || undefined,
        category: subcategory.category
          ? {
              ...subcategory.category,
              ogImageId: subcategory.category.og_image_id
            }
          : undefined
      } as SelectSubcategoryT,
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

// Create subcategory handler
export const create: AppRouteHandler<CreateSubcategoryRoute> = async (c) => {
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

    // Check if parent category exists
    const parentCategory = await db.query.categories.findFirst({
      where: eq(categories.id, body.parentCategoryId)
    });

    if (!parentCategory) {
      return c.json(
        { message: "Parent category not found" },
        HttpStatusCodes.NOT_FOUND
      );
    }

    // Calculate next display order for subcategories within the parent category
    const maxDisplayOrderResult = await db
      .select({
        maxOrder: sql<number>`COALESCE(MAX(${subcategories.displayOrder}), 0)`
      })
      .from(subcategories)
      .where(eq(subcategories.categoryId, body.parentCategoryId));

    const nextDisplayOrder = (maxDisplayOrderResult[0]?.maxOrder ?? 0) + 1;

    // Create new subcategory
    const newSubcategory = await db
      .insert(subcategories)
      .values({
        ...body,
        categoryId: body.parentCategoryId,
        og_image_id: body.ogImageId || null,
        displayOrder: nextDisplayOrder
      })
      .returning();

    if (!newSubcategory || !newSubcategory[0])
      throw new Error("Failed to create subcategory");

    // Select the newly created subcategory with relations
    const createdSubcategory = await db.query.subcategories.findFirst({
      where: eq(subcategories.id, newSubcategory[0].id),
      with: {
        ogImage: true,
        category: {
          with: {
            ogImage: true
          }
        }
      }
    });

    if (!createdSubcategory)
      throw new Error("Failed to retrieve created subcategory");

    return c.json(
      {
        ...createdSubcategory,
        // Only fix the problematic fields
        opengraphImage: createdSubcategory.ogImage || undefined,
        category: createdSubcategory.category
          ? {
              ...createdSubcategory.category,
              ogImageId: createdSubcategory.category.og_image_id
            }
          : undefined
      } as SelectSubcategoryT,
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

// Update subcategory handler
export const update: AppRouteHandler<UpdateSubcategoryRoute> = async (c) => {
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

    const params = c.req.valid("param");
    const body = c.req.valid("json");

    const subcategoryId = params.id;

    // Check if subcategory exists
    const existingSubcategory = await db.query.subcategories.findFirst({
      where: eq(subcategories.id, subcategoryId)
    });

    if (!existingSubcategory) {
      return c.json(
        { message: HttpStatusPhrases.NOT_FOUND },
        HttpStatusCodes.NOT_FOUND
      );
    }

    // If parentCategoryId is being updated, check if the new parent category exists
    if (
      body.parentCategoryId &&
      body.parentCategoryId !== existingSubcategory.categoryId
    ) {
      const parentCategory = await db.query.categories.findFirst({
        where: eq(categories.id, body.parentCategoryId)
      });

      if (!parentCategory) {
        return c.json(
          { message: "Parent category not found" },
          HttpStatusCodes.NOT_FOUND
        );
      }
    }

    // Update subcategory
    const updatedSubcategories = await db
      .update(subcategories)
      .set({
        ...body,
        categoryId: body.parentCategoryId || existingSubcategory.categoryId,
        og_image_id: body.ogImageId || null,
        updatedAt: new Date()
      })
      .where(eq(subcategories.id, subcategoryId))
      .returning();

    if (!updatedSubcategories || !updatedSubcategories[0]) {
      throw new Error("Failed to update subcategory");
    }

    // Select the updated subcategory with relations
    const updatedSubcategory = await db.query.subcategories.findFirst({
      where: eq(subcategories.id, updatedSubcategories[0].id),
      with: {
        ogImage: true,
        category: {
          with: {
            ogImage: true
          }
        }
      }
    });

    if (!updatedSubcategory) {
      throw new Error("Failed to retrieve updated subcategory");
    }

    return c.json(
      {
        ...updatedSubcategory,
        // Only fix the problematic fields
        opengraphImage: updatedSubcategory.ogImage || undefined,
        category: updatedSubcategory.category
          ? {
              ...updatedSubcategory.category,
              ogImageId: updatedSubcategory.category.og_image_id
            }
          : undefined
      } as SelectSubcategoryT,
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

// Delete subcategory handler
export const remove: AppRouteHandler<DeleteSubcategoryRoute> = async (c) => {
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

    const params = c.req.valid("param");
    const subcategoryId = params.id;

    // Check if subcategory exists
    const existingSubcategory = await db.query.subcategories.findFirst({
      where: eq(subcategories.id, subcategoryId)
    });

    if (!existingSubcategory) {
      return c.json(
        { message: HttpStatusPhrases.NOT_FOUND },
        HttpStatusCodes.NOT_FOUND
      );
    }

    // Delete subcategory
    await db.delete(subcategories).where(eq(subcategories.id, subcategoryId));

    return c.json(
      { message: "Subcategory successfully deleted" },
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

// Reorder subcategories handler
export const reorder: AppRouteHandler<ReorderSubcategoriesRoute> = async (
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

    // Validate all IDs exist
    const subcategoryIds = body.items.map((item) => item.id);

    const existingSubcategories = await db.query.subcategories.findMany({
      where: (fields, { inArray }) => inArray(fields.id, subcategoryIds)
    });

    // Check if all subcategories exist
    if (existingSubcategories.length !== subcategoryIds.length) {
      return c.json(
        { message: HttpStatusPhrases.NOT_FOUND },
        HttpStatusCodes.NOT_FOUND
      );
    }

    // Update subcategory order in a transaction for data consistency
    await db.transaction(async (tx) => {
      const updates = body.items.map((item) =>
        tx
          .update(subcategories)
          .set({ displayOrder: item.displayOrder, updatedAt: new Date() })
          .where(eq(subcategories.id, item.id))
      );

      await Promise.all(updates);
    });

    return c.json(
      { message: "Subcategories successfully reordered" },
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
