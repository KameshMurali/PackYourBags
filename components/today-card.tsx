import { ItineraryTimeline } from "@/components/itinerary";
import type { ItineraryDay } from "@/lib/local-auth";

// An example itinerary drawn with the same timeline component the concierge uses, so this
// card shows what people actually get (day cards, no clock times, no weather) and can't drift.
const exampleDays: ItineraryDay[] = [
  {
    day: 1,
    title: "Ferries and old-city lanes",
    plan: "Land, drop your bags in Karaköy, then ride the ferry to Kadıköy for lunch.",
  },
  {
    day: 2,
    title: "Hagia Sophia, then slow Balat",
    plan: "Go early to beat the tour groups, then spend the afternoon in Balat’s cafés.",
  },
  {
    day: 3,
    title: "One last Bosphorus sunset",
    plan: "A slow morning, one more bazaar loop, then the ferry at golden hour.",
  },
];

export function DayPlanCard({ className = "" }: { className?: string }) {
  return (
    <div className={`story-shadow overflow-hidden rounded-[2rem] border border-ink/10 bg-white ${className}`}>
      <div className="flex items-center justify-between gap-3 bg-night px-5 py-4 text-white">
        <div>
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-sun">Example itinerary</p>
          <p className="mt-1 font-display text-xl font-bold">Istanbul</p>
        </div>
        <span className="rounded-full bg-white/10 px-3 py-1.5 text-sm font-semibold">
          {exampleDays.length} days
        </span>
      </div>

      <div className="bg-cream/60 p-4">
        <ItineraryTimeline days={exampleDays} compact />
      </div>
    </div>
  );
}
