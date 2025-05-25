import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TextAnimate } from "@/components/magicui/text-animate";
import { DotPattern } from "../magicui/dot-pattern";
import { cn } from "@/lib/utils";

export default function Hero() {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Dot Pattern Background */}
      <DotPattern
        className={cn(
          "absolute inset-0 -z-10 opacity-40",
          "[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]"
        )}
      />
      <div className="container mx-auto px-4 flex flex-col items-center lg:flex-row lg:items-start lg:justify-between">
        <div className="pb-10 text-center lg:text-left">
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            <TextAnimate animation="blurInUp" by="character" once>
              Plan Together, Stay in Sync
            </TextAnimate>
          </h1>
          <p className="mb-10 pt-4 mr-4 text-xl text-muted-foreground">
            DuoPlan is a thoughtfully designed shared planning tool built specifically for couples, partners, and close collaborators who need to stay in sync without the clutter and complexity of traditional calendar apps.
            <br /><br />
            Whether you're managing appointments, planning a trip, coordinating weekly routines, or simply remembering to buy groceries — DuoPlan brings it all together in a minimalist, beautiful interface that works for two.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
            <Button size="lg" className="px-8">
              Get Started
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="#features">Learn More</Link>
            </Button>
          </div>
        </div>
        <div className="w-full max-w-2xl overflow-hidden rounded-xl border bg-background shadow-xl">
          <Image src="/screenshot.png" alt="App preview" width={1920} height={1080} />
        </div>
      </div>
    </section>
  );
}
