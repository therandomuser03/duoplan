import { RedirectToSignIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Bell, Plus } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import UpcomingEvents from "@/components/upcoming-events";
import SharedPlans from "@/components/shared-plans";
import RecentNotes from "@/components/recent-notes";

export default async function Dashboard() {
  const { userId } = await auth();

  if (!userId) {
    return <RedirectToSignIn />;
  }
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
              <BreadcrumbPage className="text-xl">Dashboard</BreadcrumbPage>
                {/* <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">
                      Building Your Application
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList> */}
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
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-muted/50">
            <UpcomingEvents />
            </div>
            <div className="rounded-xl bg-muted/50">
            <SharedPlans />
            </div>
            <div className="rounded-xl bg-muted/50">
            <RecentNotes />
            </div>
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
