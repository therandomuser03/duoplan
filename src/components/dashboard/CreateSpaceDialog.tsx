"use client";

import * as React from "react";
import { Plus, Loader2, Copy, Share, LogIn } from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

type CreateSpaceDialogProps = {
  currentUserId: string;
  onSpaceCreated?: (spaceId: string) => void;
  trigger?: React.ReactNode;
};

export function CreateSpaceDialog({
  currentUserId,
  onSpaceCreated,
  trigger,
}: CreateSpaceDialogProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isCreating, setIsCreating] = React.useState(false);
  const [isJoining, setIsJoining] = React.useState(false);
  const [spaceName, setSpaceName] = React.useState("");
  const [spaceIdToJoin, setSpaceIdToJoin] = React.useState("");
  const [createdSpaceId, setCreatedSpaceId] = React.useState<string | null>(
    null
  );

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setSpaceName("");
      setSpaceIdToJoin("");
      setCreatedSpaceId(null);
      setIsCreating(false);
      setIsJoining(false);
    }, 200);
  };

  const createSpace = async () => {
    console.log("🚀 [createSpace] Sending to API:", {
      spaceName,
      user_a_id: currentUserId,
    });
    if (!spaceName.trim()) {
      toast.error("Please enter a space name");
      return;
    }

    setIsCreating(true);

    try {
      const response = await fetch("/api/spaces", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: spaceName,
          user_a_id: currentUserId,
        }),
      });

      const data = await response.json();

      if (!response.ok)
        throw new Error(data?.error || "Failed to create space");

      setCreatedSpaceId(data.space.id);
      console.log("🆔 Created spaceId:", data.space.id);
      toast.success("Space created successfully!");
      // onSpaceCreated?.(data.space.id);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error creating space:", error);
        toast.error(error.message || "Failed to create space");
      } else {
        console.error("Unknown error creating space:", error);
        toast.error("Failed to create space");
      }
    } finally {
      setIsCreating(false);
    }
  };

  const joinSpace = async () => {
    if (!spaceIdToJoin.trim()) {
      toast.error("Please enter a valid space ID");
      return;
    }

    setIsJoining(true);

    try {
      const response = await fetch("/api/spaces/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          spaceId: spaceIdToJoin,
          user_b_id: currentUserId,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data?.error || "Failed to join space");
      console.log("✅ Joined space:", data.space.id);
      toast.success("Successfully joined the space!");
      onSpaceCreated?.(data.space.id);
      // handleClose();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error joining space:", error);
        toast.error(error.message || "Failed to join space");
      } else {
        console.error("Unknown error joining space:", error);
        toast.error("Failed to join space");
      }
    } finally {
      setIsJoining(false);
    }
  };

  const copySpaceId = async () => {
    if (!createdSpaceId) return;
    try {
      await navigator.clipboard.writeText(createdSpaceId);
      toast.success("Space ID copied!");
    } catch (error) {
      console.error("Clipboard error:", error);
      toast.error("Failed to copy");
    }
  };

  const shareSpace = async () => {
    if (!createdSpaceId) return;

    const shareText = `Join my space using this ID: ${createdSpaceId}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Join My Space",
          text: shareText,
        });
      } else {
        await navigator.clipboard.writeText(shareText);
        toast.success("Space ID copied for sharing!");
      }
    } catch (error) {
      console.error("Share failed:", error);
      toast.error("Could not share");
    }
  };

  const defaultTrigger = (
    <Button variant="outline" size="sm">
      <Plus className="size-4 mr-2" />
      Create/Join Space
    </Button>
  );

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        {trigger || defaultTrigger}
      </AlertDialogTrigger>

      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {createdSpaceId ? "Space Created!" : "Create or Join a Space"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {createdSpaceId
              ? "You can now share this Space ID with others to collaborate."
              : "Create a new shared workspace or join an existing one."}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {!createdSpaceId ? (
          <>
            <Tabs defaultValue="create" className="w-full">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="create">Create</TabsTrigger>
                <TabsTrigger value="join">Join</TabsTrigger>
              </TabsList>

              <TabsContent value="create">
                <div className="space-y-4">
                  {/* Keep existing Label and Input */}
                  <Label htmlFor="spaceName">Space Name</Label>
                  <Input
                    id="spaceName"
                    value={spaceName}
                    onChange={(e) => setSpaceName(e.target.value)}
                    placeholder="e.g. Project Alpha"
                    disabled={isCreating}
                  />

                  {/* ADD THIS BUTTON SECTION: */}
                  <div className="flex justify-end space-x-2 pt-2">
                    <AlertDialogCancel onClick={handleClose}>
                      Cancel
                    </AlertDialogCancel>
                    <Button onClick={createSpace} disabled={isCreating}>
                      {isCreating && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Create Space
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="join">
                <div className="space-y-4">
                  {/* Keep existing Label and Input */}
                  <Label htmlFor="spaceIdToJoin">Space ID</Label>
                  <Input
                    id="spaceIdToJoin"
                    value={spaceIdToJoin}
                    onChange={(e) => setSpaceIdToJoin(e.target.value)}
                    placeholder="Enter space ID"
                    disabled={isJoining}
                  />

                  {/* ADD THIS BUTTON SECTION: */}
                  <div className="flex justify-end space-x-2 pt-2">
                    <AlertDialogCancel onClick={handleClose}>
                      Cancel
                    </AlertDialogCancel>
                    <Button
                      onClick={joinSpace}
                      variant="secondary"
                      disabled={isJoining}
                    >
                      <LogIn className="mr-2 h-4 w-4" />
                      Join Space
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* <AlertDialogFooter className="mt-4">
              <AlertDialogCancel onClick={handleClose}>
                Cancel
              </AlertDialogCancel>
              <Button onClick={createSpace} disabled={isCreating}>
                {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Space
              </Button>
              <Button onClick={joinSpace} variant="secondary" disabled={isJoining}>
                <LogIn className="mr-2 h-4 w-4" />
                Join Space
              </Button>
            </AlertDialogFooter> */}
          </>
        ) : (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="spaceId">Space ID</Label>
              <div className="flex space-x-2">
                <Input
                  id="spaceId"
                  value={createdSpaceId}
                  readOnly
                  className="font-mono text-sm"
                />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={copySpaceId}
                        className="shrink-0"
                      >
                        <Copy className="size-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Copy Space ID</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            <Button onClick={shareSpace} variant="outline" className="w-full">
              <Share className="size-4 mr-2" />
              Share
            </Button>

            <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
              <p className="font-medium mb-1">Invite Instructions</p>
              <ol className="list-decimal list-inside space-y-1 text-xs">
                <li>Copy or share the Space ID above</li>
                <li>Invite others to join using that ID</li>
                <li>Start collaborating</li>
              </ol>
            </div>

            <AlertDialogFooter>
              <Button onClick={handleClose}>Done</Button>
            </AlertDialogFooter>
          </div>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
