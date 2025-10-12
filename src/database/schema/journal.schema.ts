import { seoFields, timestamps } from "@/lib/server/helpers";
import { relations, sql } from "drizzle-orm";
import { index, pgTable, text, uniqueIndex } from "drizzle-orm/pg-core";
import { media } from "./media.schema";

export const posts = pgTable(
  "posts",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),

    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    content: text("content").notNull(),
    shortExcerpt: text("short_excerpt"),

    featuredImageId: text("featured_image_id").references(() => media.id, {
      onDelete: "set null"
    }),

    tags: text("tags")
      .array()
      .default(sql`ARRAY[]::text[]`),

    authorName: text("author_name"),
    authorLogoId: text("author_logo_id").references(() => media.id),

    ...seoFields,

    ...timestamps
  },
  (t) => [
    uniqueIndex("posts_slug_idx").on(t.slug),

    index("posts_id_idx").on(t.id),
    index("posts_title_idx").on(t.title)
  ]
);

export const postRelations = relations(posts, ({ one }) => ({
  featuredImage: one(media, {
    fields: [posts.featuredImageId],
    references: [media.id]
  }),
  authorLogo: one(media, {
    fields: [posts.authorLogoId],
    references: [media.id]
  }),
  ogImage: one(media, {
    fields: [posts.og_image_id],
    references: [media.id]
  })
}));
