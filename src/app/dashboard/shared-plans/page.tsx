// shared-plans/page.tsx

"use client";

import React, { useState } from "react";

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

function SharedPlans() {
  const [activeTab, setActiveTab] = useState("shared-by-me");

  const today = new Date();
  const date = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const scheduleSharedByMe = [
    {
      title: "Marketing Sync",
      location: "Zoom",
      timeStart: "9:00 AM",
      timeEnd: "9:45 AM",
      status: "Active",
      note: "Weekly performance review",
    },
    {
      title: "Budget Approval Meeting",
      location: "Conference Room B",
      timeStart: "11:00 AM",
      timeEnd: "12:00 PM",
      status: "Pending",
    },
  ];

  const scheduleSharedWithMe = [
    {
      title: "Product Demo",
      location: "Client's Office",
      timeStart: "2:00 PM",
      timeEnd: "3:00 PM",
      status: "Active",
      note: "Showcase new features",
    },
    {
      title: "Retrospective",
      location: "Slack Huddle",
      timeStart: "4:00 PM",
      timeEnd: "4:30 PM",
      status: "Completed",
    },
  ];

  const tabs = [
    { id: "shared-by-me", label: "Shared by Me" },
    { id: "shared-with-me", label: "Shared with Me" },
    { id: "all-plans", label: "All Plans" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
      case "Pending":
        return "bg-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-400";
      case "Active":
      default:
        return "bg-green-200 text-green-700 dark:bg-green-900 dark:text-green-300";
    }
  };

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

          {/* Shared Plans Section - Updated with bottom UI style */}
          <div className="mb-8">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">Shared Plans</h2>
              <p className="text-muted-foreground">{date}</p>
            </div>

            <div className="flex flex-col gap-6">
              {/* Content based on active tab */}
              {activeTab === "shared-by-me" && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Shared by Me</h3>
                  <div className="flex flex-col gap-4">
                    {scheduleSharedByMe.map((item, index) => (
                      <div
                        key={index}
                        className="p-4 border rounded-lg dark:border-gray-700"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="text-base font-medium text-blue-600 dark:text-blue-400">
                              {item.title}
                            </h4>
                            <div className="flex items-center gap-2 text-muted-foreground mt-1">
                              <MapPin size={16} />
                              <span>{item.location}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground mt-1">
                              <Users size={16} />
                              <span>Shared with: Internal Team</span>
                            </div>
                            {item.note && (
                              <div className="flex items-center gap-2 text-muted-foreground mt-1">
                                <Calendar size={16} />
                                <span>Note: {item.note}</span>
                              </div>
                            )}
                          </div>
                          <div
                            className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(
                              item.status
                            )}`}
                          >
                            {item.status}: {item.timeStart} - {item.timeEnd}
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
                    {scheduleSharedWithMe.map((item, index) => (
                      <div
                        key={index}
                        className="p-4 border rounded-lg dark:border-gray-700"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="text-base font-medium text-blue-600 dark:text-blue-400">
                              {item.title}
                            </h4>
                            <div className="flex items-center gap-2 text-muted-foreground mt-1">
                              <MapPin size={16} />
                              <span>{item.location}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground mt-1">
                              <User size={16} />
                              <span>Shared by: Project Owner</span>
                            </div>
                            {item.note && (
                              <div className="flex items-center gap-2 text-muted-foreground mt-1">
                                <Calendar size={16} />
                                <span>Note: {item.note}</span>
                              </div>
                            )}
                          </div>
                          <div
                            className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(
                              item.status
                            )}`}
                          >
                            {item.status}: {item.timeStart} - {item.timeEnd}
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
                      {scheduleSharedByMe.map((item, index) => (
                        <div
                          key={index}
                          className="p-4 border rounded-lg dark:border-gray-700"
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="text-base font-medium text-blue-600 dark:text-blue-400">
                                {item.title}
                              </h4>
                              <div className="flex items-center gap-2 text-muted-foreground mt-1">
                                <MapPin size={16} />
                                <span>{item.location}</span>
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground mt-1">
                                <Users size={16} />
                                <span>Shared with: Internal Team</span>
                              </div>
                              {item.note && (
                                <div className="flex items-center gap-2 text-muted-foreground mt-1">
                                  <Calendar size={16} />
                                  <span>Note: {item.note}</span>
                                </div>
                              )}
                            </div>
                            <div
                              className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(
                                item.status
                              )}`}
                            >
                              {item.status}: {item.timeStart} - {item.timeEnd}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Shared with Me</h3>
                    <div className="flex flex-col gap-4">
                      {scheduleSharedWithMe.map((item, index) => (
                        <div
                          key={index}
                          className="p-4 border rounded-lg dark:border-gray-700"
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <h4 className="text-base font-medium text-blue-600 dark:text-blue-400">
                                {item.title}
                              </h4>
                              <div className="flex items-center gap-2 text-muted-foreground mt-1">
                                <MapPin size={16} />
                                <span>{item.location}</span>
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground mt-1">
                                <User size={16} />
                                <span>Shared by: Project Owner</span>
                              </div>
                              {item.note && (
                                <div className="flex items-center gap-2 text-muted-foreground mt-1">
                                  <Calendar size={16} />
                                  <span>Note: {item.note}</span>
                                </div>
                              )}
                            </div>
                            <div
                              className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(
                                item.status
                              )}`}
                            >
                              {item.status}: {item.timeStart} - {item.timeEnd}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
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