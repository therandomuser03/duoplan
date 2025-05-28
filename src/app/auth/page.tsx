"use client";

import { LoginForm } from "@/components/auth/login-form";
import { SignupForm } from "@/components/auth/signup-form";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDaysIcon } from "lucide-react";
import { useState } from "react";

export default function Auth() {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login"); // Type-safe state

  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center p-6 md:p-10 overflow-hidden">
      {/* Dynamic flickering background */}
      <FlickeringGrid
        className="absolute inset-0 -z-10 [mask-image:radial-gradient(600px_circle_at_center,white,transparent)]"
        squareSize={4}
        gridGap={6}
        color={activeTab === "login" ? "#60A5FA" : "#60fa6c"}
        maxOpacity={0.5}
        flickerChance={0.1}
        height={1600}
        width={1600}
      />

      {/* Foreground panel */}
      <div className="flex w-full max-w-sm flex-col gap-6 rounded-lg p-6 backdrop-blur-sm shadow-lg">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <CalendarDaysIcon className="h-4 w-4" />
          </div>
          DuoPlan
        </a>

        <Tabs
          defaultValue="login"
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "login" | "signup")} // Cast for type safety
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Signup</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <LoginForm />
          </TabsContent>

          <TabsContent value="signup">
            <SignupForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
