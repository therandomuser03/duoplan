"use client";

import Link from "next/link";
// import Image from "next/image"
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Share2,
  StickyNote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { TextAnimate } from "@/components/magicui/text-animate";
import { cn } from "@/lib/utils";
import { Marquee } from "@/components/magicui/marquee";
import {
  SignInButton,
  SignUpButton,
  SignedOut,
} from "@clerk/nextjs";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";


const reviews = [
  {
    name: "Ava Martinez",
    username: "@ava_m",
    body: "My partner and I finally stopped arguing over missed appointments. DuoPlan just works — clean, simple, and honestly a relationship saver.",
    img: "https://avatar.vercel.sh/ava",
  },
  {
    name: "Ethan Clarke",
    username: "@ethan.clarke",
    body: "I’ve tried a lot of shared calendars, but this one actually fits into our daily routine without being overwhelming. Highly recommend.",
    img: "https://avatar.vercel.sh/ethan",
  },
  {
    name: "Lena Kim",
    username: "@lenakim",
    body: "The ability to add notes to events is a game-changer. We plan trips, groceries, even small reminders together now.",
    img: "https://avatar.vercel.sh/lena",
  },
  {
    name: "Marcus Grant",
    username: "@marcus_g",
    body: "We’ve been using DuoPlan for 3 months and haven’t double-booked once. It’s the little things that make it feel designed for two.",
    img: "https://avatar.vercel.sh/marcus",
  },
  {
    name: "Nina Alvarez",
    username: "@nina.alvarez",
    body: "Minimalist but powerful. Syncs instantly across our phones and helps us stay on the same page — literally and figuratively.",
    img: "https://avatar.vercel.sh/nina",
  },
  {
    name: "Sam Patel",
    username: "@sampatel",
    body: "It’s not just a calendar. It’s become our shared space for everything from dentist appointments to weekend plans. Super intuitive.",
    img: "https://avatar.vercel.sh/sam",
  },
];

const firstRow = reviews.slice(0, reviews.length);

const ReviewCard = ({
  img,
  name,
  username,
  body,
}: {
  img: string;
  name: string;
  username: string;
  body: string;
}) => {
  return (
    <figure
      className={cn(
        "relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <img className="rounded-full" width="32" height="32" alt="" src={img} />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium dark:text-white/40">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </figure>
  );
};

export default function LandingPage() {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      router.push("/dashboard");
    }
  }, [isSignedIn, router]);
  
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm lg:px-6">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            <span className="text-lg font-semibold">DuoPlan</span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />
            <SignedOut>
  <SignInButton mode="modal">
    <Button variant="outline" className="hidden sm:flex">
      Log In
    </Button>
  </SignInButton>
</SignedOut>
        </div>
      </header>

      {/* Hero Section with App Preview */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto">
          <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-start lg:justify-between">
            {/* Hero Text Content */}
            <div className="pb-10 text-center lg:text-left">
              <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                <TextAnimate animation="blurInUp" by="character" once>
                  Plan Together, Stay in Sync
                </TextAnimate>
              </h1>
              <p className="mb-10 text-xl text-muted-foreground">
                DuoPlan is a minimalist shared calendar and note-taking app
                designed for couples and partners to coordinate their schedules
                effortlessly.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
                <SignUpButton mode="modal">
      <Button size="lg" className="px-8">Get Started</Button>
    </SignUpButton>



                <Button asChild variant="outline" size="lg">
                  <Link href="#features">Learn More</Link>
                </Button>
              </div>
            </div>

            {/* App Preview Image */}
            <div className="w-full max-w-2xl overflow-hidden rounded-xl border bg-background shadow-xl lg:flex-shrink-0"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tight sm:text-4xl">
            Key Features
          </h2>
          <div className="mx-auto max-w-6xl grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<CalendarDays className="h-10 w-10 text-primary" />}
              title="Shared Calendar"
              description="Keep your schedules in sync with a real-time shared calendar that updates instantly across devices."
            />
            <FeatureCard
              icon={<StickyNote className="h-10 w-10 text-primary" />}
              title="Integrated Notes"
              description="Attach detailed notes to calendar events or keep standalone notes for important information."
            />
            <FeatureCard
              icon={<Share2 className="h-10 w-10 text-primary" />}
              title="Seamless Sharing"
              description="Share your calendar with your partner with just one click. No complicated setup required."
            />
            <FeatureCard
              icon={<Clock className="h-10 w-10 text-primary" />}
              title="Real-time Updates"
              description="See changes instantly when your partner adds or modifies events on their calendar."
            />
            <FeatureCard
              icon={<CheckCircle2 className="h-10 w-10 text-primary" />}
              title="Minimalist Design"
              description="Clean, distraction-free interface that focuses on what matters most - your schedule."
            />
            <FeatureCard
              icon={<CalendarDays className="h-10 w-10 text-primary" />}
              title="Multiple Views"
              description="Switch between day, week, and month views to plan your schedule at different levels of detail."
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-muted/40 py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tight sm:text-4xl">
            What Users Say
          </h2>
          <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
            <Marquee pauseOnHover className="[--duration:20s]">
              {firstRow.map((review) => (
                <ReviewCard key={review.username} {...review} />
              ))}
            </Marquee>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 flex flex-col items-center text-center">
          <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to Get Started?
          </h2>
          <p className="mb-10 max-w-2xl text-xl text-muted-foreground">
            Join thousands of couples who are already using DuoPlan to simplify
            their shared scheduling.
          </p>
          <Button asChild size="lg" className="px-8">
            <Link href="/dashboard">Try DuoPlan Now</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
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
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Privacy
            </Link>
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Terms
            </Link>
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Contact
            </Link>
          </div>
        </div>
      </footer>  

      {/* <SignUpButton mode="modal">
      <Button variant="outline">Sign Up</Button>
    </SignUpButton> */}

    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center rounded-lg border bg-background p-6 text-center shadow-sm transition-all hover:shadow-md">
      <div className="mb-4">{icon}</div>
      <h3 className="mb-2 text-xl font-medium">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
