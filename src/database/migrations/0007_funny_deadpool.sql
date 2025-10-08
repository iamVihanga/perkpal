CREATE TYPE "public"."field_type" AS ENUM('text', 'email', 'tel', 'textarea', 'select', 'checkbox');--> statement-breakpoint
CREATE TYPE "public"."location" AS ENUM('Malaysia', 'Singapore', 'Global');--> statement-breakpoint
CREATE TYPE "public"."redemption_method" AS ENUM('affiliate_link', 'coupon_code', 'form_submission');--> statement-breakpoint

CREATE TABLE "perks" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"slug" text,
	"short_description" text,
	"long_description" text,
	"vendor_name" text,
	"logo" text,
	"banner" text,
	"location" "location" DEFAULT 'Global' NOT NULL,
	"redemption_method" "redemption_method" NOT NULL,
	"affiliate_link" text,
	"coupon_code" text,
	"lead_form_slug" text,
	"lead_form_config" jsonb,
	"start_date" timestamp DEFAULT now() NOT NULL,
	"end_date" timestamp DEFAULT CURRENT_TIMESTAMP + INTERVAL '30 days' NOT NULL,
	"category_id" text,
	"subcategory_id" text,
	"is_featured" boolean DEFAULT false NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"display_order" integer DEFAULT 0,
	"seo_title" text,
	"seo_description" text,
	"og_image_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "perks_lead_form_slug_unique" UNIQUE("lead_form_slug")
);
--> statement-breakpoint
ALTER TABLE "perks" ADD CONSTRAINT "perks_logo_media_id_fk" FOREIGN KEY ("logo") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "perks" ADD CONSTRAINT "perks_banner_media_id_fk" FOREIGN KEY ("banner") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "perks" ADD CONSTRAINT "perks_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "perks" ADD CONSTRAINT "perks_subcategory_id_subcategories_id_fk" FOREIGN KEY ("subcategory_id") REFERENCES "public"."subcategories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "perks" ADD CONSTRAINT "perks_og_image_id_media_id_fk" FOREIGN KEY ("og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;