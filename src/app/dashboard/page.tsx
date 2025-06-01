// app/dashboard/page.tsx
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import WeeklyCalendar from "@/components/dashboard/WeeklyCalendar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCurrentUser } from "@/utils/user";
import { redirect } from "next/navigation";

// Import the new list components
import MyNotesList from "@/components/dashboard/MyNotesList";
import PartnerNotesList from "@/components/dashboard/PartnerNotesList";

export default async function Dashboard() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth");
  }

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset>
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

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex flex-row gap-4 min-h-[100vh]">
            <WeeklyCalendar />

            <Tabs defaultValue="myNotes" className="w-[400px]">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="myNotes">My Notes</TabsTrigger>
                <TabsTrigger value="notesByPartner">
                  Notes by Partner
                </TabsTrigger>
              </TabsList>

              <TabsContent value="myNotes">
                <Card>
                  <CardHeader>
                    <CardTitle>My Notes</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      All your personal notes and tasks.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <MyNotesList user={user} />
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
                  <CardContent>
                    <PartnerNotesList user={user} />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}