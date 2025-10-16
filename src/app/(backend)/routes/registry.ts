import createApp from "@/lib/server/create-app";
import { createRouter } from "@/lib/server/create-app";
import { AppOpenAPI } from "@/lib/types/server";
import { BASE_API_PATH } from "@/lib/config/constants";

import tasks from "./tasks";
import media from "./media";
import categories from "./categories";
import subcategories from "./subcategories";
import perks from "./perks";
import leads from "./leads";
import journal from "./journal";
import pages from "./pages";
import users from "./users";
import settings from "./settings";

export function registerRoutes(app: AppOpenAPI) {
  return app
    .route("/tasks", tasks)
    .route("/media", media)
    .route("/categories", categories)
    .route("/subcategories", subcategories)
    .route("/perks", perks)
    .route("/leads", leads)
    .route("/journal", journal)
    .route("/pages", pages)
    .route("/users", users)
    .route("/settings", settings);
}

// stand alone router type used for api client
export const router = registerRoutes(createRouter().basePath(BASE_API_PATH));

export type Router = typeof router;

export const app = registerRoutes(createApp());
