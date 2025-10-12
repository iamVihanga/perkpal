"use client";

import * as React from "react";
import {
  IconDashboard,
  IconSettings,
  IconGift,
  IconBrowser,
  IconNews,
  IconUsersGroup,
  IconUserCog
} from "@tabler/icons-react";

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
      title: "Journal",
      url: "/dashboard/journals",
      icon: IconNews,
      items: [
        { title: "All Posts", url: "/dashboard/journal" },
        { title: "Add New Post", url: "/dashboard/journal/new" }
      ]
    },
    {
      title: "Deals & Perks",
      url: "/dashboard/perks",
      icon: IconGift,
      items: [
        { title: "All Perks", url: "/dashboard/perks" },
        { title: "Create Perk", url: "/dashboard/perks/new" },
        { title: "Categories", url: "/dashboard/categories" },
        { title: "Sub Categories", url: "/dashboard/subcategories" }
      ]
    },
    {
      title: "Manage Leads",
      url: "/dashboard/leads",
      icon: IconUsersGroup
    }
  ],
  navFrontend: [
    {
      title: "Pages",
      url: "/dashboard/site-settings",
      icon: IconBrowser,
      items: [
        {
          title: "Homepage",
          url: "/dashboard/site-settings/homepage"
        },
        {
          title: "About Us",
          url: "/dashboard/site-settings/about-us"
        },
        {
          title: "Partner with Us",
          url: "/dashboard/site-settings/partner-with-us"
        },
        {
          title: "ToS/Privacy",
          url: "/dashboard/site-settings/tos-privacy"
        },
        {
          title: "Contact",
          url: "/dashboard/site-settings/contact"
        },
        {
          title: "Journal",
          url: "/dashboard/site-settings/journal"
        }
      ]
    },
    {
      title: "User Management",
      icon: IconUserCog,
      url: "/dashboard/user-management"
    }
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: IconSettings
    }
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
