import { timestamps } from "@/lib/server/helpers";
import { sql } from "drizzle-orm";
import { index, jsonb, pgTable, text } from "drizzle-orm/pg-core";

export const globalSettings = pgTable(
  "global_settings",
  {
    id: text("id")
      .primaryKey()
      .default(sql`gen_random_uuid()`),

    key: text("key").notNull(),
    value: text("value").notNull(),

    metadata: jsonb("metadata").default(sql`'{}'::jsonb`),
    ...timestamps
  },
  (t) => [index("global_settings_id_idx").on(t.id)]
);
