import { Marquee } from "@/components/magicui/marquee";
import ReviewCard from "./reviewCard";

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

export default function Testimonials() {
  return (
    <section className="bg-muted/40 py-20">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tight sm:text-4xl">
          What Users Say
        </h2>
        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
          <Marquee pauseOnHover className="[--duration:20s]">
            {reviews.map((review) => (
              <ReviewCard key={review.username} {...review} />
            ))}
          </Marquee>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background" />
        </div>
      </div>
    </section>
  );
}
