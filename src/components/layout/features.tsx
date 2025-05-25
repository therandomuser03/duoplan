import {
  CalendarDays,
  StickyNote,
  Share2,
  Clock,
  CheckCircle2,
} from "lucide-react";

const features = [
  {
    icon: <CalendarDays className="h-10 w-10 text-primary" />,
    title: "Shared Calendar",
    description: "Keep your schedules in sync with a real-time shared calendar that updates instantly across devices.",
  },
  {
    icon: <StickyNote className="h-10 w-10 text-primary" />,
    title: "Integrated Notes",
    description: "Attach detailed notes to calendar events or keep standalone notes for important information.",
  },
  {
    icon: <Share2 className="h-10 w-10 text-primary" />,
    title: "Seamless Sharing",
    description: "Share your calendar with your partner with just one click. No complicated setup required.",
  },
  {
    icon: <Clock className="h-10 w-10 text-primary" />,
    title: "Real-time Updates",
    description: "See changes instantly when your partner adds or modifies events on their calendar.",
  },
  {
    icon: <CheckCircle2 className="h-10 w-10 text-primary" />,
    title: "Minimalist Design",
    description: "Clean, distraction-free interface that focuses on what matters most - your schedule.",
  },
  {
    icon: <CalendarDays className="h-10 w-10 text-primary" />,
    title: "Multiple Views",
    description: "Switch between day, week, and month views to plan your schedule at different levels of detail.",
  },
];

function FeatureCard({ icon, title, description }: any) {
  return (
    <div className="flex flex-col items-center rounded-lg border bg-background p-6 text-center shadow-sm hover:shadow-md">
      <div className="mb-4">{icon}</div>
      <h3 className="mb-2 text-xl font-medium">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

export default function Features() {
  return (
    <section id="features" className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-3xl font-bold sm:text-4xl">Key Features</h2>
        <div className="grid gap-8 mx-auto max-w-6xl md:grid-cols-2 lg:grid-cols-3">
          {features.map((f, idx) => (
            <FeatureCard key={idx} {...f} />
          ))}
        </div>
      </div>
    </section>
  );
}
