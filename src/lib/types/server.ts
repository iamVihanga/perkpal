/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { OpenAPIHono, RouteConfig, RouteHandler } from "@hono/zod-openapi";

import { auth } from "@/lib/auth";
import { BASE_API_PATH } from "@/lib/config/constants";

export interface AppBindings {
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
}

export type AppOpenAPI = OpenAPIHono<AppBindings, {}, typeof BASE_API_PATH>;

export type AppRouteHandler<R extends RouteConfig> = RouteHandler<
  R,
  AppBindings
>;
