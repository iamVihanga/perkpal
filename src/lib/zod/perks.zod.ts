import { z } from "zod";

import {
  redemptionMethodEnum,
  fieldTypeEnum,
  locationEnum
} from "@/database/schema";
import { mediaSchema } from "./media.zod";
import {
  selectCategorySchema,
  selectSubcategorySchema
} from "./categories.zod";

// Perks Related Enums Zod
export const redemptionMethodEnumZod = z.enum(redemptionMethodEnum.enumValues);

export type RedemptionMethodT = z.infer<typeof redemptionMethodEnumZod>;

export const fieldTypeEnumZod = z.enum(fieldTypeEnum.enumValues);

export type FieldTypeT = z.infer<typeof fieldTypeEnumZod>;

export const locationEnumZod = z.enum(locationEnum.enumValues);

export type LocationT = z.infer<typeof locationEnumZod>;

// Query and other api related schemas
export const perksQueryParamsSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  sort: z.enum(["asc", "desc"]).optional().default("desc"),

  // Filters
  search: z.string().optional(),
  categoryId: z.string().optional(),
  subcategoryId: z.string().optional(),
  location: z.string().optional(),
  status: z.string().optional(),
  redemptionMethod: z.string().optional()
});

export type PerksQueryParamsSchema = z.infer<typeof perksQueryParamsSchema>;

export const getSinglePerkQuerySchema = z
  .object({
    id: z.string().optional(),
    slug: z.string().optional()
  })
  .refine((data) => data.id || data.slug, {
    message: "Either id or slug must be provided"
  });

export type GetSinglePerkQueryT = z.infer<typeof getSinglePerkQuerySchema>;

// Lead Form Config Schema (for form submission redemption method)
export const leadFormConfigSchema = z.object({
  fields: z.array(
    z.object({
      id: z.string(),
      type: fieldTypeEnumZod,
      label: z.string().min(1, "Field label is required"),
      placeholder: z.string().optional(),
      required: z.boolean().default(false),
      options: z.array(z.string()).optional(),
      validation: z
        .object({
          pattern: z.string().optional(),
          minLength: z.number().int().min(0).optional(),
          maxLength: z.number().int().min(1).optional(),
          errorMessage: z.string().optional()
        })
        .optional(),
      helpText: z.string().optional()
    })
  ),
  thankYou: z.object({
    title: z.string().min(1, "Thank you title is required"),
    message: z.string().min(1, "Thank you message is required"),
    showPerkDetails: z.boolean().default(true)
  }),
  redirect: z
    .object({
      enabled: z.boolean().default(false),
      url: z.string().url().optional(),
      delay: z.number().int().min(0).default(3000)
    })
    .optional(),
  notification: z
    .object({
      enabled: z.boolean().default(false),
      partnerEmail: z.string().email().optional(),
      sendImmediately: z.boolean().default(true)
    })
    .optional(),
  consent: z.object({
    required: z.boolean().default(true),
    text: z.string().min(1, "Consent text is required")
  })
});

// Base Perk Schema
export const perkBaseSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required").max(255),
  slug: z.string().min(1, "Slug is required").max(255),
  shortDescription: z.string().nullable(),
  longDescription: z.string().nullable(),
  vendorName: z.string().nullable(),
  logo: z.string().nullable(),
  banner: z.string().nullable(),
  location: locationEnumZod.default("Global"),
  redemptionMethod: redemptionMethodEnumZod,

  // Redemption details vary based on method
  affiliateLink: z.string().url().nullable(),
  couponCode: z.string().nullable(),
  leadFormSlug: z.string().nullable(),
  leadFormConfig: leadFormConfigSchema.nullable(),

  startDate: z.date(),
  endDate: z.date(),

  categoryId: z.string().nullable(),
  subcategoryId: z.string().nullable(),

  isFeatured: z.boolean().default(false),
  displayOrder: z.number().int().min(0).default(0),
  status: z.string().default("active"),

  keywords: z.string().array().default([]),

  // SEO Fields
  seoTitle: z.string().nullable(),
  seoDescription: z.string().nullable(),
  ogImageId: z.string().nullable(),

  createdAt: z.date().nullable(),
  updatedAt: z.date().nullable()
});

// Select Perk Schema (with populated relations)
export const selectPerkSchema = perkBaseSchema
  .omit({ ogImageId: true })
  .extend({
    category: selectCategorySchema.optional(),
    subcategory: selectSubcategorySchema.optional(),
    logoImage: mediaSchema.optional(),
    bannerImage: mediaSchema.optional(),
    opengraphImage: mediaSchema.optional()
  });

// Create Perk Schema
export const createPerkSchema = perkBaseSchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    displayOrder: true
  })
  .extend({
    // Validation for redemption method specific fields
    affiliateLink: z.string().url().optional().nullable(),
    couponCode: z.string().max(100).optional().nullable(),
    leadFormSlug: z.string().max(255).optional().nullable()
  })
  .refine(
    (data) => {
      // Validate that required fields are provided based on redemption method
      if (data.redemptionMethod === "affiliate_link" && !data.affiliateLink) {
        return false;
      }
      if (data.redemptionMethod === "coupon_code" && !data.couponCode) {
        return false;
      }
      if (
        data.redemptionMethod === "form_submission" &&
        (!data.leadFormSlug || !data.leadFormConfig)
      ) {
        return false;
      }
      return true;
    },
    {
      message:
        "Required redemption fields must be provided based on redemption method"
    }
  )
  .refine(
    (data) => {
      // Validate end date is after start date
      return data.endDate > data.startDate;
    },
    {
      message: "End date must be after start date"
    }
  );

// Update Perk Schema (base schema made partial, then add refinements)
export const updatePerkSchema = perkBaseSchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    displayOrder: true
  })
  .extend({
    // Allow updating redemption method specific fields
    affiliateLink: z.string().url().optional().nullable(),
    couponCode: z.string().max(100).optional().nullable(),
    leadFormSlug: z.string().max(255).optional().nullable(),
    status: z.string().optional()
  })
  .partial()
  .refine(
    (data) => {
      // Only validate redemption method fields if redemptionMethod is being updated
      if (!data.redemptionMethod) return true;

      if (data.redemptionMethod === "affiliate_link" && !data.affiliateLink) {
        return false;
      }
      if (data.redemptionMethod === "coupon_code" && !data.couponCode) {
        return false;
      }
      if (
        data.redemptionMethod === "form_submission" &&
        (!data.leadFormSlug || !data.leadFormConfig)
      ) {
        return false;
      }
      return true;
    },
    {
      message:
        "Required redemption fields must be provided based on redemption method"
    }
  )
  .refine(
    (data) => {
      // Validate end date is after start date if both are provided
      if (data.startDate && data.endDate) {
        return data.endDate > data.startDate;
      }
      return true;
    },
    {
      message: "End date must be after start date"
    }
  );

// Type Definitions
export type PerkBaseT = z.infer<typeof perkBaseSchema>;
export type SelectPerkT = z.infer<typeof selectPerkSchema>;
export type CreatePerkT = z.infer<typeof createPerkSchema>;
export type UpdatePerkT = z.infer<typeof updatePerkSchema>;
export type LeadFormConfigT = z.infer<typeof leadFormConfigSchema>;

// Additional utility schemas for API endpoints
export const perkStatusSchema = z.enum([
  "active",
  "inactive",
  "expired",
  "draft"
]);

export const perkQueryParamsSchema = z.object({
  page: z.string().optional().default("1"),
  limit: z.string().optional().default("10"),
  search: z.string().optional(),
  categoryId: z.string().optional(),
  subcategoryId: z.string().optional(),
  location: locationEnumZod.optional(),
  redemptionMethod: redemptionMethodEnumZod.optional(),
  status: perkStatusSchema.optional(),
  isFeatured: z.string().optional(),
  sortBy: z
    .enum(["title", "createdAt", "startDate", "endDate", "displayOrder"])
    .optional()
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc")
});

export type PerkQueryParamsT = z.infer<typeof perkQueryParamsSchema>;
