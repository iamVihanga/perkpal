CREATE TABLE "leads" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"perk_id" text,
	"data" jsonb,
	"ip" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_perk_id_perks_id_fk" FOREIGN KEY ("perk_id") REFERENCES "public"."perks"("id") ON DELETE cascade ON UPDATE no action;