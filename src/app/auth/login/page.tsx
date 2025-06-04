import { CalendarDaysIcon } from "lucide-react"

import { LoginForm } from "@/components/auth/login-form"
import { FlickeringGrid } from "@/components/magicui/flickering-grid"

export default function LoginPage() {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center p-6 md:p-10 overflow-hidden">
      {/* Fullscreen flickering background */}
      <FlickeringGrid
        className="absolute inset-0 -z-10 [mask-image:radial-gradient(600px_circle_at_center,white,transparent)]"
        squareSize={4}
        gridGap={6}
        color="#60A5FA"
        maxOpacity={0.5}
        flickerChance={0.1}
        height={1600}
        width={1600}
      />

      {/* Foreground content with a subtle background panel */}
      <div className="flex w-full max-w-sm flex-col gap-6 rounded-lg p-6 backdrop-blur-sm shadow-lg">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <CalendarDaysIcon className="size-4" />
          </div>
          DuoPlan
        </a>
        <LoginForm />
      </div>
    </div>
  )
}
