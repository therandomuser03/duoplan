import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";

export default function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm lg:px-6">
      <Link href="/" className="flex items-center gap-2">
        <CalendarDays className="h-5 w-5" />
        <span className="text-lg font-semibold">DuoPlan</span>
      </Link>
      <div className="flex items-center gap-2">
        <Button asChild variant="outline" className="hidden sm:flex">
          <Link href="auth">
            Log In
          </Link>
        </Button>
        <ModeToggle />
      </div>
    </header>
  );
}
