import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { env } from "@/lib/config/env";
import * as schema from "./schema";

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: false
});

export const db = drizzle({ client: pool, schema });
