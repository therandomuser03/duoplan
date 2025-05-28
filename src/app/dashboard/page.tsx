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

export default function Dashboard() {
  return (
    <SidebarProvider>
      <AppSidebar />
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
            {/* Weekly Calendar (3 parts) */}
            <WeeklyCalendar />

            {/* Today's Notes (1 part) */}
            {/* <div className="flex-[1] bg-background rounded-xl p-6 shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Today's Schedule</h2>
                <button className="text-sm text-muted-foreground underline">
                  View All
                </button>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </p>

              <div className="flex gap-2 mb-4 bg-muted p-1 rounded-md">
                <button className="flex-1 py-1 rounded bg-primary text-primary-foreground text-sm font-semibold">
                  My Notes
                </button>
                <button className="flex-1 py-1 rounded text-sm">
                  Notes by Anubhab
                </button>
              </div>

              <div className="border border-muted rounded-lg p-4">
                <p className="text-muted-foreground">My Schedule for Today</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  No notes scheduled for today
                </p>
              </div>
            </div> */}

            <Tabs defaultValue="myNotes" className="w-[400px]">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="myNotes">My Notes</TabsTrigger>
                <TabsTrigger value="notesByPartner">Notes by {'partner'}</TabsTrigger>
              </TabsList>
              
              <TabsContent value="myNotes">
          <Card>
            <CardHeader>
              <CardTitle>My Schedule for Today</CardTitle>
              <CardDescription className="text-muted-foreground">
                Here&apos;s what&apos;s planned
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                No notes scheduled for today
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notesByPartner">
          <Card>
            <CardHeader>
              <CardTitle>Partner&apos;s Notes</CardTitle>
              <CardDescription className="text-muted-foreground">
                Notes shared with you
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                No shared notes for today
              </p>
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
