import { getCookies } from "cookies-next/client";
import rpc from "../base_instance";

export const getClient = async () => {
  const cookieStore = getCookies();

  let cookiesList;

  if (cookieStore) {
    cookiesList = Object.entries(cookieStore)
      .map(([name, value]) => `${name}=${value}`)
      .join("; ");
  } else {
    cookiesList = "";
  }

  return rpc(process.env.NEXT_PUBLIC_CLIENT_APP_URL!, {
    headers: {
      cookie: cookiesList
    }
  });
};
