"use client";

import React from "react";

import { Calendar, MapPin } from "lucide-react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Bell, Plus } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

function Notes() {

  const today = new Date();
  const date = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  // Sample schedule data
  const scheduleItems = [
    {
      title: "Team Meeting",
      location: "Office Room 3",
      timeStart: "2:00 PM",
      timeEnd: "3:00 PM",
      color: "bg-blue-100 text-blue-600"
    },
    {
      title: "Coffee with Alex",
      location: "Cafe Downtown",
      timeStart: "4:00 PM",
      timeEnd: "5:00 PM",
      color: "bg-green-100 text-green-600"
    },
    {
      title: "Dinner Reservation",
      location: "Italian Restaurant",
      timeStart: "7:00 PM",
      timeEnd: "9:00 PM",
      color: "bg-purple-100 text-purple-600",
      note: "Anniversary dinner"
    }
  ];

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center justify-between w-full px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbPage className="text-xl">Notes</BreadcrumbPage>
              </Breadcrumb>
            </div>
            <div className="flex items-center gap-8">
              <Bell />
              <Plus />
              <ModeToggle />
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="p-6 h-full flex flex-col">
      <div className="mb-4 border-b pb-4">
        <h2 className="text-2xl font-semibold">Today&apos;s Schedule</h2>
        <p className="text-muted-foreground text-lg">{date}</p>
      </div>
      
      <div className="flex flex-col gap-4">
        {scheduleItems.map((item, index) => (
          <div key={index} className="p-4 border rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium text-blue-600">{item.title}</h3>
              <div className={`rounded-full px-3 py-1 text-sm ${item.color}`}>
                {item.timeStart} - {item.timeEnd}
              </div>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <MapPin size={16} />
              <span>{item.location}</span>
            </div>
            {item.note && (
              <div className="flex items-center gap-2 text-muted-foreground mt-1">
                <Calendar size={16} />
                <span>Note: {item.note}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default Notes;
