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
  const [, setIsRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    <div className="flex flex-col md:flex-row gap-4 h-full overflow-y-auto md:overflow-hidden">
      <WeeklyCalendar 
        selectedDate={selectedDate}
        onDateSelect={onDateChange}
        className="w-full md:w-auto"
      />

      <Tabs defaultValue="myNotes" className="w-full md:w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="myNotes">My Events</TabsTrigger>
          <TabsTrigger value="notesByPartner">Events by {partnerFirstName}</TabsTrigger>
        </TabsList>

        <TabsContent value="myNotes">
          <Card className="h-[calc(100vh-28rem)] md:h-full">
            <CardHeader>
              <CardTitle>My Events</CardTitle>
              <CardDescription className="text-muted-foreground">
                All your personal events and tasks.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-full flex flex-col overflow-y-auto">
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
          <Card className="h-[calc(100vh-28rem)] md:h-full">
            <CardHeader>
              <CardTitle>Partner&apos;s Events</CardTitle>
              <CardDescription className="text-muted-foreground">
                Events shared with you by {partnerFirstName}.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-full flex flex-col overflow-y-auto">
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