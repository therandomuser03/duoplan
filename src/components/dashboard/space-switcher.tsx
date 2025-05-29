// src/components/dashboard/space-switcher.tsx
"use client";

import * as React from "react";
import { ChevronsUpDown, Plus, Users } from "lucide-react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { CreateSpaceDialog } from "./CreateSpaceDialog";

type User = {
  id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
};

type Space = {
  id: string;
  user_a_id: string;
  user_b_id: string;
  created_at: string;
  user_a?: User;
  user_b?: User;
};

export function SpaceSwitcher({
  spaces,
  currentUserId,
  onSpaceCreated,
}: {
  spaces: Space[];
  currentUserId: string;
  onCreateSpace?: () => void;
  onSpaceCreated?: (spaceId: string) => void; // Add this type
}) {
  const { isMobile } = useSidebar();
  const [activeSpace, setActiveSpace] = React.useState<Space | null>(
    spaces.length > 0 ? spaces[0] : null
  );

  // Helper function to get the other user in a space
  const getOtherUser = (space: Space): User | null => {
    if (space.user_a_id === currentUserId) {
      return space.user_b || null;
    } else if (space.user_b_id === currentUserId) {
      return space.user_a || null;
    }
    return null;
  };

  // Helper function to get display name
  const getDisplayName = (user: User): string => {
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    return user.username || user.email;
  };

  // Handle space creation
  const handleSpaceCreated = (spaceId: string) => {
    onSpaceCreated?.(spaceId);
    // You might want to refresh the spaces list here
  };

  // If no spaces, show create space option
  if (spaces.length === 0) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <CreateSpaceDialog
            currentUserId={currentUserId}
            onSpaceCreated={handleSpaceCreated}
            trigger={
              <SidebarMenuButton
                size="lg"
                className="cursor-pointer hover:bg-sidebar-accent hover:text-sidebar-accent-foreground w-full"
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-neutral-200 text-neutral-600">
                  <Plus className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    No Space Joined Yet
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {spaces.length === 0
                      ? "Create a Space"
                      : "Space Created. Wait for another user"}
                  </span>
                </div>
              </SidebarMenuButton>
            }
          />
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  // If we have spaces but no active space, set the first one
  if (!activeSpace && spaces.length > 0) {
    setActiveSpace(spaces[0]);
    return null;
  }

  const otherUser = activeSpace ? getOtherUser(activeSpace) : null;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-neutral-950 text-sidebar-primary-foreground overflow-hidden">
                {otherUser?.avatar_url ? (
                  <Image
                    src={otherUser.avatar_url}
                    alt={getDisplayName(otherUser)}
                    width={32}
                    height={32}
                    className="rounded-lg object-cover"
                  />
                ) : (
                  <Users className="size-4" />
                )}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {otherUser
                    ? `Space with ${getDisplayName(otherUser)}`
                    : "Loading..."}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  Shared workspace
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Spaces
            </DropdownMenuLabel>

            {/* Show other spaces if there are multiple */}
            {spaces.length > 1 ? (
              spaces.map((space) => {
                const spaceOtherUser = getOtherUser(space);
                if (!spaceOtherUser) return null;

                return (
                  <DropdownMenuItem
                    key={space.id}
                    onClick={() => setActiveSpace(space)}
                    className="gap-2 p-2"
                  >
                    <div className="flex size-6 items-center justify-center rounded-sm border overflow-hidden">
                      {spaceOtherUser.avatar_url ? (
                        <Image
                          src={spaceOtherUser.avatar_url}
                          alt={getDisplayName(spaceOtherUser)}
                          width={24}
                          height={24}
                          className="object-cover"
                        />
                      ) : (
                        <Users className="size-4 shrink-0" />
                      )}
                    </div>
                    <span className="truncate">
                      {getDisplayName(spaceOtherUser)}
                    </span>
                  </DropdownMenuItem>
                );
              })
            ) : (
              <DropdownMenuItem
                disabled
                className="gap-2 p-2 text-muted-foreground"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border bg-muted">
                  <Users className="size-4" />
                </div>
                No other spaces joined
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>
              <CreateSpaceDialog
                currentUserId={currentUserId}
                onSpaceCreated={handleSpaceCreated}
                trigger={
                  <div className="flex w-full items-center gap-2 px-2 py-1.5 cursor-pointer">
                    <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                      <Plus className="size-4" />
                    </div>
                    <div className="font-medium text-muted-foreground">
                      Create new space
                    </div>
                  </div>
                }
              />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
