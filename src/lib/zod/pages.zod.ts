import { z } from "zod";
import { mediaSchema } from "./media.zod";

export const pageStatusEnumZod = z.enum(["draft", "published", "archived"]);

export const contentFieldsTypesEnumZod = z.enum([
  "text",
  "rich_text",
  "image",
  "video",
  "link",
  "number",
  "boolean"
]);

export type ContentFieldType = z.infer<typeof contentFieldsTypesEnumZod>;

// ---- Base Schemas ----
export const pagesBaseSchema = z.object({
  id: z.string(),

  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),

  status: pageStatusEnumZod.default("draft"),

  // SEO Fields - matching database schema
  seoTitle: z.string().nullable(),
  seoDescription: z.string().nullable(),
  og_image_id: z.string().nullable(),

  // Timestamps
  createdAt: z.date().nullable(),
  updatedAt: z.date().nullable()
});

export const sectionsBaseSchema = z.object({
  id: z.string(),
  pageId: z.string(),

  title: z.string().min(1, "Title is required"),
  description: z.string(),

  displayOrder: z.number().default(0),

  // Timestamps
  createdAt: z.date().nullable(),
  updatedAt: z.date().nullable()
});

export const contentFieldsBaseSchema = z.object({
  id: z.string(),
  pageId: z.string(),
  sectionId: z.string().nullable(),

  key: z.string().min(1, "Key is required"),
  value: z.string().min(1, "Value is required"),
  type: contentFieldsTypesEnumZod.default("text"),

  metadata: z.object({}).default({}),
  displayOrder: z.number().default(0),

  // Timestamps
  createdAt: z.date().nullable(),
  updatedAt: z.date().nullable()
});

// ---- Select Schemas ----
export const pagesSelectSchema = pagesBaseSchema
  .omit({
    og_image_id: true
  })
  .extend({
    ogImage: mediaSchema.optional()
  });

export const sectionsSelectSchema = sectionsBaseSchema;

export const contentFieldsSelectSchema = contentFieldsBaseSchema;

// ---- Create Schemas ----
export const pagesCreateSchema = pagesBaseSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const sectionsCreateSchema = sectionsBaseSchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    displayOrder: true
  })
  .extend({
    pageId: z.string().nullable().optional()
  });

export const contentFieldsCreateSchema = contentFieldsBaseSchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    displayOrder: true,
    pageId: true
  })
  .extend({
    sectionId: z.string().nullable().optional(),
    metadata: z.object({}).optional(), // Make metadata optional
    type: contentFieldsTypesEnumZod, // Remove default to make it required
    value: z.string().optional() // Make value optional for create
  });

// ---- Update Schemas ----
export const pagesUpdateSchema = pagesCreateSchema.partial();
export const sectionsUpdateSchema = sectionsCreateSchema.partial();
export const contentFieldsUpdateSchema = contentFieldsCreateSchema.partial();

// ---- Types ----
export type PagesBaseT = z.infer<typeof pagesBaseSchema>;
export type SectionsBaseT = z.infer<typeof sectionsBaseSchema>;
export type ContentFieldsBaseT = z.infer<typeof contentFieldsBaseSchema>;

export type PagesSelectT = z.infer<typeof pagesSelectSchema>;
export type SectionsSelectT = z.infer<typeof sectionsSelectSchema>;
export type ContentFieldsSelectT = z.infer<typeof contentFieldsSelectSchema>;

export type PagesCreateT = z.infer<typeof pagesCreateSchema>;
export type SectionsCreateT = z.infer<typeof sectionsCreateSchema>;
export type ContentFieldsCreateT = z.infer<typeof contentFieldsCreateSchema>;

export type PagesUpdateT = z.infer<typeof pagesUpdateSchema>;
export type SectionsUpdateT = z.infer<typeof sectionsUpdateSchema>;
export type ContentFieldsUpdateT = z.infer<typeof contentFieldsUpdateSchema>;
