import { sql } from "drizzle-orm";
import { integer, pgEnum, pgTable, text } from "drizzle-orm/pg-core";
import { timestamps } from "@/lib/helpers";
import { user } from "./auth.schema";

export const mediaTypeEnum = pgEnum("media_type", [
  "image",
  "video",
  "audio",
  "document"
]);

export const media = pgTable("media", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  url: text("url").notNull(),
  type: mediaTypeEnum("type").notNull(),
  filename: text("filename").notNull(),
  size: integer("size").notNull(),

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
