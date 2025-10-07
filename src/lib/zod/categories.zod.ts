import { z } from "zod";
import { mediaSchema } from "./media.zod";

export const categoryBaseSchema = z.object({
  id: z.string(),

  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  description: z.string().nullable(),

  displayOrder: z.number().min(0).default(0),

  // SEO Fields
  seoTitle: z.string().nullable(),
  seoDescription: z.string().nullable(),
  ogImageId: z.string().nullable(),

  createdAt: z.date().nullable(),
  updatedAt: z.date().nullable()
});

export const subcategoryBaseSchema = z.object({
  id: z.string(),
  categoryId: z.string().nullable(),

  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(255),
  description: z.string().nullable(),

  displayOrder: z.number().min(0).default(0),

  // SEO Fields
  seoTitle: z.string().nullable(),
  seoDescription: z.string().nullable(),
  ogImageId: z.string().nullable(),

  updatedAt: z.date().nullable(),
  createdAt: z.date().nullable()
});

export type CategoryBaseT = z.infer<typeof categoryBaseSchema>;
export type SubcategoryBaseT = z.infer<typeof subcategoryBaseSchema>;

// Select subcategory schema
// Populate fields:
// - [opengraphImage]
// - [category] as parent as baseCategorySchema
export const selectSubcategorySchema = subcategoryBaseSchema
  .omit({ ogImageId: true })
  .extend({
    opengraphImage: mediaSchema.optional()
  });

// Select category schema
// Populate Fields:
// - [opengraphImage]
// - [subcategories] as array of selectSubcategorySchema
export const selectCategorySchema = categoryBaseSchema
  .omit({ ogImageId: true })
  .extend({
    subcategories: z.array(selectSubcategorySchema).optional(),
    opengraphImage: mediaSchema.optional()
  });

// Create Category Schema
export const createCategorySchema = categoryBaseSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  displayOrder: true
});

// Create Subcategory Schema
export const createSubcategorySchema = subcategoryBaseSchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    categoryId: true,
    displayOrder: true
  })
  .extend({
    parentCategoryId: z.string().min(1).max(255)
  });

// Update Category Schema
export const updateCategorySchema = createCategorySchema.partial();

// Update Subcategory Schema
export const updateSubcategorySchema = createSubcategorySchema.partial();

// Inffered Type Definitions
export type SelectCategoryT = z.infer<typeof selectCategorySchema>;
export type SelectSubcategoryT = z.infer<typeof selectSubcategorySchema>;

export type CreateCategoryT = z.infer<typeof createCategorySchema>;
export type CreateSubcategoryT = z.infer<typeof createSubcategorySchema>;

export type UpdateCategoryT = z.infer<typeof updateCategorySchema>;
export type UpdateSubcategoryT = z.infer<typeof updateSubcategorySchema>;
