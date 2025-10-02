import { handle } from "hono/vercel";

import { app } from "@/app/(backend)/routes/registry";
import configureOpenAPI from "@/lib/server/open-api-config";

configureOpenAPI(app);

// Export handlers
export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const PATCH = handle(app);
