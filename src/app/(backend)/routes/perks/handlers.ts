import { and, desc, eq, ilike, sql, or } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { AppRouteHandler } from "@/lib/types/server";

import { db } from "@/database";
import { perks } from "@/database/schema/perks.schema";
import type { ListPerksRouteT, GetPerkRouteT } from "./routes";
import { LocationT, RedemptionMethodT, SelectPerkT } from "@/lib/zod/perks.zod";

// List all perks route handler
export const list: AppRouteHandler<ListPerksRouteT> = async (c) => {
  try {
    const {
      page = "1",
      limit = "10",
      search,
      sort = "desc",
      ...filters
    } = c.req.valid("query");

    // Convert to numbers and validate
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.max(1, Math.min(100, parseInt(limit))); // Cap at 100 items
    const offset = (pageNum - 1) * limitNum;

    // =====================================================
    // Build search condition for query
    const searchCondition = search
      ? or(
          ilike(perks.title, `%${search}%`),
          ilike(perks.shortDescription, `%${search}%`),
          ilike(perks.vendorName, `%${search}%`),
          ilike(perks.slug, `%${search}%`)
        )
      : undefined;

    // Build filter conditions for query
    const filterConditions = [];

    if (filters?.categoryId) {
      filterConditions.push(eq(perks.categoryId, filters.categoryId));
    }

    if (filters?.subcategoryId) {
      filterConditions.push(eq(perks.subcategoryId, filters.subcategoryId));
    }

    if (filters?.location) {
      filterConditions.push(eq(perks.location, filters.location as LocationT));
    }

    if (filters?.status) {
      filterConditions.push(eq(perks.status, filters.status));
    }

    if (filters?.redemptionMethod) {
      filterConditions.push(
        eq(
          perks.redemptionMethod,
          filters.redemptionMethod as RedemptionMethodT
        )
      );
    }
    // =====================================================

    // Build query with conditions
    const whereConditions = [
      ...(searchCondition ? [searchCondition] : []),
      ...filterConditions
    ];

    const query = db.query.perks.findMany({
      limit: limitNum,
      offset,
      // Where clause with search and filters
      where: whereConditions.length > 0 ? and(...whereConditions) : undefined,
      orderBy: (fields) => {
        // Primary sort by display order, secondary by creation date
        return sort === "asc"
          ? [fields.displayOrder, fields.createdAt]
          : [fields.displayOrder, desc(fields.createdAt)];
      },
      with: {
        category: {
          with: {
            ogImage: true
          }
        },
        subcategory: {
          with: {
            ogImage: true
          }
        },
        bannerImage: true,
        logoImage: true,
        opengraphImage: true
      }
    });

    // Get total count for pagination
    const totalCountQuery = db
      .select({ count: sql<number>`count(*)` })
      .from(perks)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

    const [perksEntries, totalEntries] = await Promise.all([
      query,
      totalCountQuery
    ]);

    const totalCount = totalEntries[0]?.count || 0;

    // Calculate pagination pages metadata
    const totalPages = Math.ceil(totalCount / limitNum);

    return c.json(
      {
        data: perksEntries.map((perk) => ({
          ...perk,
          category: perk.category
            ? {
                ...perk.category,
                ogImageId: perk.category.og_image_id
              }
            : undefined,
          subcategory: perk.subcategory
            ? {
                ...perk.subcategory,
                ogImageId: perk.subcategory.og_image_id
              }
            : undefined
        })) as SelectPerkT[],
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

// Get single perk by ID / slug route handler
export const getOne: AppRouteHandler<GetPerkRouteT> = async (c) => {
  try {
    const query = c.req.valid("query");

    // The validation is handled by Zod schema, so we know either id or slug exists
    const { id, slug } = query;

    let whereCondition;
    if (id) {
      whereCondition = eq(perks.id, id);
    } else if (slug) {
      whereCondition = eq(perks.slug, slug);
    } else {
      // This shouldn't happen due to Zod validation, but just in case
      return c.json(
        {
          message: "Either ID or slug must be provided"
        },
        HttpStatusCodes.BAD_REQUEST
      );
    }

    // Query the perk with all relations
    const perkEntry = await db.query.perks.findFirst({
      where: whereCondition,
      with: {
        category: {
          with: {
            ogImage: true
          }
        },
        subcategory: {
          with: {
            ogImage: true
          }
        },
        bannerImage: true,
        logoImage: true,
        opengraphImage: true
      }
    });

    if (!perkEntry) {
      return c.json(
        {
          message: "Perk not found"
        },
        HttpStatusCodes.NOT_FOUND
      );
    }

    // Format the response to match SelectPerkT schema
    const formattedPerk = {
      ...perkEntry,
      category: perkEntry.category
        ? {
            ...perkEntry.category,
            ogImageId: perkEntry.category.og_image_id
          }
        : undefined,
      subcategory: perkEntry.subcategory
        ? {
            ...perkEntry.subcategory,
            ogImageId: perkEntry.subcategory.og_image_id
          }
        : undefined
    } as SelectPerkT;

    return c.json(formattedPerk, HttpStatusCodes.OK);
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
