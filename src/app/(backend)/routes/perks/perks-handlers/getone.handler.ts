import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { AppRouteHandler } from "@/lib/types/server";

import { db } from "@/database";
import { perks } from "@/database/schema/perks.schema";
import { SelectPerkT } from "@/lib/zod/perks.zod";
import type { GetPerkRouteT } from "../routes";

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
