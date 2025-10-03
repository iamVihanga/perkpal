ALTER TABLE "media" ALTER COLUMN "url" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "media" ALTER COLUMN "size" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "media" ADD COLUMN "public_id" text;--> statement-breakpoint
ALTER TABLE "media" DROP COLUMN "type";--> statement-breakpoint
DROP TYPE "public"."media_type";