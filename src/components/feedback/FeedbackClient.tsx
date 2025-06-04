"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
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
import { UserDisplayData } from "@/utils/user";

// Configure Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function FeedbackClient({ user }: { user: UserDisplayData }) {
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate form
    if (!rating) {
      setError("Please select a rating");
      return;
    }
    if (!message.trim()) {
      setError("Please enter your feedback message");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error: submitError } = await supabase.from("feedback").insert({
        name,
        email,
        rating,
        message: message.trim(),
        created_at: new Date().toISOString()
      });

      if (submitError) {
        throw new Error(submitError.message);
      }

      // Reset form
      setRating(0);
      setMessage("");
      alert("Thank you for your feedback!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar user={user} selectedDate={""} onDateSelect={() => {}} />
      <SidebarInset>
        {/* Header */}
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

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-sm font-medium">Name</label>
              <Input 
                placeholder="Your name" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Email</label>
              <Input 
                type="email" 
                placeholder="you@example.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
              />
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
                        isFilled ? "fill-yellow-400 stroke-yellow-400" : "stroke-muted-foreground"
                      } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                      onClick={() => !isSubmitting && setRating(star)}
                      onMouseEnter={() => !isSubmitting && setHoverRating(star)}
                      onMouseLeave={() => !isSubmitting && setHoverRating(0)}
                    />
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Message</label>
              <Textarea 
                rows={4} 
                placeholder="Share your thoughts..." 
                value={message} 
                onChange={(e) => setMessage(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </Button>
          </form>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
