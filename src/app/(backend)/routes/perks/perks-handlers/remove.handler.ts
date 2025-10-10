import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import { AppRouteHandler } from "@/lib/types/server";

import { RemovePerksRouteT } from "../routes";
import { db } from "@/database";
import { perks } from "@/database/schema";
import { eq } from "drizzle-orm";

// Delete perk handler
export const remove: AppRouteHandler<RemovePerksRouteT> = async (c) => {
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
    const perkId = params.id;

    // Check if perks exists
    const existingPerk = await db.query.perks.findFirst({
      where: eq(perks.id, perkId)
    });

    if (!existingPerk) {
      return c.json(
        { message: HttpStatusPhrases.NOT_FOUND },
        HttpStatusCodes.NOT_FOUND
      );
    }

    // Delete perk
    await db.delete(perks).where(eq(perks.id, perkId));

    return c.json({ message: "Perk successfully deleted" }, HttpStatusCodes.OK);
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
