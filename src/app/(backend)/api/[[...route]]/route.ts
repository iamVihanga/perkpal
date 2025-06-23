import { handle } from "hono/vercel";

import { registerRoutes } from "@/app/(backend)/routes/registry";
import createApp from "@/lib/server/create-app";
import configureOpenAPI from "@/lib/server/open-api-config";

export const app = registerRoutes(createApp());

configureOpenAPI(app);

// Export handlers
export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const PATCH = handle(app);
