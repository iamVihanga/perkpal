import { z } from "zod";
import { sql } from "drizzle-orm";
import { text, timestamp } from "drizzle-orm/pg-core";

import { media } from "@/database/schema";

// ---------- Database Helpers ----------
export const timestamps = {
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`)
};

export const seoFields = {
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  og_image_id: text("og_image_id").references(() => media.id, {
    onDelete: "set null"
  })
};

export const errorMessageSchema = z.object({
  message: z.string()
});

export const stringIdParamSchema = z.object({
  id: z.string()
});

export const queryParamsSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  sort: z.enum(["asc", "desc"]).optional().default("desc"),
  search: z.string().optional()
});

export type QueryParamsSchema = z.infer<typeof queryParamsSchema>;

export function getPaginatedSchema<T>(data: z.ZodType<T>) {
  return z.object({
    data,
    meta: z.object({
      currentPage: z.number(),
      totalPages: z.number(),
      totalCount: z.number(),
      limit: z.number()
    })
  });
}
