import { cn } from "@/lib/utils";
import { Marquee } from "../magicui/marquee";
import Image from "next/image";

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

const firstRow = reviews.slice(0, reviews.length / 2);

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
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <Image
          className="rounded-full"
          src={img}
          alt={`${name}'s avatar`}
          width={32}
          height={32}
        />
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

export function Reviews() {
  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
      <Marquee pauseOnHover className="[--duration:20s]">
        {firstRow.map((review) => (
          <ReviewCard key={review.username} {...review} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
    </div>
  );
}