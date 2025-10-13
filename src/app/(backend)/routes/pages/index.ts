import { createRouter } from "@/lib/server/create-app";

import * as handlers from "./handlers";
import * as routes from "./routes";

const router = createRouter()
  .openapi(routes.getPage, handlers.getPage)
  .openapi(routes.createPage, handlers.createPage)
  .openapi(routes.updatePage, handlers.updatePage)
  .openapi(routes.deletePage, handlers.deletePage);

export default router;
