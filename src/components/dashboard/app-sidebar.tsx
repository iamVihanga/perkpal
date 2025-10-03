"use client";

import {
  IconDashboard,
  // IconHelp,
  // IconSearch,
  IconSettings,
  IconList,
  IconMilitaryAward,
  IconRosette,
  IconBuildings,
  IconPennant,
  IconBooks
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
      title: "Basic Details",
      url: "/dashboard/basic-details",
      icon: IconList
    },
    {
      title: "Core Qualifications",
      url: "/dashboard/core-qualifications",
      icon: IconRosette
    },
    {
      title: "Education",
      url: "/dashboard/education",
      icon: IconBooks
    },
    {
      title: "Accomplishments",
      url: "/dashboard/accomplishments",
      icon: IconMilitaryAward
    },
    {
      title: "Projects",
      url: "/dashboard/projects",
      icon: IconBuildings
    },
    {
      title: "Experiences",
      url: "/dashboard/experiences",
      icon: IconPennant
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

                <span className="text-base font-semibold font-heading">
                  {`Hansie Daniel`}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
