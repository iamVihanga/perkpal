/* eslint-disable @typescript-eslint/no-unused-vars */
import { hc } from "hono/client";

import { app } from "@/app/(backend)/api/[[...route]]/route";
import { env } from "@/lib/config/env";

type AppType = typeof app;

const client = hc<AppType>(env.NEXT_PUBLIC_CLIENT_APP_URL, {
  fetch: ((input, init) => {
    return fetch(input, {
      ...init,
      credentials: "include"
    });
  }) satisfies typeof fetch
});

export type Client = typeof client;

export default (...args: Parameters<typeof hc>): Client => hc<AppType>(...args);
