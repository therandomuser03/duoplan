"use client";
import { useState } from "react";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import DashboardContent from "@/components/dashboard/DashboardContent";
import DashboardTimeHeader from "@/components/dashboard/DashboardTimeHeader";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function DashboardPageWrapper() {
  const [selectedDate, setSelectedDate] = useState(
    () => new Date().toISOString().split("T")[0]
  );
  const [refreshKey, setRefreshKey] = useState(0);

  // You may need to fetch user in a useEffect or pass as prop if SSR
  // For now, let's assume user is available as a global or context
  // If not, you can move this logic to a server component and pass user as prop
  // const user = ...

  // Placeholder for user fetching logic
  // Replace with your actual user fetching logic
  const user = { name: "", email: "", avatar: "" };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <SidebarProvider>
      <AppSidebar user={user} selectedDate={""} onDateSelect={() => {}} />
      <SidebarInset className="flex flex-col h-screen overflow-hidden">
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="md:block">
                  <BreadcrumbLink href="dashboard">
                    <BreadcrumbPage>Dashboard</BreadcrumbPage>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <DashboardTimeHeader onRefresh={handleRefresh} />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 overflow-hidden">
          <DashboardContent 
            key={refreshKey}
            user={user} 
            selectedDate={selectedDate} 
            onDateChange={setSelectedDate} 
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}