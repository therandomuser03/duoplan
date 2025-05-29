import { AppSidebar } from "@/components/dashboard/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, Calendar, FileText, Search, Settings, Users } from "lucide-react";
import { getCurrentUser } from "@/utils/user";
import { redirect } from "next/navigation";

// Quick links data
const quickLinks = [
  {
    icon: <div className="bg-blue-100 text-blue-600 p-3 rounded-full"><Calendar className="h-5 w-5" /></div>,
    title: "Calendar Features",
    description: "Learn how to create events, set reminders, and manage your schedule effectively."
  },
  {
    icon: <div className="bg-green-100 text-green-600 p-3 rounded-full"><FileText className="h-5 w-5" /></div>,
    title: "Managing Notes",
    description: "Create, organize, and share notes with your team for a better collaboration."
  },
  {
    icon: <div className="bg-purple-100 text-purple-600 p-3 rounded-full"><Users className="h-5 w-5" /></div>,
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

export default async function Support() {
    const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
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
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Support</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-8 p-6 mx-auto">
          {/* Hero section */}
          <div className="text-center py-10 bg-gradient-to-b from-background to-muted rounded-xl">
            <h1 className="text-4xl font-bold tracking-tight mb-4">How can we help you?</h1>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg">
              Find answers to common questions about DuoPlan and learn how to make the most of its features.
            </p>
            <div className="flex w-full max-w-md mx-auto items-center gap-2 mt-8 relative">
              <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search help articles..." className="flex-1 pl-10" />
              <Button variant="default">Search</Button>
            </div>
          </div>

          {/* Quick links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickLinks.map((link, index) => (
              <div key={index} className="p-6 bg-card border rounded-xl hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center gap-3 mb-4">
                  {link.icon}
                  <h3 className="text-lg font-semibold">{link.title}</h3>
                </div>
                <p className="text-muted-foreground mb-5">{link.description}</p>
                <Button variant="outline" className="w-full hover:bg-muted">Learn More</Button>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="mt-8 bg-card border rounded-xl overflow-hidden">
            <div className="bg-muted p-4 border-b">
              <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>
            </div>
            <Tabs defaultValue="getting-started" className="w-full">
              <div className="px-4 pt-4 pb-2 border-b bg-muted/50">
                <TabsList className="grid grid-cols-5 gap-4">
                  <TabsTrigger value="getting-started" className="text-sm">Getting Started</TabsTrigger>
                  <TabsTrigger value="calendar" className="text-sm">Calendar</TabsTrigger>
                  <TabsTrigger value="notes" className="text-sm">Notes</TabsTrigger>
                  <TabsTrigger value="plans" className="text-sm">Shared Plans</TabsTrigger>
                  <TabsTrigger value="account" className="text-sm">Account</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="getting-started" className="p-6">
                <Accordion type="single" collapsible className="w-full">
                  {gettingStartedFAQs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className="border-b">
                      <AccordionTrigger className="py-4 text-base font-medium hover:bg-muted/30 px-2 rounded">{faq.question}</AccordionTrigger>
                      <AccordionContent className="px-2 pb-4 text-muted-foreground">{faq.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>

              <TabsContent value="calendar" className="p-6">
                <Accordion type="single" collapsible className="w-full">
                  {calendarFAQs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className="border-b">
                      <AccordionTrigger className="py-4 text-base font-medium hover:bg-muted/30 px-2 rounded">{faq.question}</AccordionTrigger>
                      <AccordionContent className="px-2 pb-4 text-muted-foreground">{faq.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>

              <TabsContent value="notes" className="p-6">
                <Accordion type="single" collapsible className="w-full">
                  {notesFAQs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className="border-b">
                      <AccordionTrigger className="py-4 text-base font-medium hover:bg-muted/30 px-2 rounded">{faq.question}</AccordionTrigger>
                      <AccordionContent className="px-2 pb-4 text-muted-foreground">{faq.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>

              <TabsContent value="plans" className="p-6">
                <Accordion type="single" collapsible className="w-full">
                  {sharedPlansFAQs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className="border-b">
                      <AccordionTrigger className="py-4 text-base font-medium hover:bg-muted/30 px-2 rounded">{faq.question}</AccordionTrigger>
                      <AccordionContent className="px-2 pb-4 text-muted-foreground">{faq.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>

              <TabsContent value="account" className="p-6">
                <Accordion type="single" collapsible className="w-full">
                  {accountFAQs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className="border-b">
                      <AccordionTrigger className="py-4 text-base font-medium hover:bg-muted/30 px-2 rounded">{faq.question}</AccordionTrigger>
                      <AccordionContent className="px-2 pb-4 text-muted-foreground">{faq.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>
            </Tabs>
          </div>

          {/* Contact support */}
          <div className="bg-card border rounded-xl p-8 mt-8 text-center">
            <div className="bg-muted inline-flex p-3 rounded-full mb-4">
              <Book className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Still need help?</h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              If you couldn&apos;t find the answer to your question, our support team is ready to assist you.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
              <Button variant="outline" className="flex-1">
                <FileText className="h-4 w-4 mr-2" />
                View Documentation
              </Button>
              <Button className="flex-1">
                <Settings className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
