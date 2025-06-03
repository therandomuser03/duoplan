// src/components/dashboard/app-sidebar.tsx

"use client";

import * as React from "react";
import { LifeBuoy, Send, BookText, Link } from "lucide-react";
import { parseISO, format } from "date-fns";

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
  navMain: [
    { title: "Events", url: "/events", icon: BookText },
    { title: "Shared Events", url: "/shared-events", icon: Link },
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
  selectedDate: string;
  onDateSelect: (date: string) => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function AppSidebar({ user, selectedDate, onDateSelect, ...props }: AppSidebarProps) {
  const supabase = createClient();
  const [userId, setUserId] = React.useState<string | null>(null);
  const [userData, setUserData] = React.useState<{
    name: string;
    email: string;
    avatar: string;
  } | null>(null);
  
  React.useEffect(() => {
    const getUserData = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (user?.id) {
        setUserId(user.id);
        
        // Fetch user profile data
        const { data: profileData, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error("❌ Error fetching user profile:", profileError);
          return;
        }

        if (profileData) {
          setUserData({
            name: profileData.first_name + (profileData.last_name ? ` ${profileData.last_name}` : ''),
            email: profileData.email,
            avatar: profileData.avatar_url || '',
          });
        }
      } else {
        console.error("❌ No user ID found", error);
      }
    };

    getUserData();
  }, [supabase]);

  if (!userId || !userData) return null;

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SpaceSwitcherWrapper userId={userId} />
      </SidebarHeader>
      <SidebarContent>
        <Calendar
          mode="single"
          selected={selectedDate ? parseISO(selectedDate) : undefined}
          onSelect={(date: Date | undefined) => {
            if (date) onDateSelect(format(date, "yyyy-MM-dd"));
          }}
        />
        <NavMain items={staticData.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavSecondary items={staticData.navSecondary} />
        <NavUser user={userData} />
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
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchSpaces = async () => {
      try {
        // First, get the spaces
        const { data: spacesData, error: spacesError } = await supabase
          .from("spaces")
          .select("*")
          .or(`user_a_id.eq.${userId},user_b_id.eq.${userId}`);

        if (spacesError) {
          console.error("Failed to fetch spaces:", spacesError);
          setLoading(false);
          return;
        }

        if (!spacesData || spacesData.length === 0) {
          setSpaces([]);
          setLoading(false);
          return;
        }

        // Get all unique user IDs from the spaces
        const userIds = new Set<string>();
        spacesData.forEach(space => {
          if (space.user_a_id) userIds.add(space.user_a_id);
          if (space.user_b_id) userIds.add(space.user_b_id);
        });

        // Fetch user data for all users involved in these spaces
        const { data: usersData, error: usersError } = await supabase
          .from("users")
          .select("*")
          .in("id", Array.from(userIds));

        if (usersError) {
          console.error("Failed to fetch users:", usersError);
          setSpaces(spacesData); // Set spaces without user data
          setLoading(false);
          return;
        }

        // Create a map of user ID to user data for quick lookup
        const usersMap = new Map();
        usersData?.forEach(user => {
          usersMap.set(user.id, user);
        });

        // Combine spaces with user data
        const spacesWithUsers = spacesData.map(space => ({
          ...space,
          user_a: space.user_a_id ? usersMap.get(space.user_a_id) : null,
          user_b: space.user_b_id ? usersMap.get(space.user_b_id) : null,
        }));

        console.log("✅ Spaces with user data:", spacesWithUsers);
        console.log("🔍 Current user ID:", userId);
        console.log("📊 Raw spaces data:", spacesData);
        console.log("👥 Users data:", usersData);
        console.log("🗺️ Users map:", usersMap);
        setSpaces(spacesWithUsers);
      } catch (error) {
        console.error("Error in fetchSpaces:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSpaces();
  }, [userId, supabase]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-sm text-muted-foreground">Loading spaces...</div>
      </div>
    );
  }

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