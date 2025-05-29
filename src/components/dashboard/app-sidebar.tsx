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

// Static data that doesn't depend on user
const staticData = {
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

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const ConstantLogo = CalendarDays;
  const teamsWithConstantLogo = staticData.teams.map((team) => ({
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
        <NavMain items={staticData.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavSecondary items={staticData.navSecondary} />
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}