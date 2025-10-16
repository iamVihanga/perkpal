import { createRouter } from "@/lib/server/create-app";

import * as handlers from "./handlers";
import * as routes from "./routes";

const router = createRouter()
  .openapi(routes.getDashboardMetrics, handlers.getDashboardMetrics)
  .openapi(routes.getRecentSubmissions, handlers.getRecentSubmissions)
  .openapi(routes.getPerformanceTrends, handlers.getPerformanceTrends);

export default router;
