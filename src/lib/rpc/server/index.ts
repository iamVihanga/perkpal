import { cookies } from "next/headers";

import { env } from "@/lib/config/env";
import rpc from "../base_instance";

export const getClient = async () => {
  const cookiesStore = await cookies();

  const cookiesList = cookiesStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

  return rpc(env.CLIENT_APP_URL, {
    headers: {
      cookie: cookiesList
    }
  });
};
