import { createRouter } from "@/lib/server/create-app";
import { AppOpenAPI } from "@/lib/types/server";
import { BASE_API_PATH } from "@/lib/config/constants";

import tasks from "./tasks";
import media from "./media";

export function registerRoutes(app: AppOpenAPI) {
  return app.route("/tasks", tasks).route("/media", media);
}

// stand alone router type used for api client
export const router = registerRoutes(createRouter().basePath(BASE_API_PATH));

export type Router = typeof router;
