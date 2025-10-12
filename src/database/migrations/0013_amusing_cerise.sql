CREATE INDEX "lead_id_idx" ON "leads" USING btree ("id");--> statement-breakpoint
CREATE INDEX "lead_perk_id_idx" ON "leads" USING btree ("perk_id");