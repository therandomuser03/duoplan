// components/dashboard/DashboardContent.tsx
"use client";

import { useState } from "react";
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

interface User {
  name: string;
  email: string;
  avatar: string;
}

interface DashboardContentProps {
  user: User;
}

export default function DashboardContent({ user }: DashboardContentProps) {
  // Lift the selectedDate state up to handle communication between components
  const [selectedDate, setSelectedDate] = useState(
    () => new Date().toISOString().split("T")[0]
  );

  return (
    <div className="flex flex-row gap-4 h-full overflow-hidden">
      <WeeklyCalendar 
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
      />

      <Tabs defaultValue="myNotes" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="myNotes">My Notes</TabsTrigger>
          <TabsTrigger value="notesByPartner">Notes by Partner</TabsTrigger>
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
                onDateChange={setSelectedDate}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notesByPartner">
          <Card>
            <CardHeader>
              <CardTitle>Partner&apos;s Notes</CardTitle>
              <CardDescription className="text-muted-foreground">
                Notes shared with you by your partner.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-full flex flex-col overflow-hidden">
              <PartnerNotesList 
                user={user} 
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}