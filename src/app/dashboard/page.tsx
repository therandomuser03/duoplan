"use client";
import { useState, useEffect } from "react";
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
import { createClient } from "@/utils/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

export default function DashboardPageWrapper() {
  const [selectedDate, setSelectedDate] = useState(
    () => new Date().toISOString().split("T")[0]
  );
  const [refreshKey, setRefreshKey] = useState(0);
  const [hasSpaces, setHasSpaces] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const checkUserSpaces = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user?.id) {
        setUserId(user.id);
        const { data: spacesData } = await supabase
          .from('spaces')
          .select('id')
          .or(`user_a_id.eq.${user.id},user_b_id.eq.${user.id}`);
        
        setHasSpaces(Boolean(spacesData?.length));
      }
    };

    checkUserSpaces();
  }, [supabase]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <SidebarProvider>
      <AppSidebar user={{ name: "", email: "", avatar: "" }} selectedDate={""} onDateSelect={() => {}} />
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
          {!hasSpaces && (
            <Alert className="mb-4">
              <InfoIcon className="h-4 w-4" />
              <AlertTitle>No Spaces Joined</AlertTitle>
              <AlertDescription>
                You haven't joined any spaces yet. Join a space to start creating and sharing events.
              </AlertDescription>
            </Alert>
          )}
          <DashboardContent 
            key={refreshKey}
            user={{ name: "", email: "", avatar: "" }} 
            selectedDate={selectedDate} 
            onDateChange={setSelectedDate} 
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}