import { and, asc, desc, eq, sql } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import { db } from "@/database";
import type { AppRouteHandler } from "@/lib/types/server";

import type {
  CreateLeadRoute,
  DeleteLeadRoute,
  GetOneLeadRoute,
  ListLeadsRoute
} from "./routes";
import { leads, perks } from "@/database/schema";
import { SelectPerkT } from "@/lib/zod/perks.zod";

// List leads route handler
export const list: AppRouteHandler<ListLeadsRoute> = async (c) => {
  try {
    const session = c.get("session");
    const user = c.get("user");

    if (!session) {
      return c.json(
        {
          message: HttpStatusPhrases.UNAUTHORIZED
        },
        HttpStatusCodes.UNAUTHORIZED
      );
    }

    if (user?.role !== "admin") {
      if (user?.role !== "contentEditor") {
        return c.json(
          {
            message: HttpStatusPhrases.FORBIDDEN
          },
          HttpStatusCodes.FORBIDDEN
        );
      }
    }

    const { page = "1", limit = "10", perkId, sort } = c.req.valid("query");

    // Convert to numbers and validate
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.max(1, Math.min(100, parseInt(limit))); // Cap at 100 items
    const offset = (pageNum - 1) * limitNum;

    const whereConditions = perkId ? and(eq(perks.id, perkId)) : undefined;

    // Build query with conditions
    const query = db.query.leads.findMany({
      limit: limitNum,
      offset,
      orderBy: (fields) => {
        if (sort === "asc") {
          return asc(fields.createdAt);
        }

        return desc(fields.createdAt); // Default to descending
      },
      where: whereConditions,
      with: {
        perk: {
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
        }
      }
    });

    // Get total count for pagination
    const totalCountQuery = db
      .select({ count: sql<number>`count(*)` })
      .from(leads)
      .where(whereConditions);

    const [leadEntries, totalEntries] = await Promise.all([
      query,
      totalCountQuery
    ]);

    const totalCount = totalEntries[0]?.count || 0;

    // Calculate pagination pages metadata
    const totalPages = Math.ceil(totalCount / limitNum);

    return c.json(
      {
        data: leadEntries.map((lead) => ({
          ...lead,
          data: lead.data ? lead.data : {},
          perkId: lead.perkId!,
          perk: {
            ...lead.perk,
            category: lead?.perk?.category
              ? {
                  ...lead?.perk?.category,
                  ogImageId: lead?.perk?.category.og_image_id
                }
              : undefined,
            subcategory: lead?.perk?.subcategory
              ? {
                  ...lead?.perk?.subcategory,
                  ogImageId: lead?.perk?.subcategory.og_image_id
                }
              : undefined
          } as SelectPerkT
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

// Get lead by ID route handler
export const getOne: AppRouteHandler<GetOneLeadRoute> = async (c) => {
  try {
    const session = c.get("session");
    const user = c.get("user");

    if (!session) {
      return c.json(
        {
          message: HttpStatusPhrases.UNAUTHORIZED
        },
        HttpStatusCodes.UNAUTHORIZED
      );
    }

    if (user?.role !== "admin") {
      if (user?.role !== "contentEditor") {
        return c.json(
          {
            message: HttpStatusPhrases.FORBIDDEN
          },
          HttpStatusCodes.FORBIDDEN
        );
      }
    }

    const { id } = c.req.valid("param");

    const whereCondition = eq(leads.id, id);

    const leadEntry = await db.query.leads.findFirst({
      where: whereCondition,
      with: {
        perk: {
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
        }
      }
    });

    if (!leadEntry) {
      return c.json(
        {
          message: "Lead not found"
        },
        HttpStatusCodes.NOT_FOUND
      );
    }

    const formattedLead = {
      ...leadEntry,
      data: leadEntry.data ? leadEntry.data : {},
      perkId: leadEntry.perkId!,
      perk: {
        ...leadEntry.perk,
        category: leadEntry?.perk?.category
          ? {
              ...leadEntry?.perk?.category,
              ogImageId: leadEntry?.perk?.category.og_image_id
            }
          : undefined,
        subcategory: leadEntry?.perk?.subcategory
          ? {
              ...leadEntry?.perk?.subcategory,
              ogImageId: leadEntry?.perk?.subcategory.og_image_id
            }
          : undefined
      } as SelectPerkT
    };

    return c.json(formattedLead, HttpStatusCodes.OK);
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

export const create: AppRouteHandler<CreateLeadRoute> = async (c) => {
  try {
    const session = c.get("session");
    const user = c.get("user");

    if (!session) {
      return c.json(
        {
          message: HttpStatusPhrases.UNAUTHORIZED
        },
        HttpStatusCodes.UNAUTHORIZED
      );
    }

    if (user?.role !== "admin") {
      if (user?.role !== "contentEditor") {
        return c.json(
          {
            message: HttpStatusPhrases.FORBIDDEN
          },
          HttpStatusCodes.FORBIDDEN
        );
      }
    }

    const body = c.req.valid("json");

    const createdEntry = await db
      .insert(leads)
      .values({
        ...body,
        ip:
          c.req.header("x-forwarded-for") ||
          c.req.header("x-real-ip") ||
          "<unknown>"
      })
      .returning();

    if (!createdEntry || createdEntry.length === 0) {
      throw new Error("Failed to create lead");
    }

    const leadEntry = await db.query.leads.findFirst({
      where: (fields, { eq }) => eq(fields.id, createdEntry[0].id),
      with: {
        perk: {
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
        }
      }
    });

    if (!leadEntry) {
      throw new Error("Failed to retrieve created lead");
    }

    const formattedLead = {
      ...leadEntry,
      data: leadEntry.data ? leadEntry.data : {},
      perkId: leadEntry.perkId!,
      perk: {
        ...leadEntry.perk,
        category: leadEntry?.perk?.category
          ? {
              ...leadEntry?.perk?.category,
              ogImageId: leadEntry?.perk?.category.og_image_id
            }
          : undefined,
        subcategory: leadEntry?.perk?.subcategory
          ? {
              ...leadEntry?.perk?.subcategory,
              ogImageId: leadEntry?.perk?.subcategory.og_image_id
            }
          : undefined
      } as SelectPerkT
    };

    return c.json(formattedLead, HttpStatusCodes.CREATED);
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

// Delete lead handler
export const remove: AppRouteHandler<DeleteLeadRoute> = async (c) => {
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
    const leadId = params.id;

    //   Check if lead exists
    const existingLead = await db.query.leads.findFirst({
      where: eq(leads.id, leadId)
    });

    if (!existingLead) {
      return c.json(
        { message: HttpStatusPhrases.NOT_FOUND },
        HttpStatusCodes.NOT_FOUND
      );
    }

    //   Delete lead
    await db.delete(leads).where(eq(leads.id, leadId));

    return c.json({ message: "Lead successfully deleted" }, HttpStatusCodes.OK);
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
