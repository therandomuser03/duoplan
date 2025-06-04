import Link from "next/link";
import { CalendarDays } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t py-10">
      <div className="container mx-auto px-4 flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5" />
          <span className="text-lg font-semibold">DuoPlan</span>
        </div>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} DuoPlan. All rights reserved.
        </p>
        <div className="flex gap-4">
          <Link
            href="/privacy"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Terms
          </Link>
          <Link
            href="https://linktr.ee/therandomuser03"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
