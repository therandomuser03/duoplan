// src/app/user/account/page.tsx
'use client' // Add this directive to make it a client component

import { useState, useEffect } from 'react';
import { useRouter, redirect } from 'next/navigation'; // Import useRouter from next/navigation
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
// Removed getCurrentUser as we'll fetch user client-side here
// import { getCurrentUser } from "@/utils/user"; // This is a server-side function, remove it for client component
import { createClient } from '@/utils/supabase/client'; // Client-side Supabase client
import { updateProfileDetails } from "@/utils/actions"; // Import the updateProfileDetails action
import { toast } from "sonner"; // Assuming Sonner is set up

// UI components for the form
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils"; // If not already imported for cn utility


export default function Account() { // Changed to client component, removed 'async'
  const router = useRouter();
  const [user, setUser] = useState<any>(null); // State to store the Supabase user object
  const [userProfile, setUserProfile] = useState<any>(null); // State to hold user profile data from 'users' table
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchUserData() {
      const supabase = createClient();
      const { data: { user: supabaseUser }, error: authError } = await supabase.auth.getUser();

      if (authError || !supabaseUser) {
        toast.error("Please log in to view your account details.");
        router.push('/login'); // Redirect to login if not authenticated
        return;
      }

      setUser(supabaseUser); // Store the authenticated user

      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (profileError) {
        console.error("Error fetching user profile:", profileError);
        toast.error("Failed to load profile data.");
      } else {
        setUserProfile(profile);
      }
      setIsLoading(false);
    }
    fetchUserData();
  }, [router]); // Depend on router to ensure effect runs if router changes (though unlikely for a fixed page)

  // Provide a default user object for AppSidebar when loading.
  // This ensures 'user' prop is never null, preventing "Cannot read properties of null" errors.
  // It includes common properties like 'id', 'email', and 'user_metadata' with 'avatar_url',
  // as well as a top-level 'avatar' which the error message specifically mentioned.
  const sidebarUser = user || {
    id: 'loading',
    email: 'loading@example.com',
    avatar: null, // Added to directly address 'reading 'avatar'' error if it's a top-level property
    user_metadata: { avatar_url: null, given_name: null, family_name: null }, // Ensure user_metadata is an object with default properties
  };


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(event.currentTarget);

    const result = await updateProfileDetails(formData); // Call the server action

    if (result.success) {
      toast.success(result.message);
      // Optionally, refresh user profile data after successful update (already there, keep it)
      const supabase = createClient();
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
      if (!profileError) setUserProfile(profile);

      // --- ADDED REDIRECTION HERE ---
      router.push('/dashboard'); // Redirect to the dashboard
      // --- END ADDED REDIRECTION ---

    } else {
      toast.error(result.message);
    }
    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <SidebarProvider>
        {/* Pass the default user object to AppSidebar during loading */}
        <AppSidebar user={sidebarUser} />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbPage>Account</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0 items-center justify-center">
            <p>Loading account details...</p>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  // If user is null (e.g., after redirecting to login), don't render content
  if (!user) {
    return null;
  }

  return (
    <SidebarProvider>
      {/* Pass the actual user object (or the default if still loading) to AppSidebar */}
      <AppSidebar user={sidebarUser} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Account</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {/* --- Profile Details Form Start --- */}
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Card className="mx-auto w-full max-w-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Your Profile</CardTitle>
              <CardDescription>
                Update your name and avatar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email_display">Email</Label>
                    <Input
                      id="email_display"
                      type="email"
                      defaultValue={userProfile?.email || user?.email || ''}
                      readOnly // Make email read-only
                      className="bg-gray-100 dark:bg-gray-800"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      name="first_name"
                      type="text"
                      placeholder="John"
                      defaultValue={userProfile?.first_name || ''}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="last_name">Last Name (Optional)</Label>
                    <Input
                      id="last_name"
                      name="last_name"
                      type="text"
                      placeholder="Doe"
                      defaultValue={userProfile?.last_name || ''}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="avatar_url">Avatar URL (Optional)</Label>
                    <Input
                      id="avatar_url"
                      name="avatar_url"
                      type="url"
                      placeholder="https://example.com/your-avatar.jpg"
                      defaultValue={userProfile?.avatar_url || ''}
                    />
                    {userProfile?.avatar_url && (
                      <div className="mt-2 text-center">
                        <img
                          src={userProfile.avatar_url}
                          alt="Current Avatar"
                          className="h-16 w-16 rounded-full object-cover mx-auto"
                        />
                        <p className="text-sm text-muted-foreground">Current Avatar</p>
                      </div>
                    )}
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : 'Save Profile'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
        {/* --- Profile Details Form End --- */}

      </SidebarInset>
    </SidebarProvider>
  );
}