import {
  pgTable,
  text,
  jsonb,
  timestamp,
  boolean,
  pgEnum,
  integer
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { media } from "./media.schema";
import { FormFieldConfigT, seoFields, timestamps } from "@/lib/helpers";
import { categories, subcategories } from "./categories.schema";

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

export type FieldTypeT = (typeof fieldTypeEnum.enumValues)[number];

export const locationEnum = pgEnum("location", [
  "Malaysia",
  "Singapore",
  "Global"
]);

// ============================================
// PERKS TABLE (with embedded lead form config)
// ============================================
export const perks = pgTable("perks", {
  id: text("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: text("slug"),
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

  isFeatured: boolean("is_featured").notNull().default(false),
  status: text("status").notNull().default("active"),
  displayOrder: integer("display_order").default(0),

  ...seoFields,
  ...timestamps
});
