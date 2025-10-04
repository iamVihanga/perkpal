"use client";

import { type Icon } from "@tabler/icons-react";
import { ChevronDown } from "lucide-react";

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
import { usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function NavAdmin({
  items
}: {
  items: {
    title: string;
    url: string;
    icon?: Icon;
    items?: {
      title: string;
      url: string;
    }[];
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

  const isItemActive = (item: (typeof items)[0]): boolean => {
    if (item.items) {
      // Check if any sub-item is active
      return (
        item.items.some((subItem) => isActive(subItem.url)) ||
        isActive(item.url)
      );
    }
    return isActive(item.url);
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Frontend</SidebarGroupLabel>

      <SidebarGroupContent className="flex flex-col gap-2">
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
