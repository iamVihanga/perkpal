import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { SignoutButton } from "@/modules/auth/components/signout-button";
import Link from "next/link";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  return (
    <div className="bg-[#002E1C] text-amber-100 h-screen w-screen flex items-center justify-center flex-col">
      <h1 className="font-palo text-6xl font-black">{`PerkPal.`}</h1>

      <div className="space-y-3 mt-5 text-center">
        {session && (
          <p className="font-palo text-xs font-medium">
            Hello, {session.user.name || session.user.email}
          </p>
        )}

        <div className="flex items-center gap-2">
          {session ? (
            <>
              <SignoutButton className="bg-transparent text-amber-100" />

              <Button variant={"outline"} asChild>
                <Link href="/dashboard">
                  {session.user.role === "admin" && "Admin"} Dashboard
                </Link>
              </Button>
            </>
          ) : (
            <>
              <Button variant={"ghost"} asChild>
                <Link href="/signin">Sign In</Link>
              </Button>
              <Button variant={"outline"} asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
