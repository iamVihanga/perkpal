import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

interface AdminOnlyLayoutProps {
  children: React.ReactNode;
}

export default async function AdminOnlyLayout({
  children
}: AdminOnlyLayoutProps) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (session?.user.role !== "admin") {
    notFound();
  }

  return <div>{children}</div>;
}
