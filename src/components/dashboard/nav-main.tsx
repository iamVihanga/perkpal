"use client";

import { IconMail, type Icon, IconLogout } from "@tabler/icons-react";

import { Button } from "../ui/button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "../ui/sidebar";
import Link from "next/link";
import { useId, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Loader } from "lucide-react";

export function NavMain({
  items
}: {
  items: {
    title: string;
    url: string;
    icon?: Icon;
  }[];
}) {
  const [signingOut, setSigningOut] = useState(false);
  const toastId = useId();
  const router = useRouter();
  const pathname = usePathname();

  const handleSignout = async () => {
    try {
      setSigningOut(true);
      toast.loading("User signing out...", { id: toastId });

      const result = await authClient.signOut();

      if (result?.error) {
        throw new Error(result.error.message);
      }

      toast.success("Signed out successfully!", { id: toastId });
      router.refresh();
    } catch (err) {
      const error = err as Error;
      toast.error(`Failed: ${error.message}`, { id: toastId });
    } finally {
      setSigningOut(false);
    }
  };

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
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              asChild
              tooltip="Quick Create"
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
            >
              <Link href="/dashboard/inquiries">
                <IconMail />
                <span>View Inquiries</span>
              </Link>
            </SidebarMenuButton>
            <Button
              size="icon"
              className="size-8 group-data-[collapsible=icon]:opacity-0"
              variant="outline"
              onClick={handleSignout}
            >
              {signingOut ? (
                <Loader className="animate-spin" />
              ) : (
                <IconLogout />
              )}
              <span className="sr-only">Logout</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
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
