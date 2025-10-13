import { seoFields, timestamps } from "@/lib/server/helpers";
import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  uniqueIndex
} from "drizzle-orm/pg-core";
import { media } from "./media.schema";

export const pageStatusEnum = pgEnum("page_status", [
  "draft",
  "published",
  "archived"
]);

export const pages = pgTable(
  "pages",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),

    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),

    status: pageStatusEnum("status").notNull().default("draft"),

    ...seoFields,

    ...timestamps
  },
  (t) => [
    uniqueIndex("pages_slug_idx").on(t.slug),

    index("pages_id_idx").on(t.id),
    index("pages_title_idx").on(t.title)
  ]
);

export const sections = pgTable(
  "sections",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    pageId: text("page_id")
      .notNull()
      .references(() => pages.id, { onDelete: "cascade" }),

    title: text("title").notNull(),
    description: text("description"),

    displayOrder: integer("display_order").default(0),

    ...timestamps
  },
  (t) => [
    index("sections_id_idx").on(t.id),
    index("sections_page_id_idx").on(t.pageId)
  ]
);

export const contentFieldsTypesEnum = pgEnum("content_field_type", [
  "text",
  "rich_text",
  "image",
  "video",
  "link",
  "number",
  "boolean"
]);

export const contentFields = pgTable(
  "content_fields",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),

    pageId: text("page_id")
      .notNull()
      .references(() => pages.id, { onDelete: "cascade" }),

    sectionId: text("section_id").references(() => sections.id, {
      onDelete: "set null"
    }),

    key: text("key").notNull(),
    value: text("value").notNull(),
    type: contentFieldsTypesEnum("type").default("text"),

    metadata: jsonb("metadata").default(sql`'{}'::jsonb`),
    displayOrder: integer("display_order").default(0),
    ...timestamps
  },
  (t) => [
    index("content_fields_id_idx").on(t.id),
    index("content_fields_page_id_idx").on(t.pageId),
    uniqueIndex("content_fields_section_key_idx").on(t.sectionId, t.key)
  ]
);

export const pagesRelations = relations(pages, ({ many, one }) => ({
  sections: many(sections),
  ogImage: one(media, {
    fields: [pages.og_image_id],
    references: [media.id]
  })
}));

export const sectionsRelations = relations(sections, ({ one }) => ({
  page: one(pages, {
    fields: [sections.pageId],
    references: [pages.id]
  })
}));

export const contentFieldsRelations = relations(contentFields, ({ one }) => ({
  page: one(pages, {
    fields: [contentFields.pageId],
    references: [pages.id]
  }),
  section: one(sections, {
    fields: [contentFields.sectionId],
    references: [sections.id]
  })
}));
