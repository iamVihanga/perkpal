import { createRouter } from "@/lib/server/create-app";

import * as handlers from "./handlers";
import * as routes from "./routes";

const router = createRouter()
  .openapi(routes.getSettingsRoute, handlers.getSiteSettingsHandler)
  .openapi(routes.upsertSiteSettingsRoute, handlers.upsertSiteSettingsHandler);

export default router;
