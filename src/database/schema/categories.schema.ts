import { timestamps, seoFields } from "@/lib/server/helpers";
import { relations, sql } from "drizzle-orm";
import {
  check,
  index,
  integer,
  pgTable,
  text,
  unique,
  uniqueIndex
} from "drizzle-orm/pg-core";
import { media } from "./media.schema";

export const categories = pgTable(
  "categories",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),

    name: text("name").notNull(),
    slug: text("slug").unique().notNull(),
    description: text("description"),

    displayOrder: integer("display_order").default(0),

    // SEO Fields
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
    og_image_id: text("og_image_id").references(() => media.id, {
      onDelete: "set null"
    }),

    ...timestamps
  },
  (t) => [
    uniqueIndex("categories_slug_idx").on(t.slug),
    index("categories_display_order_idx").on(t.displayOrder),
    index("categories_name_idx").on(t.name),
    index("categories_id_idx").on(t.id),

    // Ensure display order is non-negative
    check("categories_display_order_check", sql`${t.displayOrder} >= 0`)
  ]
);

export const subcategories = pgTable(
  "subcategories",
  {
    // PK
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),

    // FK
    categoryId: text("category_id").references(() => categories.id, {
      onDelete: "cascade"
    }),

    name: text("name").notNull(),
    slug: text("slug").unique().notNull(),
    description: text("description"),

    displayOrder: integer("display_order").default(0),

    ...seoFields,

    ...timestamps
  },
  (t) => [
    unique().on(t.categoryId, t.slug),
    index("subcategories_category_id_idx").on(t.categoryId),
    index("subcategories_display_order_idx").on(t.displayOrder),
    index("subcategories_name_idx").on(t.name),

    // Ensure display order is non-negative
    check("subcategories_display_order_check", sql`${t.displayOrder} >= 0`)
  ]
);

// Relationships
export const categoriesRelations = relations(categories, ({ many, one }) => ({
  ogImage: one(media, {
    fields: [categories.og_image_id],
    references: [media.id]
  }),
  subcategories: many(subcategories)
}));

export const subcategoriesRelations = relations(subcategories, ({ one }) => ({
  ogImage: one(media, {
    fields: [subcategories.og_image_id],
    references: [media.id]
  }),
  category: one(categories, {
    fields: [subcategories.categoryId],
    references: [categories.id]
  })
}));
