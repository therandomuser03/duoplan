// src/components/dashboard/app-sidebar.tsx

"use client";

import * as React from "react";
import { LifeBuoy, Send, BookText, Link } from "lucide-react";

import { NavMain } from "@/components/dashboard/nav-main";
import { NavUser } from "@/components/dashboard/nav-user";
import { SpaceSwitcher } from "@/components/dashboard/space-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

import { NavSecondary } from "./nav-secondary";
import { Calendar } from "../ui/calendar";
import { createClient } from "@/utils/supabase/client";

const staticData = {
  teams: [
    { name: "Acme Inc", plan: "Enterprise" },
    { name: "Acme Corp.", plan: "Startup" },
    { name: "Evil Corp.", plan: "Free" },
  ],
  navMain: [
    { title: "Notes", url: "/notes", icon: BookText },
    { title: "Shared Notes", url: "/shared-notes", icon: Link },
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
  const supabase = createClient();
  const [userId, setUserId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const getUserId = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (user?.id) {
        setUserId(user.id);
      } else {
        console.error("❌ No user ID found", error);
      }
    };

    getUserId();
  }, [supabase]);

  if (!userId) return null;

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SpaceSwitcherWrapper userId={userId} />
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

export type User = {
  id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
};

function SpaceSwitcherWrapper({ userId }: { userId: string }) {
  type Space = {
    id: string;
    user_a_id: string;
    user_b_id: string;
    created_at: string;
    user_a?: User;
    user_b?: User;
  };

  const supabase = createClient();
  const [spaces, setSpaces] = React.useState<Space[]>([]);

  React.useEffect(() => {
    const fetchSpaces = async () => {
      const { data, error } = await supabase
        .from("spaces")
        .select("*")
        .or(`user_a_id.eq.${userId},user_b_id.eq.${userId}`);

      if (error) {
        console.error("Failed to fetch spaces:", error);
      } else {
        setSpaces(data);
      }
    };

    fetchSpaces();
  }, [userId, supabase]);

  return (
    <SpaceSwitcher
      currentUserId={userId}
      spaces={spaces}
      onSpaceCreated={() => {
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }}
    />
  );
}
