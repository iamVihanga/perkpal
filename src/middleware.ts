/* eslint-disable @typescript-eslint/no-explicit-any */
import { betterFetch } from "@better-fetch/fetch";
import type { Session } from "@/lib/auth";
import { NextResponse, type NextRequest } from "next/server";

const authRoutes = [
  "/signin",
  "/signup",
  "/reset-password",
  "/forgot-password",
  "/email-verified"
];

const protectedRoutes = ["/dashboard"];

export default async function authMiddleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isProtectedPath = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-url", request.url);

  if (authRoutes.includes(pathname) || isProtectedPath) {
    // Fetch session
    const { data: session } = await betterFetch<Session>(
      "/api/auth/get-session",
      {
        baseURL: request.nextUrl.origin,
        headers: {
          //get the cookie from the request
          cookie: request.headers.get("cookie") || ""
        }
      }
    );

    // If Auth route and Already authenticated,
    // Redirect back
    if (authRoutes.includes(pathname) && session) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // If protected route and Not authenticated,
    // Redirect back to signin
    if (isProtectedPath && !session) {
      return NextResponse.redirect(new URL("/signin", request.url));
    }

    /**
     * If dashboard route and authenticated,
     * Check, is user have active organization id in session,
     * If not, fetch list of organizations,
     * If user have at least organization, switch to first organization,
     * Otherwise, send 404 response
     */
    if (pathname === "/dashboard" && session) {
      if (!session.session.activeOrganizationId) {
        const { data: organizationsList } = await betterFetch(
          "/api/auth/organization/list",
          {
            baseURL: request.nextUrl.origin,
            headers: {
              //get the cookie from the request
              cookie: request.headers.get("cookie") || ""
            }
          }
        );

        if (!organizationsList || (organizationsList as []).length === 0) {
          return NextResponse.redirect(new URL("/404", request.url));
        }

        const orgId = (organizationsList as any[])?.[0]?.id as string;

        await betterFetch("/api/auth/organization/set-active", {
          baseURL: request.nextUrl.origin,
          headers: {
            cookie: request.headers.get("cookie") || ""
          },
          method: "POST",
          body: { organizationId: orgId }
        });

        console.log(
          `Agent '${session.session.userId}' switched to organization: '${orgId}'`
        );
      }
    }
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders
    }
  });
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)"
  ]
};
