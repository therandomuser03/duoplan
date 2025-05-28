"use client";

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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useState } from "react";

export default function Feedback() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Feedback</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {/* Content */}
        <div className="max-w-2xl mx-auto p-6 flex flex-col gap-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">We value your feedback</h1>
            <p className="text-muted-foreground">
              Let us know how we&apos;re doing and how we can improve your
              experience.
            </p>
          </div>

          <form className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Name</label>
              <Input placeholder="Your name" />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Email</label>
              <Input type="email" placeholder="you@example.com" />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Rating</label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = hoverRating
                    ? star <= hoverRating
                    : star <= rating;
                  return (
                    <Star
                      key={star}
                      className={`h-5 w-5 cursor-pointer ${
                        isFilled
                          ? "fill-yellow-400 stroke-yellow-400"
                          : "stroke-muted-foreground"
                      }`}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                    />
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Message</label>
              <Textarea rows={4} placeholder="Share your thoughts..." />
            </div>

            <Button type="submit">
              Submit Feedback
            </Button>
          </form>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
