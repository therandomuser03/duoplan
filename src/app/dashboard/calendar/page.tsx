"use client";

import React from "react";

import { Calendar } from "@/components/ui/calendar";
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

function FullCalendar() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

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
                <BreadcrumbPage className="text-xl">Calendar</BreadcrumbPage>
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
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default FullCalendar;
