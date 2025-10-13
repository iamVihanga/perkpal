CREATE TYPE "public"."content_field_type" AS ENUM('text', 'rich_text', 'image', 'video', 'link', 'number', 'boolean');--> statement-breakpoint
CREATE TYPE "public"."page_status" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TABLE "content_fields" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"page_id" text NOT NULL,
	"section_id" text,
	"key" text NOT NULL,
	"value" text NOT NULL,
	"type" "content_field_type" DEFAULT 'text',
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"display_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "pages" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"status" "page_status" DEFAULT 'draft' NOT NULL,
	"seo_title" text,
	"seo_description" text,
	"og_image_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "pages_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "sections" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"page_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"display_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "global_settings" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"key" text NOT NULL,
	"value" text NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "content_fields" ADD CONSTRAINT "content_fields_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_fields" ADD CONSTRAINT "content_fields_section_id_sections_id_fk" FOREIGN KEY ("section_id") REFERENCES "public"."sections"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pages" ADD CONSTRAINT "pages_og_image_id_media_id_fk" FOREIGN KEY ("og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sections" ADD CONSTRAINT "sections_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "content_fields_id_idx" ON "content_fields" USING btree ("id");--> statement-breakpoint
CREATE INDEX "content_fields_page_id_idx" ON "content_fields" USING btree ("page_id");--> statement-breakpoint
CREATE UNIQUE INDEX "content_fields_section_key_idx" ON "content_fields" USING btree ("section_id","key");--> statement-breakpoint
CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "pages_id_idx" ON "pages" USING btree ("id");--> statement-breakpoint
CREATE INDEX "pages_title_idx" ON "pages" USING btree ("title");--> statement-breakpoint
CREATE INDEX "sections_id_idx" ON "sections" USING btree ("id");--> statement-breakpoint
CREATE INDEX "sections_page_id_idx" ON "sections" USING btree ("page_id");--> statement-breakpoint
CREATE INDEX "global_settings_id_idx" ON "global_settings" USING btree ("id");