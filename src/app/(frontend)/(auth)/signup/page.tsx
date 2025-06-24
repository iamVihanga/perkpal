import { SignupForm } from "@/modules/auth/components/signup-form";
import { headers } from "next/headers";

export default async function SignupPage() {
  const headersList = await headers();
  const header_url = headersList.get("x-url") || "";

  const pathname = new URL(header_url).pathname;
  const isAgent = pathname === "/signup";

  return <SignupForm type={isAgent ? "agent" : "user"} />;
}
