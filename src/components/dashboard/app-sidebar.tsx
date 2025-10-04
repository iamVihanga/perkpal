"use client";

import {
  IconDashboard,
  IconSettings,
  IconPercentage,
  IconGift,
  IconFolder,
  IconBrowser
} from "@tabler/icons-react";
import * as React from "react";

import { NavMain } from "@/components/dashboard/nav-main";
import { NavSecondary } from "@/components/dashboard/nav-secondary";
import { NavUser } from "@/components/dashboard/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "../ui/sidebar";
import { PiBuilding } from "react-icons/pi";
import { NavAdmin } from "./nav-admin";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg"
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard
    },
    {
      title: "Deals",
      url: "/dashboard/deals",
      icon: IconPercentage
    },
    {
      title: "Perks",
      url: "/dashboard/perks",
      icon: IconGift
    },
    {
      title: "Categories",
      url: "/dashboard/categories",
      icon: IconFolder
    },
    {
      title: "Subcategories",
      url: "/dashboard/subcategories",
      icon: IconFolder
    }
  ],
  navFrontend: [
    {
      title: "Homepage",
      url: "/dashboard/site-settings/homepage",
      icon: IconBrowser
    },
    {
      title: "About Us",
      url: "/dashboard/site-settings/about-us",
      icon: IconBrowser
    },
    {
      title: "Partner with Us",
      url: "/dashboard/site-settings/partner-with-us",
      icon: IconBrowser
    },
    {
      title: "ToS/Privacy",
      url: "/dashboard/site-settings/tos-privacy",
      icon: IconBrowser
    },
    {
      title: "Contact",
      url: "/dashboard/site-settings/contact",
      icon: IconBrowser
    },
    {
      title: "Journal",
      url: "/dashboard/site-settings/journal",
      icon: IconBrowser
    }
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: IconSettings
    }
    // {
    //   title: "Get Help",
    //   url: "#",
    //   icon: IconHelp
    // },
    // {
    //   title: "Search",
    //   url: "#",
    //   icon: IconSearch
    // }
  ]
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <div>
                <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded">
                  <PiBuilding className="size-4" />
                </div>

                <span className="text-base font-palo font-bold">
                  {`PerkPal.`}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavAdmin items={data.navFrontend} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
