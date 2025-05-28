"use client";

import * as React from "react";
import {
  LifeBuoy,
  Send,
  CalendarDays,
  BookText,
  Link,
} from "lucide-react";

import { NavMain } from "@/components/dashboard/nav-main";
import { NavUser } from "@/components/dashboard/nav-user";
import { TeamSwitcher } from "@/components/dashboard/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

import { NavSecondary } from "./nav-secondary";
import { Calendar } from "../ui/calendar";

const data = {
  user: {
    name: "shadcn",
    email: "email@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Notes",
      url: "/notes",
      icon: BookText,
    },
    {
      title: "Shared Notes",
      url: "/shared-notes",
      icon: Link,
    },
  ],
  navSecondary: [
    { title: "Support", url: "/support", icon: LifeBuoy },
    { title: "Feedback", url: "/feedback", icon: Send },
  ],
};

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  // const { state } = useSidebar();
  // const isCollapsed = state === "collapsed";
  const ConstantLogo = CalendarDays;
  const teamsWithConstantLogo = data.teams.map((team) => ({
    ...team,
    logo: ConstantLogo,
  }));

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={teamsWithConstantLogo} />
      </SidebarHeader>
      <SidebarContent>
            <Calendar />
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavSecondary items={data.navSecondary} />
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
