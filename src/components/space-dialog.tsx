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

export function SpaceDialog() {
  const [spaceId, setSpaceId] = useState("");
  const [createdSpaceId, setCreatedSpaceId] = useState("");
  const [showSpace, setShowSpace] = useState(false);

  const generateSpaceId = () => {
    const newId = Math.random().toString(36).substring(2, 8);
    setCreatedSpaceId(newId);
    setSpaceId(newId);
    setShowSpace(true);
  };

  const handleJoin = () => {
    if (spaceId.trim()) {
      setShowSpace(true);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <Link className="mr-2 h-4 w-4 text-muted-foreground" />Create / Join a space
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
                  <Input readOnly value={`https://yourapp.com/space/${createdSpaceId}`} />
                  <Button
                    type="button"
                    size="icon"
                    onClick={() =>
                      navigator.clipboard.writeText(
                        `https://yourapp.com/space/${createdSpaceId}`
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

        {showSpace && <Space spaceId={spaceId} onClose={() => setShowSpace(false)} />}
      </DialogContent>
    </Dialog>
  );
}
