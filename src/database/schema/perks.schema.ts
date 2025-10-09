import {
  pgTable,
  text,
  jsonb,
  timestamp,
  boolean,
  pgEnum,
  integer,
  index,
  uniqueIndex,
  check
} from "drizzle-orm/pg-core";
import { sql, relations } from "drizzle-orm";
import { media } from "./media.schema";
import { timestamps, seoFields } from "@/lib/server/helpers";
import { categories, subcategories } from "./categories.schema";

import type { FormFieldConfigT } from "@/lib/helpers";

export const redemptionMethodEnum = pgEnum("redemption_method", [
  "affiliate_link",
  "coupon_code",
  "form_submission"
]);

export const fieldTypeEnum = pgEnum("field_type", [
  "text",
  "email",
  "tel",
  "textarea",
  "select",
  "checkbox"
]);

export const locationEnum = pgEnum("location", [
  "Malaysia",
  "Singapore",
  "Global"
]);

// ============================================
// PERKS TABLE (with embedded lead form config)
// ============================================
export const perks = pgTable(
  "perks",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    title: text("title").notNull(),
    slug: text("slug").unique().notNull(),
    shortDescription: text("short_description"),
    longDescription: text("long_description"),
    vendorName: text("vendor_name"),
    logo: text("logo").references(() => media.id, { onDelete: "set null" }),
    banner: text("banner").references(() => media.id, { onDelete: "set null" }),
    location: locationEnum("location").notNull().default("Global"),
    redemptionMethod: redemptionMethodEnum("redemption_method").notNull(),

    // Redemption details vary based on method
    affiliateLink: text("affiliate_link"),
    couponCode: text("coupon_code"),
    // --- redemption for form submission ---
    leadFormSlug: text("lead_form_slug").unique(),
    leadFormConfig: jsonb("lead_form_config").$type<FormFieldConfigT>(),

    startDate: timestamp("start_date").notNull().defaultNow(),
    endDate: timestamp("end_date")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP + INTERVAL '30 days'`),

    // Category and Subcategory Relationships
    categoryId: text("category_id").references(() => categories.id, {
      onDelete: "set null"
    }),
    subcategoryId: text("subcategory_id").references(() => subcategories.id, {
      onDelete: "set null"
    }),

    keywords: text("keywords")
      .array()
      .default(sql`ARRAY[]::text[]`),

    isFeatured: boolean("is_featured").notNull().default(false),
    status: text("status").notNull().default("active"),
    displayOrder: integer("display_order").default(0),

    canonicalUrl: text("canonical_url"),

    ...seoFields,
    ...timestamps
  },
  (t) => [
    // Unique indexes
    uniqueIndex("perks_slug_idx").on(t.slug),
    uniqueIndex("perks_lead_form_slug_idx").on(t.leadFormSlug),

    // Performance indexes for common queries
    index("perks_id_idx").on(t.id),
    index("perks_title_idx").on(t.title),
    index("perks_category_id_idx").on(t.categoryId),
    index("perks_subcategory_id_idx").on(t.subcategoryId),
    index("perks_location_idx").on(t.location),
    index("perks_redemption_method_idx").on(t.redemptionMethod),
    index("perks_status_idx").on(t.status),
    index("perks_display_order_idx").on(t.displayOrder),
    index("perks_is_featured_idx").on(t.isFeatured),
    index("perks_start_date_idx").on(t.startDate),
    index("perks_end_date_idx").on(t.endDate),
    index("perks_created_at_idx").on(t.createdAt),

    // Composite indexes for common filter combinations
    index("perks_category_status_idx").on(t.categoryId, t.status),
    index("perks_location_status_idx").on(t.location, t.status),
    index("perks_featured_status_idx").on(t.isFeatured, t.status),
    index("perks_redemption_status_idx").on(t.redemptionMethod, t.status),
    index("perks_dates_status_idx").on(t.startDate, t.endDate, t.status),
    index("perks_category_location_idx").on(t.categoryId, t.location),

    // Constraints
    check("perks_display_order_check", sql`${t.displayOrder} >= 0`),
    check("perks_dates_check", sql`${t.endDate} > ${t.startDate}`),
    check(
      "perks_status_check",
      sql`${t.status} IN ('active', 'inactive', 'expired', 'draft')`
    ),

    // Conditional constraints for redemption methods
    check(
      "perks_affiliate_link_check",
      sql`(${t.redemptionMethod} = 'affiliate_link' AND ${t.affiliateLink} IS NOT NULL) OR ${t.redemptionMethod} != 'affiliate_link'`
    ),
    check(
      "perks_coupon_code_check",
      sql`(${t.redemptionMethod} = 'coupon_code' AND ${t.couponCode} IS NOT NULL) OR ${t.redemptionMethod} != 'coupon_code'`
    ),
    check(
      "perks_form_submission_check",
      sql`(${t.redemptionMethod} = 'form_submission' AND ${t.leadFormSlug} IS NOT NULL AND ${t.leadFormConfig} IS NOT NULL) OR ${t.redemptionMethod} != 'form_submission'`
    )
  ]
);

// ============================================
// PERKS RELATIONS
// ============================================
export const perksRelations = relations(perks, ({ one }) => ({
  // Media relations
  logoImage: one(media, {
    fields: [perks.logo],
    references: [media.id],
    relationName: "perk_logo"
  }),
  bannerImage: one(media, {
    fields: [perks.banner],
    references: [media.id],
    relationName: "perk_banner"
  }),
  opengraphImage: one(media, {
    fields: [perks.og_image_id],
    references: [media.id],
    relationName: "perk_og_image"
  }),

  // Category relations
  category: one(categories, {
    fields: [perks.categoryId],
    references: [categories.id]
  }),
  subcategory: one(subcategories, {
    fields: [perks.subcategoryId],
    references: [subcategories.id]
  })
}));
