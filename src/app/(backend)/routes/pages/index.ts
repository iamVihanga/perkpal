import { createRouter } from "@/lib/server/create-app";

import * as handlers from "./handlers";
import * as routes from "./routes";

const router = createRouter()
  .openapi(routes.getPage, handlers.getPage)
  .openapi(routes.createPage, handlers.createPage)
  .openapi(routes.updatePage, handlers.updatePage)
  .openapi(routes.deletePage, handlers.deletePage)
  .openapi(routes.getSectionsByPage, handlers.getSectionsByPage)
  .openapi(routes.createSection, handlers.createSection)
  .openapi(routes.updateSection, handlers.updateSection)
  .openapi(routes.deleteSection, handlers.deleteSection)
  .openapi(routes.reorderSections, handlers.reorderSections)
  .openapi(routes.listContentFields, handlers.listContentFields)
  .openapi(routes.createContentField, handlers.createContentField)
  .openapi(routes.updateContentField, handlers.updateContentField)
  .openapi(routes.deleteContentField, handlers.deleteContentField);

export default router;
