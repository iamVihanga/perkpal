import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { env } from "@/lib/config/env";
import * as schema from "./schema";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || env.DATABASE_URL,

  // UNCOMMENT for database seeding
  // connectionString:
  //   "postgresql://postgres:vihanga123@localhost:5432/perk-pal?schema=public",
  ssl: false
});

export const db = drizzle({ client: pool, schema });
