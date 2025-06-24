import { SigninForm } from "@/modules/auth/components/signin-form";
import { headers } from "next/headers";

export default async function SigninPage() {
  const headersList = await headers();
  const header_url = headersList.get("x-url") || "";

  const pathname = new URL(header_url).pathname;
  const isAgent = pathname === "/signup";

  return <SigninForm mode={isAgent ? "agent" : "user"} />;
}
