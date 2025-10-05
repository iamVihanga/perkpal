ALTER TABLE "categories" DROP CONSTRAINT "categories_display_order_check";--> statement-breakpoint
ALTER TABLE "subcategories" DROP CONSTRAINT "categories_display_order_check";--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_display_order_check" CHECK ("categories"."display_order" >= 0);--> statement-breakpoint
ALTER TABLE "subcategories" ADD CONSTRAINT "subcategories_display_order_check" CHECK ("subcategories"."display_order" >= 0);