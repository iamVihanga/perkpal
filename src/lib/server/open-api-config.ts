import { Scalar } from "@scalar/hono-api-reference";

import { AppOpenAPI } from "@/lib/types/server";
import { BASE_API_PATH } from "@/lib/config/constants";

import packageJson from "../../../package.json";

export default function configureOpenAPI(app: AppOpenAPI): void {
  app.doc("/doc", {
    openapi: "3.0.0",
    info: {
      version: packageJson.version,
      title: "Hono Advanced API with Bun"
    }
  });

  app.get(
    "/reference",
    Scalar({
      theme: "kepler",
      url: `${BASE_API_PATH}/doc`
    })
  );
}
