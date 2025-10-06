import { sql } from "drizzle-orm";
import { timestamp } from "drizzle-orm/pg-core";

import { z } from "zod";

// Constants
export const cloudinaryPreset =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "perkpal";

// ---------- Database Helpers ----------
export const timestamps = {
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`)
};

// --------- Reorder Schema -----------
export const reorderItemsSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      displayOrder: z.number().int().min(0)
    })
  )
});

export type ReorderItemsT = z.infer<typeof reorderItemsSchema>;
