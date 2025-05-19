import { ThemeProvider } from "@/components/theme-provider";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import SyncUserProfile from '@/components/auth/SyncUserProfile';
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from 'next/headers';
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DuoPlan",
  description: "DuoPlan is a minimalist, real-time daily planner designed for two people. Share schedules, plan events, take notes, and stay in sync effortlessly with a modern, inclusive interface.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
const supabase = createServerComponentClient({ cookies });
const { 
  // You can destructure session or other properties here if needed
  // session,
} = await supabase.auth.getSession();

  return (
    <ClerkProvider
      appearance={{
        layout: {
          // disable the “Development mode” warnings/banner
          unsafe_disableDevelopmentModeWarnings: true,
        },
      }}
    >
      <SyncUserProfile />
      <html lang="en" suppressHydrationWarning>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster position="top-right" />
            </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
