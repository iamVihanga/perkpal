import { sql } from "drizzle-orm";
import { timestamp } from "drizzle-orm/pg-core";

import { z } from "zod";

// ---------- Database Helpers ----------
export const timestamps = {
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`)
};

// ---------- String Helpers ----------
export function toKebabCase(str: string) {
  return (
    str
      // Add hyphen before capital letters and convert to lowercase
      .replace(/([A-Z])/g, "-$1")
      // Replace spaces and underscores with hyphens
      .replace(/[\s_]+/g, "-")
      // Remove any non-alphanumeric characters (except hyphens)
      .replace(/[^\w\s-]/g, "")
      // Convert to lowercase
      .toLowerCase()
      // Remove leading hyphen if present
      .replace(/^-/, "")
      // Replace multiple consecutive hyphens with a single one
      .replace(/-+/g, "-")
  );
}

// --------- Reorder Schema -----------
export const reorderItemsSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      displayOrder: z.number().int().min(0)
    })
  )
});
