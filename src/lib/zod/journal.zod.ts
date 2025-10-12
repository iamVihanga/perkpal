import { z } from "zod";
import { mediaSchema } from "./media.zod";

export const postBaseSchema = z.object({
  id: z.string(),

  title: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  content: z.string(),
  shortExcerpt: z.string().max(500),

  featuredImageId: z.string().nullable(),

  tags: z.array(z.string()).default([]),

  authorName: z.string(),
  authorLogoId: z.string(),

  // SEO Fields
  seoTitle: z.string().nullable(),
  seoDescription: z.string().nullable(),
  ogImageId: z.string().nullable(),

  createdAt: z.date().nullable(),
  updatedAt: z.date().nullable()
});

export type PostBaseT = z.infer<typeof postBaseSchema>;

// Select post schema
// Populate fields:
// - [featuredImageId -> featuredImage]
// - [authorLogoId -> authorLogo]
// - [og_image_id -> ogImage]
export const selectPostSchema = postBaseSchema
  .omit({ featuredImageId: true, authorLogoId: true, ogImageId: true })
  .extend({
    featuredImage: mediaSchema.optional(),
    authorLogo: mediaSchema.optional(),
    ogImage: mediaSchema.optional()
  });

// Create post Schema
export const createPostSchema = postBaseSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

// Update post Schema
export const updatePostSchema = createPostSchema.partial();

// Inffered Type Definitions
export type SelectPostT = z.infer<typeof selectPostSchema>;

export type CreatePostT = z.infer<typeof createPostSchema>;

export type UpdatePostT = z.infer<typeof updatePostSchema>;
