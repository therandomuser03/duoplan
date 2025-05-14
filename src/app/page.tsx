import Link from "next/link"
import Image from "next/image"
import { CalendarDays, CheckCircle2, Clock, Share2, StickyNote, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
// import { LandingHeader } from "@/components/landing-header"
import { ModeToggle } from "@/components/mode-toggle"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* <LandingHeader /> */}

      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm lg:px-6">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 sm:max-w-sm">
              <div className="py-4">
                <div className="flex items-center gap-2 px-4 py-2">
                  <CalendarDays className="h-5 w-5" />
                  <span className="text-lg font-semibold">DuoPlan</span>
                </div>
                <nav className="mt-6 flex flex-col gap-1 px-2">
                  <Link
                    href="#features"
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
                  >
                    Features
                  </Link>
                  <Link
                    href="#"
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
                  >
                    Pricing
                  </Link>
                  <Link
                    href="#"
                    className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
                  >
                    About
                  </Link>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            <span className="text-lg font-semibold">DuoPlan</span>
          </Link>
        </div>
        <nav className="hidden gap-6 md:flex">
          <Link href="#features" className="text-sm font-medium transition-colors hover:text-primary">
            Features
          </Link>
          <Link href="#" className="text-sm font-medium transition-colors hover:text-primary">
            Pricing
          </Link>
          <Link href="#" className="text-sm font-medium transition-colors hover:text-primary">
            About
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <Button asChild variant="outline" className="hidden sm:flex">
            <Link href="/login">Log In</Link>
          </Button>
        </div>
      </header>

      {/* Hero Section with App Preview */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-start lg:justify-between">
            {/* Hero Text Content */}
            <div className="max-w-xl text-center lg:text-left">
              <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                Plan Together, <span className="text-primary">Stay in Sync</span>
              </h1>
              <p className="mb-10 text-xl text-muted-foreground">
                DuoPlan is a minimalist shared calendar and note-taking app designed for couples and partners to coordinate
                their schedules effortlessly.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
                <Button asChild size="lg" className="px-8">
                  <Link href="/dashboard">Get Started</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="#features">Learn More</Link>
                </Button>
              </div>
            </div>
            
            {/* App Preview Image */}
            <div className="w-full max-w-2xl overflow-hidden rounded-xl border bg-background shadow-xl lg:flex-shrink-0">
              <Image
                src="/placeholder.svg?height=600&width=800"
                width={800}
                height={600}
                alt="DuoPlan Calendar Interface"
                className="w-full"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tight sm:text-4xl">Key Features</h2>
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
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tight sm:text-4xl">What Users Say</h2>
          <div className="mx-auto max-w-6xl grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <TestimonialCard
              quote="DuoPlan has been a game-changer for coordinating our busy schedules. We never miss important dates anymore!"
              author="Alex & Jordan"
            />
            <TestimonialCard
              quote="The clean design is exactly what we were looking for. No unnecessary features, just what we need to stay organized."
              author="Taylor & Casey"
            />
            <TestimonialCard
              quote="Being able to attach notes to calendar events has made planning trips and appointments so much easier."
              author="Morgan & Riley"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 flex flex-col items-center text-center">
          <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl">Ready to Get Started?</h2>
          <p className="mb-10 max-w-2xl text-xl text-muted-foreground">
            Join thousands of couples who are already using DuoPlan to simplify their shared scheduling.
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
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} DuoPlan. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Terms
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center rounded-lg border bg-background p-6 text-center shadow-sm transition-all hover:shadow-md">
      <div className="mb-4">{icon}</div>
      <h3 className="mb-2 text-xl font-medium">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}

interface TestimonialCardProps {
  quote: string;
  author: string;
}

function TestimonialCard({ quote, author }: TestimonialCardProps) {
  return (
    <div className="flex flex-col rounded-lg border bg-background p-6 shadow-sm">
      <div className="mb-4 text-4xl">"</div>
      <p className="mb-4 flex-1 italic text-muted-foreground">{quote}</p>
      <p className="font-medium">— {author}</p>
    </div>
  )
}