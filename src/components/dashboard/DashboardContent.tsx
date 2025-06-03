// components/dashboard/DashboardContent.tsx
"use client";

import { useState, useEffect } from "react";
import WeeklyCalendar from "@/components/dashboard/WeeklyCalendar";
import MyNotesList from "@/components/dashboard/MyNotesList";
import PartnerNotesList from "@/components/dashboard/PartnerNotesList";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@/utils/supabase/client";
import { useSpace } from '@/contexts/SpaceContext';

interface User {
  name: string;
  email: string;
  avatar: string;
}

interface DashboardContentProps {
  user: User;
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export default function DashboardContent({ user, selectedDate, onDateChange }: DashboardContentProps) {
  const { currentSpaceId } = useSpace();
  const [partnerFirstName, setPartnerFirstName] = useState<string>("Partner");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setRefreshKey(prev => prev + 1);
    // Reset refreshing state after a short delay to show the loading animation
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  useEffect(() => {
    const fetchPartnerName = async () => {
      if (!currentSpaceId) {
        setPartnerFirstName("Partner");
        return;
      }
      const supabase = createClient();
      // Get current user
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
      if (userError || !currentUser) {
        setPartnerFirstName("Partner");
        return;
      }
      // Get the current space
      const { data: space, error: spaceError } = await supabase
        .from("spaces")
        .select("user_a_id, user_b_id")
        .eq("id", currentSpaceId)
        .single();
      if (spaceError || !space) {
        setPartnerFirstName("Partner");
        return;
      }
      // Determine partner's user id
      const partnerId = space.user_a_id === currentUser.id ? space.user_b_id : space.user_a_id;
      if (!partnerId) {
        setPartnerFirstName("Partner");
        return;
      }
      // Fetch partner's user data
      const { data: partner, error: partnerError } = await supabase
        .from("users")
        .select("first_name")
        .eq("id", partnerId)
        .single();
      if (partnerError || !partner || !partner.first_name) {
        setPartnerFirstName("Partner");
        return;
      }
      setPartnerFirstName(partner.first_name);
    };
    fetchPartnerName();
  }, [currentSpaceId]);

  return (
    <div className="flex flex-row gap-4 h-full overflow-hidden">
      <WeeklyCalendar 
        selectedDate={selectedDate}
        onDateSelect={onDateChange}
      />

      <Tabs defaultValue="myNotes" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="myNotes">My Notes</TabsTrigger>
          <TabsTrigger value="notesByPartner">Notes by {partnerFirstName}</TabsTrigger>
        </TabsList>

        <TabsContent value="myNotes">
          <Card>
            <CardHeader>
              <CardTitle>My Notes</CardTitle>
              <CardDescription className="text-muted-foreground">
                All your personal notes and tasks.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-full flex flex-col overflow-hidden">
              <MyNotesList 
                user={user} 
                selectedDate={selectedDate}
                onDateChange={onDateChange}
                key={`my-notes-${refreshKey}`}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notesByPartner">
          <Card>
            <CardHeader>
              <CardTitle>Partner&apos;s Notes</CardTitle>
              <CardDescription className="text-muted-foreground">
                Notes shared with you by {partnerFirstName}.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-full flex flex-col overflow-hidden">
              <PartnerNotesList 
                user={user} 
                selectedDate={selectedDate}
                onDateChange={onDateChange}
                key={`partner-notes-${refreshKey}`}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}