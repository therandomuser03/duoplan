import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TextAnimate } from "@/components/magicui/text-animate";
import { DotPattern } from "../magicui/dot-pattern";
import { cn } from "@/lib/utils";

export default function Hero() {
  return (
    <section className="relative py-12 sm:py-16 md:py-20 overflow-hidden">
      {/* Dot Pattern Background */}
      <DotPattern
        className={cn(
          "absolute inset-0 -z-10 opacity-40",
          "[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]"
        )}
      />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center lg:flex-row lg:items-start lg:justify-between gap-8 lg:gap-12">
          <div className="flex-1 text-center lg:text-left max-w-2xl">
            <h1 className="mb-6 text-3xl font-bold tracking-tight sm:text-5xl md:text-5xl">
              <TextAnimate animation="blurInUp" by="character" once>
                Plan Together, Stay in Sync
              </TextAnimate>
            </h1>
            <p className="mb-8 text-lg sm:text-xl text-muted-foreground">
              DuoPlan is a streamlined planning tool designed for partners and close collaborators who need to stay coordinated without the complexity of traditional calendar apps. From appointments and travel plans to daily routines and shared tasks, DuoPlan offers a clean, intuitive interface built for two.
            </p>
            <div className="flex flex-row items-center justify-center lg:justify-start gap-3 md:gap-4 lg:gap-6">
              <Button size="default" className="px-4 py-2 md:px-6 md:py-3 lg:px-8 lg:py-4">
                <Link href="auth">Get Started</Link>
              </Button>
              <Button asChild variant="outline" size="default" className="px-4 py-2 md:px-6 md:py-3 lg:px-8 lg:py-4">
                <Link href="#features">Learn More</Link>
              </Button>
            </div>
          </div>
          <div className="w-full max-w-2xl overflow-hidden rounded-xl border bg-background shadow-xl">
            <Image 
              src="/dashboard.png" 
              alt="App preview" 
              width={1920} 
              height={1080}
              className="w-full h-auto"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
