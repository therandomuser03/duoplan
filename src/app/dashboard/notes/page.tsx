// notes/page.tsx

"use client";

import React, { useState, useEffect } from "react";

import { Bell, Plus, Search, Settings } from "lucide-react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { ModeToggle } from "@/components/mode-toggle";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function Notes() {
  // Sample notes data (in a real app, this would come from an API)
  const notesData = [
    {
      id: 1,
      title: "Team Meeting Notes",
      lastEdited: "May 16, 2025",
      content: "Project updates and action items for the product launch. Follow up with marketing team on timeline.",
      color: "bg-blue-500",
      relatedTo: "Team Meeting (May 16)",
      timeCreated: "2025-05-16T14:00:00" // ISO format for easier sorting
    },
    {
      id: 2,
      title: "Dinner Ideas",
      lastEdited: "May 14, 2025",
      content: "Anniversary dinner options:\n- Italian Restaurant downtown\n- Seafood place by the pier",
      color: "bg-purple-500",
      relatedTo: "Dinner Reservation (May 16)",
      timeCreated: "2025-05-14T19:00:00"
    },
    {
      id: 3,
      title: "Cafe Recommendations",
      lastEdited: "May 12, 2025",
      content: "- Downtown Café: great for meetings\n- Riverside Café: nice view\n- Bean Corner: best lattes",
      color: "bg-green-500",
      relatedTo: "Coffee with Alex (May 16)",
      timeCreated: "2025-05-12T16:00:00"
    },
    {
      id: 4,
      title: "Party Planning",
      lastEdited: "May 10, 2025",
      content: "Guest list and menu ideas for the upcoming party. Need to confirm RSVPs by the weekend.",
      color: "bg-yellow-500",
      relatedTo: "Party (May 22)",
      timeCreated: "2025-05-10T18:30:00"
    },
    {
      id: 5,
      title: "Holiday Planning",
      lastEdited: "May 8, 2025",
      content: "Ideas for the upcoming holiday:\n- Beach day\n- Mountain retreat",
      color: "bg-red-500",
      relatedTo: "Holiday (May 20)",
      timeCreated: "2025-05-08T09:15:00"
    },
    {
      id: 6,
      title: "Interview Prep",
      lastEdited: "May 1, 2025",
      content: "Questions to prepare for the upcoming interview. Research company background and values.",
      color: "bg-pink-500",
      relatedTo: "Interview (May 2)",
      timeCreated: "2025-05-01T11:30:00"
    }
  ];

  type Note = {
    id: number;
    title: string;
    lastEdited: string;
    content: string;
    color: string;
    relatedTo: string;
    timeCreated: string;
  };

  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  // Simulate fetching data from an API
  useEffect(() => {
    // This would be replaced by an actual API call in the future
    const fetchNotes = async () => {
      setIsLoading(true);
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Sort the notes by timeCreated (most recent first)
        const sortedNotes = [...notesData].sort((a, b) => 
          new Date(b.timeCreated).getTime() - new Date(a.timeCreated).getTime()
        );
        
        setNotes(sortedNotes);
      } catch (error) {
        console.error("Error fetching notes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotes();
  }, []);

  // Filter notes based on search query and active tab
  const getFilteredNotes = () => {
    let filtered = notes;
    
    // Apply search filter
    if (searchQuery.trim() !== "") {
      filtered = filtered.filter(note => 
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        note.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply tab filter (this would be more sophisticated in a real app)
    if (activeTab === "recent") {
      // Show only notes from the last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      filtered = filtered.filter(note => 
        new Date(note.timeCreated) > sevenDaysAgo
      );
    } else if (activeTab === "favorites") {
      // In a real app, you'd have a favorites field
      // For now, just show a subset
      filtered = filtered.filter(note => [1, 3, 5].includes(note.id));
    } else if (activeTab === "date") {
      // Already sorted by date in the useEffect
    }
    
    return filtered;
  };

  // Define tabs
  const tabs = [
    { id: "all", label: "All Notes" },
    { id: "recent", label: "Recent" },
    { id: "favorites", label: "Favorites" },
    { id: "date", label: "Date Added" },
  ];

  const filteredNotes = getFilteredNotes();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-background">
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center justify-between w-full px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbPage className="text-xl">Notes</BreadcrumbPage>
              </Breadcrumb>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost">
                <Bell />
              </Button>
              <Button variant="ghost">
                <Plus />
              </Button>
              <ModeToggle />
            </div>
          </div>
        </header>
        
        <div className="flex flex-col gap-4 p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
                size={18} 
              />
              <Input 
                placeholder="Search notes..." 
                className="pl-10 bg-muted/70"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Updated tab UI to match Shared Plans design */}
          <div className="flex border-b mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={cn(
                  "px-6 py-3 font-medium",
                  activeTab === tab.id
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-muted-foreground hover:text-foreground"
                )}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <p>Loading notes...</p>
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No notes found. Try adjusting your search criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNotes.map((note) => (
                <div 
                  key={note.id} 
                  className="rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className={`h-2 ${note.color}`} />
                  <div className="p-4 bg-muted/30 dark:bg-muted/20 h-full flex flex-col">
                    <h3 className="text-lg font-medium text-blue-500 mb-1">{note.title}</h3>
                    <p className="text-xs text-muted-foreground mb-3">Last edited: {note.lastEdited}</p>
                    <p className="text-sm flex-1 whitespace-pre-line">{note.content}</p>
                    <p className="text-xs text-muted-foreground mt-4">Related to: {note.relatedTo}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default Notes;