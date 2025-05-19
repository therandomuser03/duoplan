// shared-plans/page.tsx

"use client";

import React, { useState, useEffect } from "react";

import { Calendar, MapPin } from "lucide-react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Bell, Plus, User, Users } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { useUser } from "@clerk/nextjs";
import { createBrowserClient } from "@supabase/ssr";

function SharedPlans() {
  const { user } = useUser();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [activeTab, setActiveTab] = useState("shared-by-me");
  const [isLoading, setIsLoading] = useState(true);
  const [sharedPlans, setSharedPlans] = useState<SharedPlan[]>([]);

  // Define the type for shared plans based on the table structure
  type SharedPlan = {
    id: string;
    from_user_id: string;
    to_user_id: string;
    space_id: string;
    title: string;
    content: string;
    time_created: string;
    place: string;
    start_time: string;
    end_time: string;
    color_class: string;
    shared_by_name: string;
    created_at: string;
  };

  const today = new Date();
  const date = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  // Fetch shared plans data from Supabase
  useEffect(() => {
    if (!user) return;

    const fetchSharedPlans = async () => {
      setIsLoading(true);
      try {
        console.log("Fetching shared plans for Clerk ID:", user.id);

        // Fetch plans shared by the current user
        const { data: sharedByMeData, error: sharedByMeError } = await supabase
          .from("shared_notes")
          .select("*")
          .eq("from_user_id", user.id)
          .order("created_at", { ascending: false });

        // Fetch plans shared with the current user
        const { data: sharedWithMeData, error: sharedWithMeError } = await supabase
          .from("shared_notes")
          .select("*")
          .eq("to_user_id", user.id)
          .order("created_at", { ascending: false });

        console.log("Supabase returned:", { 
          sharedByMeData, 
          sharedByMeError, 
          sharedWithMeData, 
          sharedWithMeError 
        });

        if (sharedByMeError) {
          console.error("Supabase query error (shared by me):", sharedByMeError.message || sharedByMeError);
        }

        if (sharedWithMeError) {
          console.error("Supabase query error (shared with me):", sharedWithMeError.message || sharedWithMeError);
        }

        // Combine data from both queries
        const allData = [
          ...(sharedByMeData || []),
          ...(sharedWithMeData || [])
        ];

        if (!allData || allData.length === 0) {
          console.warn("No shared plans returned for this user.");
        }

        setSharedPlans(allData as SharedPlan[]);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(
            "Unexpected error fetching shared plans:",
            error.message
          );
        } else {
          console.error(
            "Unexpected error fetching shared plans:",
            error
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchSharedPlans();
  }, [user, supabase]);

  // Filter plans based on active tab
  const getFilteredPlans = () => {
    if (!user) return [];

    switch (activeTab) {
      case "shared-by-me":
        return sharedPlans.filter(plan => plan.from_user_id === user.id);
      case "shared-with-me":
        return sharedPlans.filter(plan => plan.to_user_id === user.id);
      case "all-plans":
      default:
        return sharedPlans;
    }
  };

  const tabs = [
    { id: "shared-by-me", label: "Shared by Me" },
    { id: "shared-with-me", label: "Shared with Me" },
    { id: "all-plans", label: "All Plans" },
  ];

  const getStatusColor = (startTime: string, endTime: string) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (now > end) {
      return "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300"; // Completed
    } else if (now < start) {
      return "bg-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-400"; // Pending
    } else {
      return "bg-green-200 text-green-700 dark:bg-green-900 dark:text-green-300"; // Active
    }
  };

  const getStatus = (startTime: string, endTime: string) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (now > end) {
      return "Completed";
    } else if (now < start) {
      return "Pending";
    } else {
      return "Active";
    }
  };

  // Format time to AM/PM format
  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const filteredPlans = getFilteredPlans();

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
                <BreadcrumbPage className="text-xl">
                  Shared Plans
                </BreadcrumbPage>
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
        <div className="flex flex-1 flex-col p-6">
          {/* Tabs */}
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

          {/* Shared Plans Section */}
          <div className="mb-8">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Shared Plans</h2>
              <p className="text-muted-foreground">{date}</p>
            </div>

            <div className="flex flex-col gap-6">
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <p>Loading shared plans...</p>
                </div>
              ) : filteredPlans.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">
                    No shared plans found for this tab.
                  </p>
                </div>
              ) : (
                <>
                  {activeTab === "shared-by-me" && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Shared by Me</h3>
                      <div className="flex flex-col gap-4">
                        {filteredPlans.map((plan) => (
                          <div
                            key={plan.id}
                            className="p-4 border rounded-lg dark:border-gray-700"
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <h4 className="text-base font-medium text-blue-600 dark:text-blue-400">
                                  {plan.title}
                                </h4>
                                <div className="flex items-center gap-2 text-muted-foreground mt-1">
                                  <MapPin size={16} />
                                  <span>{plan.place || "No location specified"}</span>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground mt-1">
                                  <Users size={16} />
                                  <span>Shared with: {plan.shared_by_name || "User"}</span>
                                </div>
                                {plan.content && (
                                  <div className="flex items-center gap-2 text-muted-foreground mt-1">
                                    <Calendar size={16} />
                                    <span>Note: {plan.content}</span>
                                  </div>
                                )}
                              </div>
                              <div
                                className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(
                                  plan.start_time,
                                  plan.end_time
                                )}`}
                              >
                                {getStatus(plan.start_time, plan.end_time)}: {formatTime(plan.start_time)} - {formatTime(plan.end_time)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === "shared-with-me" && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Shared with Me</h3>
                      <div className="flex flex-col gap-4">
                        {filteredPlans.map((plan) => (
                          <div
                            key={plan.id}
                            className="p-4 border rounded-lg dark:border-gray-700"
                          >
                            <div className="flex justify-between items-center">
                              <div>
                                <h4 className="text-base font-medium text-blue-600 dark:text-blue-400">
                                  {plan.title}
                                </h4>
                                <div className="flex items-center gap-2 text-muted-foreground mt-1">
                                  <MapPin size={16} />
                                  <span>{plan.place || "No location specified"}</span>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground mt-1">
                                  <User size={16} />
                                  <span>Shared by: {plan.shared_by_name || "User"}</span>
                                </div>
                                {plan.content && (
                                  <div className="flex items-center gap-2 text-muted-foreground mt-1">
                                    <Calendar size={16} />
                                    <span>Note: {plan.content}</span>
                                  </div>
                                )}
                              </div>
                              <div
                                className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(
                                  plan.start_time,
                                  plan.end_time
                                )}`}
                              >
                                {getStatus(plan.start_time, plan.end_time)}: {formatTime(plan.start_time)} - {formatTime(plan.end_time)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === "all-plans" && (
                    <>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Shared by Me</h3>
                        <div className="flex flex-col gap-4">
                          {filteredPlans.filter(plan => user && plan.from_user_id === user.id).map((plan) => (
                            <div
                              key={plan.id}
                              className="p-4 border rounded-lg dark:border-gray-700"
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <h4 className="text-base font-medium text-blue-600 dark:text-blue-400">
                                    {plan.title}
                                  </h4>
                                  <div className="flex items-center gap-2 text-muted-foreground mt-1">
                                    <MapPin size={16} />
                                    <span>{plan.place || "No location specified"}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-muted-foreground mt-1">
                                    <Users size={16} />
                                    <span>Shared with: {plan.shared_by_name || "User"}</span>
                                  </div>
                                  {plan.content && (
                                    <div className="flex items-center gap-2 text-muted-foreground mt-1">
                                      <Calendar size={16} />
                                      <span>Note: {plan.content}</span>
                                    </div>
                                  )}
                                </div>
                                <div
                                  className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(
                                    plan.start_time,
                                    plan.end_time
                                  )}`}
                                >
                                  {getStatus(plan.start_time, plan.end_time)}: {formatTime(plan.start_time)} - {formatTime(plan.end_time)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-2">Shared with Me</h3>
                        <div className="flex flex-col gap-4">
                          {filteredPlans.filter(plan => user && plan.to_user_id === user.id).map((plan) => (
                            <div
                              key={plan.id}
                              className="p-4 border rounded-lg dark:border-gray-700"
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <h4 className="text-base font-medium text-blue-600 dark:text-blue-400">
                                    {plan.title}
                                  </h4>
                                  <div className="flex items-center gap-2 text-muted-foreground mt-1">
                                    <MapPin size={16} />
                                    <span>{plan.place || "No location specified"}</span>
                                  </div>
                                  <div className="flex items-center gap-2 text-muted-foreground mt-1">
                                    <User size={16} />
                                    <span>Shared by: {plan.shared_by_name || "User"}</span>
                                  </div>
                                  {plan.content && (
                                    <div className="flex items-center gap-2 text-muted-foreground mt-1">
                                      <Calendar size={16} />
                                      <span>Note: {plan.content}</span>
                                    </div>
                                  )}
                                </div>
                                <div
                                  className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(
                                    plan.start_time,
                                    plan.end_time
                                  )}`}
                                >
                                  {getStatus(plan.start_time, plan.end_time)}: {formatTime(plan.start_time)} - {formatTime(plan.end_time)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}

              <div className="mt-2">
                <div className="p-4 rounded-lg border border-dashed dark:border-gray-700 flex items-center justify-center">
                  <Button className="text-blue-600 flex items-center gap-2">
                    <Plus size={18} /> Create a new shared plan
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default SharedPlans;