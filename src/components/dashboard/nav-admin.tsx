"use client";

import { type Icon } from "@tabler/icons-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "../ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function NavAdmin({
  items
}: {
  items: {
    title: string;
    url: string;
    icon?: Icon;
  }[];
}) {
  const pathname = usePathname();
  const {
    data: session,
    error: sessionErr,
    isPending: sessionLoading
  } = authClient.useSession();

  if (sessionLoading) return <></>;

  if (sessionErr) return <></>;

  if (session?.user.role !== "admin") return <></>;

  const isActive = (href: string): boolean => {
    if (href === "/dashboard") {
      return pathname === href;
    } else {
      const trimmedPathname = pathname.replace("/dashboard", "");
      const trimmedUrl = href.replace("/dashboard", "");
      return (
        trimmedPathname.startsWith(trimmedUrl) || trimmedPathname === trimmedUrl
      );
    }
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Frontend</SidebarGroupLabel>

      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu className="space-y-1">
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                variant={isActive(item.url) ? "active" : "secondary"}
              >
                <Link href={item.url}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
