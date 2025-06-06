import { ThemeProvider } from "@/components/shared/theme-provider"
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { SpaceProvider } from "@/contexts/SpaceContext";
import { Analytics } from '@vercel/analytics/next';

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SpaceProvider>
              {children}
              <Toaster richColors position="top-center" />
            </SpaceProvider>
          </ThemeProvider>
          <Analytics />
      </body>
    </html>
  );
}
