import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CTA() {
  return (
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
          <Link href="/">Try DuoPlan Now</Link>
        </Button>
      </div>
    </section>
  );
}
