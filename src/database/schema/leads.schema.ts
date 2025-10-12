import { pgTable, text, jsonb, index } from "drizzle-orm/pg-core";
import { sql, relations } from "drizzle-orm";

import { timestamps } from "@/lib/server/helpers";
import { perks } from "./perks.schema";
import { LeadDataT } from "@/lib/helpers";

export const leads = pgTable(
  "leads",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),

    perkId: text("perk_id").references(() => perks.id, { onDelete: "cascade" }),
    data: jsonb("data").$type<LeadDataT>(),

    ip: text("ip"),

    ...timestamps
  },
  (t) => [index("lead_id_idx").on(t.id), index("lead_perk_id_idx").on(t.perkId)]
);

export const leadsRelations = relations(leads, ({ one }) => ({
  perk: one(perks, {
    fields: [leads.perkId],
    references: [perks.id]
  })
}));
