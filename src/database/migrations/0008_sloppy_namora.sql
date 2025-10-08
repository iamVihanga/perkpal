ALTER TABLE "perks" ALTER COLUMN "slug" SET NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "perks_slug_idx" ON "perks" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "perks_lead_form_slug_idx" ON "perks" USING btree ("lead_form_slug");--> statement-breakpoint
CREATE INDEX "perks_id_idx" ON "perks" USING btree ("id");--> statement-breakpoint
CREATE INDEX "perks_title_idx" ON "perks" USING btree ("title");--> statement-breakpoint
CREATE INDEX "perks_category_id_idx" ON "perks" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "perks_subcategory_id_idx" ON "perks" USING btree ("subcategory_id");--> statement-breakpoint
CREATE INDEX "perks_location_idx" ON "perks" USING btree ("location");--> statement-breakpoint
CREATE INDEX "perks_redemption_method_idx" ON "perks" USING btree ("redemption_method");--> statement-breakpoint
CREATE INDEX "perks_status_idx" ON "perks" USING btree ("status");--> statement-breakpoint
CREATE INDEX "perks_display_order_idx" ON "perks" USING btree ("display_order");--> statement-breakpoint
CREATE INDEX "perks_is_featured_idx" ON "perks" USING btree ("is_featured");--> statement-breakpoint
CREATE INDEX "perks_start_date_idx" ON "perks" USING btree ("start_date");--> statement-breakpoint
CREATE INDEX "perks_end_date_idx" ON "perks" USING btree ("end_date");--> statement-breakpoint
CREATE INDEX "perks_created_at_idx" ON "perks" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "perks_category_status_idx" ON "perks" USING btree ("category_id","status");--> statement-breakpoint
CREATE INDEX "perks_location_status_idx" ON "perks" USING btree ("location","status");--> statement-breakpoint
CREATE INDEX "perks_featured_status_idx" ON "perks" USING btree ("is_featured","status");--> statement-breakpoint
CREATE INDEX "perks_redemption_status_idx" ON "perks" USING btree ("redemption_method","status");--> statement-breakpoint
CREATE INDEX "perks_dates_status_idx" ON "perks" USING btree ("start_date","end_date","status");--> statement-breakpoint
CREATE INDEX "perks_category_location_idx" ON "perks" USING btree ("category_id","location");--> statement-breakpoint
ALTER TABLE "perks" ADD CONSTRAINT "perks_slug_unique" UNIQUE("slug");--> statement-breakpoint
ALTER TABLE "perks" ADD CONSTRAINT "perks_display_order_check" CHECK ("perks"."display_order" >= 0);--> statement-breakpoint
ALTER TABLE "perks" ADD CONSTRAINT "perks_dates_check" CHECK ("perks"."end_date" > "perks"."start_date");--> statement-breakpoint
ALTER TABLE "perks" ADD CONSTRAINT "perks_status_check" CHECK ("perks"."status" IN ('active', 'inactive', 'expired', 'draft'));--> statement-breakpoint
ALTER TABLE "perks" ADD CONSTRAINT "perks_affiliate_link_check" CHECK (("perks"."redemption_method" = 'affiliate_link' AND "perks"."affiliate_link" IS NOT NULL) OR "perks"."redemption_method" != 'affiliate_link');--> statement-breakpoint
ALTER TABLE "perks" ADD CONSTRAINT "perks_coupon_code_check" CHECK (("perks"."redemption_method" = 'coupon_code' AND "perks"."coupon_code" IS NOT NULL) OR "perks"."redemption_method" != 'coupon_code');--> statement-breakpoint
ALTER TABLE "perks" ADD CONSTRAINT "perks_form_submission_check" CHECK (("perks"."redemption_method" = 'form_submission' AND "perks"."lead_form_slug" IS NOT NULL AND "perks"."lead_form_config" IS NOT NULL) OR "perks"."redemption_method" != 'form_submission');