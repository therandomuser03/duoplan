// src/components/dashboard/space-switcher.tsx

"use client";

import React, { useEffect, useState } from "react";
import { ChevronsUpDown, Plus, Users, Clock } from "lucide-react";
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
  onSpaceCreated?: (spaceId: string) => void;
}) {
  const { isMobile } = useSidebar();
  const [activeSpaceId, setActiveSpaceId] = useState<string | null>(null);

  // Effect to set the initial active space ID or update it if the current active space is stale
  useEffect(() => {
    // If no activeSpaceId is set, or if the current activeSpaceId doesn't exist in the new spaces prop,
    // default to the first space if available.
    if (!activeSpaceId && spaces.length > 0) {
      setActiveSpaceId(spaces[0].id);
    } else if (activeSpaceId && !spaces.find(space => space.id === activeSpaceId)) {
      // If the previously active space is no longer in the list (e.g., deleted, though not implemented here),
      // or if the current active space is not found in the updated spaces list,
      // reset to the first space or null.
      setActiveSpaceId(spaces.length > 0 ? spaces[0].id : null);
    }
  }, [spaces, activeSpaceId]);

  // Derive activeSpace from activeSpaceId and the `spaces` prop
  const activeSpace = activeSpaceId ? spaces.find(space => space.id === activeSpaceId) : null;

  // Helper function to get the other user in a space
  const getOtherUser = (space: Space): User | null => {
    if (space.user_a_id === currentUserId) {
      return space.user_b || null;
    } else if (space.user_b_id === currentUserId) {
      return space.user_a || null;
    }
    return null;
  };

  // Helper function to check if space is complete (has both users)
  const isSpaceComplete = (space: Space): boolean => {
    const complete = !!(space.user_a_id && space.user_b_id);
    console.log("🔍 Space complete check:", {
      spaceId: space.id,
      user_a_id: space.user_a_id,
      user_b_id: space.user_b_id,
      complete,
      user_a: space.user_a,
      user_b: space.user_b
    });
    return complete;
  };

  // Helper function to get display name
const getDisplayName = (user: User): string => {
  if (user.first_name && user.last_name) {
    return `${user.first_name} ${user.last_name}`;
  }
  // If full name isn't available, check for first_name
  if (user.first_name) {
    return user.first_name;
  }
  // If first_name isn't available, check for last_name
  if (user.last_name) {
    return user.last_name;
  }
  // Fallback to username, then email if no name parts are available
  return user.username || user.email;
};

  // Handle space creation
  const handleSpaceCreated = (spaceId: string) => {
    onSpaceCreated?.(spaceId);
    // Optionally set the newly created space as active
    setActiveSpaceId(spaceId);
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
                    Create a Space
                  </span>
                </div>
              </SidebarMenuButton>
            }
          />
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  // If activeSpace is not yet set, don't render anything
  if (!activeSpace) {
    return null; // Or a loading spinner, or default message
  }

  const otherUser = getOtherUser(activeSpace);
  const spaceComplete = isSpaceComplete(activeSpace);

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
                {spaceComplete && otherUser?.avatar_url ? (
                  <Image
                    src={otherUser.avatar_url}
                    alt={getDisplayName(otherUser)}
                    width={32}
                    height={32}
                    className="rounded-lg object-cover"
                  />
                ) : spaceComplete ? (
                  <Users className="size-4" />
                ) : (
                  <Clock className="size-4" />
                )}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {spaceComplete && otherUser
                    ? `Space with ${getDisplayName(otherUser)}`
                    : "Waiting for partner to join"}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {spaceComplete && otherUser ? otherUser.email : "Invite someone to join this space"}
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

            {/* Show all spaces */}
            {spaces.length > 0 ? ( // Changed from > 1 to > 0 to always show the current space in the dropdown if it's the only one
              spaces.map((space) => {
                const spaceOtherUser = getOtherUser(space);
                const isComplete = isSpaceComplete(space);

                return (
                  <DropdownMenuItem
                    key={space.id}
                    onClick={() => setActiveSpaceId(space.id)} // Set activeSpaceId
                    className="gap-2 p-2"
                  >
                    <div className="flex size-6 items-center justify-center rounded-sm border overflow-hidden">
                      {isComplete && spaceOtherUser?.avatar_url ? (
                        <Image
                          src={spaceOtherUser.avatar_url}
                          alt={getDisplayName(spaceOtherUser)}
                          width={24}
                          height={24}
                          className="object-cover"
                        />
                      ) : isComplete ? (
                        <Users className="size-4 shrink-0" />
                      ) : (
                        <Clock className="size-4 shrink-0 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="truncate text-sm">
                        {isComplete && spaceOtherUser
                          ? `Space with ${getDisplayName(spaceOtherUser)}`
                          : "Waiting for partner"}
                      </span>
                      {isComplete && spaceOtherUser && (
                        <span className="truncate text-xs text-muted-foreground">
                          {spaceOtherUser.email}
                        </span>
                      )}
                    </div>
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