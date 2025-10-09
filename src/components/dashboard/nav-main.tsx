"use client";

import { type Icon, IconLogout } from "@tabler/icons-react";
import { ChevronDown } from "lucide-react";

import { Button } from "../ui/button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton
} from "../ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "../ui/collapsible";
import Link from "next/link";
import { useId, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { GiftIcon, Loader } from "lucide-react";

export function NavMain({
  items
}: {
  items: {
    title: string;
    url: string;
    icon?: Icon;
    roles?: string[];
    items?: {
      title: string;
      url: string;
      roles?: string[];
    }[];
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
    return pathname === href;
  };

  const isItemActive = (item: (typeof items)[0]): boolean => {
    if (item.items) {
      // For collapsible items, only check if any sub-item is active
      // Don't make the parent active just because we're in a sub-route
      return item.items.some((subItem) => isActive(subItem.url));
    }
    return isActive(item.url);
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
              <Link href="/dashboard/perks/new">
                <GiftIcon />
                <span>Quick Perk</span>
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

        <SidebarGroupLabel>Content Management</SidebarGroupLabel>

        <SidebarMenu className="space-y-1">
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              {item.items ? (
                <Collapsible
                  defaultOpen={isItemActive(item)}
                  className="group/collapsible"
                >
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={item.title}
                      variant={isItemActive(item) ? "active" : "secondary"}
                    >
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={isActive(subItem.url)}
                          >
                            <Link href={subItem.url}>
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </Collapsible>
              ) : (
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
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
