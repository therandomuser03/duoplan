// app/dashboard/page.tsx
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
import { getCurrentUser } from "@/utils/user";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth");
  }

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
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
        
        <DashboardTimeHeader />

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 overflow-hidden">
          <DashboardContent user={user} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}