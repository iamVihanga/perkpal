ALTER TABLE "perks" DROP CONSTRAINT "perks_dates_check";--> statement-breakpoint
ALTER TABLE "perks" ALTER COLUMN "start_date" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "perks" ALTER COLUMN "start_date" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "perks" ALTER COLUMN "end_date" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "perks" ALTER COLUMN "end_date" DROP NOT NULL;