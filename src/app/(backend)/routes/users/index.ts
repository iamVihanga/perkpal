import { createRouter } from "@/lib/server/create-app";

import * as handlers from "./handlers";
import * as routes from "./routes";

const router = createRouter()
  .openapi(routes.getById, handlers.getById)
  .openapi(routes.verify, handlers.verify);

export default router;
