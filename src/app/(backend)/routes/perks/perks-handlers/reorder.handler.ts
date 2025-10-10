import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import { AppRouteHandler } from "@/lib/types/server";

import { ReorderPerksRouteT } from "../routes";
import { db } from "@/database";
import { perks } from "@/database/schema";
import { eq } from "drizzle-orm";

// Reorder categories handler
export const reorder: AppRouteHandler<ReorderPerksRouteT> = async (c) => {
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
    const perkIds = body.items.map((item) => item.id);

    const existingPerks = await db.query.perks.findMany({
      where: (fields, { inArray }) => inArray(fields.id, perkIds)
    });

    //   Check if all perks exist
    if (existingPerks.length !== perkIds.length) {
      return c.json(
        { message: HttpStatusPhrases.NOT_FOUND },
        HttpStatusCodes.NOT_FOUND
      );
    }

    //   Update perks order in a transaction for data consistency
    await db.transaction(async (tx) => {
      const updates = body.items.map((item) =>
        tx
          .update(perks)
          .set({ displayOrder: item.displayOrder, updatedAt: new Date() })
          .where(eq(perks.id, item.id))
      );

      await Promise.all(updates);
    });

    return c.json(
      { message: "Perks are successfully reordered" },
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
