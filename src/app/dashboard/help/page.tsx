"use client";

import React from "react";

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
import { Calendar, FileText, Users, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


function Help() {
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
                <BreadcrumbPage className="text-xl">Help</BreadcrumbPage>
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
        <div className="flex flex-1 flex-col gap-6 p-6">
          {/* Hero section */}
          <div className="text-center py-8">
            <h1 className="text-3xl font-bold tracking-tight mb-3">How can we help you?</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Find answers to common questions about DuoPlan and learn how to make the most of its features.
            </p>
            <div className="flex w-full max-w-md mx-auto items-center gap-2 mt-6">
              <Input 
                type="search" 
                placeholder="Search help articles..." 
                className="flex-1"
              />
              <Button variant="default">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>

          {/* Quick links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickLinks.map((link, index) => (
              <div key={index} className="p-6 bg-muted/50 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  {link.icon}
                  <h3 className="text-lg font-medium">{link.title}</h3>
                </div>
                <p className="text-muted-foreground mb-4">{link.description}</p>
                <Button variant="outline" className="w-full">Learn More</Button>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="mt-8">
            <Tabs defaultValue="getting-started" className="w-full">
              <div className="flex justify-center mb-6">
                <TabsList>
                  <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
                  <TabsTrigger value="calendar">Calendar</TabsTrigger>
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                  <TabsTrigger value="plans">Shared Plans</TabsTrigger>
                  <TabsTrigger value="account">Account</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="getting-started">
                <div className="bg-muted/50 rounded-xl p-6">
                  <h2 className="text-xl font-semibold mb-4">Getting Started with DuoPlan</h2>
                  <Accordion type="single" collapsible className="w-full">
                    {gettingStartedFAQs.map((faq, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger>{faq.question}</AccordionTrigger>
                        <AccordionContent>{faq.answer}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </TabsContent>
              
              <TabsContent value="calendar">
                <div className="bg-muted/50 rounded-xl p-6">
                  <h2 className="text-xl font-semibold mb-4">Using the Calendar</h2>
                  <Accordion type="single" collapsible className="w-full">
                    {calendarFAQs.map((faq, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger>{faq.question}</AccordionTrigger>
                        <AccordionContent>{faq.answer}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </TabsContent>
              
              <TabsContent value="notes">
                <div className="bg-muted/50 rounded-xl p-6">
                  <h2 className="text-xl font-semibold mb-4">Working with Notes</h2>
                  <Accordion type="single" collapsible className="w-full">
                    {notesFAQs.map((faq, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger>{faq.question}</AccordionTrigger>
                        <AccordionContent>{faq.answer}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </TabsContent>
              
              <TabsContent value="plans">
                <div className="bg-muted/50 rounded-xl p-6">
                  <h2 className="text-xl font-semibold mb-4">Shared Plans Features</h2>
                  <Accordion type="single" collapsible className="w-full">
                    {sharedPlansFAQs.map((faq, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger>{faq.question}</AccordionTrigger>
                        <AccordionContent>{faq.answer}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </TabsContent>
              
              <TabsContent value="account">
                <div className="bg-muted/50 rounded-xl p-6">
                  <h2 className="text-xl font-semibold mb-4">Account Management</h2>
                  <Accordion type="single" collapsible className="w-full">
                    {accountFAQs.map((faq, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger>{faq.question}</AccordionTrigger>
                        <AccordionContent>{faq.answer}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Contact support */}
          <div className="bg-muted/50 rounded-xl p-6 mt-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Still need help?</h2>
            <p className="text-muted-foreground mb-4 max-w-lg mx-auto">
              If you couldn&apos;t find the answer to your question, our support team is ready to assist you.
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="outline">View Documentation</Button>
              <Button>Contact Support</Button>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

// Quick links data
const quickLinks = [
  {
    icon: <div className="bg-blue-100 text-blue-600 p-2 rounded-lg"><Calendar className="h-5 w-5" /></div>,
    title: "Calendar Features",
    description: "Learn how to create events, set reminders, and manage your schedule effectively."
  },
  {
    icon: <div className="bg-green-100 text-green-600 p-2 rounded-lg"><FileText className="h-5 w-5" /></div>,
    title: "Managing Notes",
    description: "Discover how to create, organize, and share notes with your team for better collaboration and productivity."
  },
  {
    icon: <div className="bg-purple-100 text-purple-600 p-2 rounded-lg"><Users className="h-5 w-5" /></div>,
    title: "Collaboration Tools",
    description: "Explore features for sharing plans and collaborating with team members."
  }
];

// FAQ data
const gettingStartedFAQs = [
  {
    question: "What is DuoPlan?",
    answer: "DuoPlan is a comprehensive productivity tool that combines calendar management, note-taking, and team collaboration features in one platform. It helps individuals and teams organize their schedules, share plans, and keep track of important information."
  },
  {
    question: "How do I create an account?",
    answer: "To create a DuoPlan account, click the 'Sign Up' button on the login page. You can register using your email address or sign up with Google, Microsoft, or Apple accounts. Follow the prompts to complete your profile setup."
  },
  {
    question: "Is there a mobile app available?",
    answer: "Yes, DuoPlan is available as a mobile app for both iOS and Android devices. You can download it from the App Store or Google Play Store to access your schedule and notes on the go."
  },
  {
    question: "How do I navigate the dashboard?",
    answer: "The dashboard provides an overview of your upcoming events, shared plans, and recent notes. Use the sidebar to access different sections of the app, including Calendar, Notes, and Shared Plans. The top section shows your today&apos;s schedule for quick reference."
  }
];

const calendarFAQs = [
  {
    question: "How do I create a new event?",
    answer: "To create a new event, click the '+' button in the header or directly on the calendar at your desired time slot. Fill in the event details including title, time, location, and any notes. You can also set reminders and invite others to the event."
  },
  {
    question: "Can I set recurring events?",
    answer: "Yes, when creating or editing an event, select the 'Repeat' option and choose your preferred recurrence pattern (daily, weekly, monthly, or yearly). You can also set end dates for recurring events or make them ongoing."
  },
  {
    question: "How do I share my calendar with others?",
    answer: "To share your calendar, go to Calendar Settings and select 'Sharing Options.' You can invite specific users by email and set their permission levels (view only, edit, or full access). You can also generate a shareable link with customized permissions."
  },
  {
    question: "Can I integrate with other calendar services?",
    answer: "Yes, DuoPlan supports integration with popular calendar services like Google Calendar, Microsoft Outlook, and Apple Calendar. Go to Settings > Integrations to connect your external calendars and sync events between platforms."
  }
];

const notesFAQs = [
  {
    question: "How do I create a new note?",
    answer: "To create a new note, navigate to the Notes section from the sidebar and click the '+' button. You can start typing right away. Notes automatically save as you type, and you can add titles, formatting, and attachments as needed."
  },
  {
    question: "Can I organize my notes into folders?",
    answer: "Yes, you can create folders to organize your notes. In the Notes section, click 'New Folder' to create a category. Drag and drop notes into folders, or select 'Move to' from the note&apos;s menu to change its location."
  },
  {
    question: "How do I share notes with team members?",
    answer: "To share a note, open it and click the 'Share' button in the top-right corner. Enter the email addresses of people you want to share with and set their access levels (view only or edit). Recipients will receive an email notification with access to the shared note."
  },
  {
    question: "Can I attach files to my notes?",
    answer: "Yes, you can attach files to notes by clicking the attachment icon in the note editor toolbar. You can upload files from your device or link documents from cloud services like Google Drive, Dropbox, or OneDrive."
  }
];

const sharedPlansFAQs = [
  {
    question: "What are Shared Plans?",
    answer: "Shared Plans are collaborative project spaces where team members can coordinate activities, assign tasks, and track progress together. They combine calendar events, notes, and task lists in a unified view accessible to all team members."
  },
  {
    question: "How do I create a new Shared Plan?",
    answer: "To create a Shared Plan, navigate to the Shared Plans section from the sidebar and click 'Create New Plan.' Give your plan a title, description, and optionally set a time frame. Then invite team members who will participate in the plan."
  },
  {
    question: "How do I add events to a Shared Plan?",
    answer: "Open the Shared Plan and click the '+' button in the Events section. Fill in the event details just like you would in your personal calendar. These events will be visible to all plan members and can be synchronized with their personal calendars."
  },
  {
    question: "Can I assign tasks within a Shared Plan?",
    answer: "Yes, within a Shared Plan, you can create task lists and assign specific tasks to team members. Each task can have a due date, priority level, and description. Members receive notifications about their assignments and can mark tasks as complete when finished."
  }
];

const accountFAQs = [
  {
    question: "How do I update my profile information?",
    answer: "To update your profile, click on your profile picture in the bottom-left corner of the sidebar and select 'Profile Settings.' Here, you can change your name, profile picture, email, and other account details."
  },
  {
    question: "How do I change my password?",
    answer: "To change your password, go to Profile Settings > Security. Click 'Change Password' and follow the prompts to enter your current password and set a new one. For security, we recommend updating your password regularly."
  },
  {
    question: "What notification settings are available?",
    answer: "Go to Profile Settings > Notifications to customize how and when you receive alerts. You can enable or disable notifications for events, notes updates, shared plan activities, and system announcements. You can receive notifications via email, browser, and mobile push notifications."
  },
  {
    question: "How do I delete my account?",
    answer: "To delete your account, go to Profile Settings > Account and select 'Delete Account' at the bottom of the page. You&apos;ll need to confirm this action by entering your password. Note that account deletion is permanent and all your data will be removed from our servers."
  }
];

export default Help;
