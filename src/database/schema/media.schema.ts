import { sql } from "drizzle-orm";
import { integer, pgTable, text } from "drizzle-orm/pg-core";
import { timestamps } from "@/lib/server/helpers";
import { user } from "./auth.schema";

export const media = pgTable("media", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  url: text("url"),
  publicId: text("public_id"),
  filename: text("filename").notNull(),
  size: integer("size").notNull().default(0),

  // SEO fields
  seoTitle: text("seo_title").default(""),
  seoDescription: text("seo_description").default(""),
  seoKeywords: text("seo_keywords").default(""),

  // User Relations
  uploadedBy: text("uploaded_by").references(() => user.id, {
    onDelete: "set null"
  }),

  ...timestamps
});
