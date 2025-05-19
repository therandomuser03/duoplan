"use client";

import * as React from "react";
import {
  BookOpen,
  Calendar,
  House,
  Info,
  LifeBuoy,
  Link,
  LucideCalendarDays,
  Send,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUserWrapper } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/space-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavSecondary } from "./nav-secondary";

const data = {
  teams: [
    {
      name: "DuoPlan",
      logo: LucideCalendarDays,
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: House,
    },
    {
      title: "Calendar",
      url: "/dashboard/calendar",
      icon: Calendar,
    },
    {
      title: "Notes",
      url: "/dashboard/notes",
      icon: BookOpen,
    },
    {
      title: "Shared Plans",
      url: "/dashboard/shared-plans",
      icon: Link,
    },
    {
      title: "Help",
      url: "/dashboard/help",
      icon: Info,
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUserWrapper />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
