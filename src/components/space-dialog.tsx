// src/components/space-dialog.tsx

"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy, Link } from "lucide-react";
import { Space } from "@/components/space";

import { supabase } from "@/lib/supabase";
import { useUser } from "@clerk/nextjs";

export function SpaceDialog() {
  const [spaceId, setSpaceId] = useState("");
  const [createdSpaceId, setCreatedSpaceId] = useState("");
  const [showSpace, setShowSpace] = useState(false);

  const { user } = useUser(); // Get current user

  const generateSpaceId = async () => {
    if (!user?.id || !user?.emailAddresses?.[0]?.emailAddress) return;

    try {
      const space = await createSpace(
        user.id,
        user.emailAddresses[0].emailAddress
      );
      setCreatedSpaceId(space.id);
      setSpaceId(space.id);
      setShowSpace(true);
    } catch (error) {
      console.error("Failed to create space:", error);
    }
  };

  const handleJoin = async () => {
    if (
      !spaceId.trim() ||
      !user?.id ||
      !user?.emailAddresses?.[0]?.emailAddress
    ) {
      console.error("Missing space ID or user info");
      return;
    }

    try {
      await joinSpace(
        spaceId.trim(),
        user.id,
        user.emailAddresses[0].emailAddress
      );
      setShowSpace(true); // Only show space UI after successful join
    } catch (error) {
      console.error("Failed to join space:", error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <Link className="mr-1 h-4 w-4 text-muted-foreground" />
          Create / Join a space
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Spaces</DialogTitle>
          <DialogDescription>
            Create a space to collaborate or join an existing one using a link.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="create">Create</TabsTrigger>
            <TabsTrigger value="join">Join</TabsTrigger>
          </TabsList>

          <TabsContent value="create">
            <div className="flex flex-col gap-2">
              <Button onClick={generateSpaceId}>Generate Space</Button>
              {createdSpaceId && (
                <div className="flex items-center gap-2">
                  <Input
                    readOnly
                    value={`https://duoplan.vercel.app/space/${createdSpaceId}`}
                  />
                  <Button
                    type="button"
                    size="icon"
                    onClick={() =>
                      navigator.clipboard.writeText(
                        `https://duoplan.vercel.app/space/${createdSpaceId}`
                      )
                    }
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="join">
            <div className="flex flex-col gap-2">
              <Input
                placeholder="Enter space ID or link"
                value={spaceId}
                onChange={(e) => setSpaceId(e.target.value)}
              />
              <Button onClick={handleJoin}>Join Space</Button>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Close</Button>
          </DialogClose>
        </DialogFooter>

        {showSpace && (
          <Space spaceId={spaceId} onClose={() => setShowSpace(false)} />
        )}
      </DialogContent>
    </Dialog>
  );
}

export async function createSpace(userId: string, email: string) {
  const id = crypto.randomUUID(); // Required since id is of type "text" in Supabase
  const token = Math.random().toString(36).substring(2, 10);

  const { data, error } = await supabase
    .from("spaces")
    .insert([
      {
        id,
        user_a_id: userId,
        user_a_email: email,
        token,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Supabase insert error:", error);
    throw new Error(error.message || "Unknown Supabase error");
  }

  return data;
}

export async function joinSpace(spaceId: string, userId: string, email: string) {
  // First get the space to verify it exists and get its token
  const { data: space, error: fetchError } = await supabase
    .from("spaces")
    .select("token")
    .eq("id", spaceId)
    .single();

  if (fetchError || !space) {
    throw new Error("Space not found");
  }

  // Then update the space with user B info
  const { data, error } = await supabase
    .from("spaces")
    .update({
      user_b_id: userId,
      user_b_email: email,
    })
    .eq("id", spaceId)
    .is("user_b_id", null); // Prevent double joins

  if (error) throw error;
  return data;
}

export async function getNotesInSpace(spaceId: string) {
  const { data: space } = await supabase
    .from("spaces")
    .select("user_a_id, user_b_id")
    .eq("id", spaceId)
    .single();

  if (!space) {
    throw new Error("Space not found");
  }

  const userIds = [space.user_a_id, space.user_b_id].filter(Boolean);

  const { data: notes, error } = await supabase
    .from("notes")
    .select("*")
    .in("user_id", userIds);

  if (error) throw error;
  return notes;
}

