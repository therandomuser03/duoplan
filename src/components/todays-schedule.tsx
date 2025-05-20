"use client";

import { useEffect, useState } from "react";
import { Calendar, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

// Define TypeScript interfaces for our data
interface User {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
}

interface Space {
  id: string;
  user_a_id: string;
  user_b_id: string;
  user_a_email: string;
  user_b_email: string;
}

interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string;
  time_created: string;
  place: string;
  start_time: string;
  end_time: string;
  color_class: string;
  created_at: string;
}

const TodaySchedule = () => {
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(true);
  const [, setUser] = useState<User | null>(null);
  const [partnerUser, setPartnerUser] = useState<User | null>(null);
  const [myNotes, setMyNotes] = useState<Note[]>([]);
  const [partnerNotes, setPartnerNotes] = useState<Note[]>([]);

  // Get the current date formatted as YYYY-MM-DD for database queries
  const today = new Date();
  const displayDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  
  // Format date as YYYY-MM-DD for database query
  const dateForQuery = today.toISOString().split('T')[0];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get the current authenticated user
        const { data: { user: authUser } } = await supabase.auth.getUser();
        
        // If there's no authenticated user (common during development/testing)
        // Let's provide a fallback approach
        let userId = authUser?.id;
        
        if (!userId) {
          console.log("No authenticated user found - using fallback approach for development");
          // For development: fetch the first user from users table as fallback
          const { data: firstUser } = await supabase
            .from("users")
            .select("id")
            .limit(1)
            .single();
            
          if (firstUser) {
            userId = firstUser.id;
          } else {
            console.error("No users found in database");
            setLoading(false);
            return;
          }
        }

        // Get the user data
        const { data: userData } = await supabase
          .from("users")
          .select("*")
          .eq("id", userId)
          .single();
          
        setUser(userData);

        // Get the space this user is part of
        const { data: spaceData } = await supabase
          .from("spaces")
          .select("*")
          .or(`user_a_id.eq.${userId},user_b_id.eq.${userId}`)
          .single();
        
        if (spaceData) {
          // Determine the partner's ID
          const partnerId = spaceData.user_a_id === userId 
            ? spaceData.user_b_id 
            : spaceData.user_a_id;
            
          // Get the partner's user data
          const { data: partnerData } = await supabase
            .from("users")
            .select("*")
            .eq("id", partnerId)
            .single();
            
          setPartnerUser(partnerData);
          
          // Get all notes for today for the current user
          const startOfDay = `${dateForQuery}T00:00:00`;
          const endOfDay = `${dateForQuery}T23:59:59`;
          
          // Fetch the current user's notes for today
          const { data: myNotesData } = await supabase
            .from("notes")
            .select("*")
            .eq("user_id", userId)
            .gte("created_at", startOfDay)
            .lte("created_at", endOfDay)
            .order("start_time", { ascending: true });
            
          setMyNotes(myNotesData || []);
          
          // Fetch the partner's notes for today
          const { data: partnerNotesData } = await supabase
            .from("notes")
            .select("*")
            .eq("user_id", partnerId)
            .gte("created_at", startOfDay)
            .lte("created_at", endOfDay)
            .order("start_time", { ascending: true });
            
          setPartnerNotes(partnerNotesData || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [supabase, dateForQuery]);

  // Format time from database timestamp to readable format
  const formatTime = (timeString) => {
    if (!timeString) return "";
    try {
      const date = new Date(timeString);
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch (error) {
      console.log("Error formatting time:", error);
      return timeString; // Return original string if parsing fails
    }
  };

  // Define color classes if not provided in the database
  const getDefaultColorClass = (index) => {
    const colors = [
      "bg-blue-100 text-blue-600",
      "bg-green-100 text-green-600",
      "bg-purple-100 text-purple-600",
      "bg-amber-100 text-amber-600",
      "bg-rose-100 text-rose-600",
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="mb-4 border-b pb-4 flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Today&apos;s Schedule</h2>
          <p className="text-muted-foreground text-lg">{displayDate}</p>
        </div>
        <Button asChild variant="secondary">
          <Link href="/dashboard/notes">View All</Link>
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center flex-1">
          <p>Loading schedule...</p>
        </div>
      ) : (
        <Tabs defaultValue="myNotes" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="myNotes">My Notes</TabsTrigger>
            <TabsTrigger value="partnerNotes">
              {partnerUser ? `Notes by ${partnerUser.first_name || partnerUser.username || 'Partner'}` : "Partner's Notes"}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="myNotes">
            <Card>
              <CardHeader>
                <CardTitle>My Schedule for Today</CardTitle>
              </CardHeader>
              <CardContent>
                {myNotes.length > 0 ? (
                  <div className="flex flex-col gap-4">
                    {myNotes.map((note, index) => (
                      <div key={note.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-lg font-medium text-blue-600">
                            {note.title}
                          </h3>
                          <div className={`rounded-full px-3 py-1 text-sm ${note.color_class || getDefaultColorClass(index)}`}>
                            {formatTime(note.start_time)} - {formatTime(note.end_time)}
                          </div>
                        </div>
                        {note.place && (
                          <div className="flex items-center gap-2 text-muted-foreground mb-1">
                            <MapPin size={16} />
                            <span>{note.place}</span>
                          </div>
                        )}
                        {note.content && (
                          <div className="flex items-center gap-2 text-muted-foreground mt-1">
                            <Calendar size={16} />
                            <span>Note: {note.content}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground py-4 text-center">
                    No notes scheduled for today
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="partnerNotes">
            <Card>
              <CardHeader>
                <CardTitle>
                  {partnerUser 
                    ? `${partnerUser.first_name}'s Schedule for Today` 
                    : "Partner's Schedule"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {partnerNotes.length > 0 ? (
                  <div className="flex flex-col gap-4">
                    {partnerNotes.map((note, index) => (
                      <div key={note.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-lg font-medium text-blue-600">
                            {note.title}
                          </h3>
                          <div className={`rounded-full px-3 py-1 text-sm ${note.color_class || getDefaultColorClass(index)}`}>
                            {formatTime(note.start_time)} - {formatTime(note.end_time)}
                          </div>
                        </div>
                        {note.place && (
                          <div className="flex items-center gap-2 text-muted-foreground mb-1">
                            <MapPin size={16} />
                            <span>{note.place}</span>
                          </div>
                        )}
                        {note.content && (
                          <div className="flex items-center gap-2 text-muted-foreground mt-1">
                            <Calendar size={16} />
                            <span>Note: {note.content}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground py-4 text-center">
                    No notes scheduled for today
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default TodaySchedule;