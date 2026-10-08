import { CloudSun, Coffee, Landmark, MapPin, Ship, UtensilsCrossed } from "lucide-react";

// A sample day, in the same morning-to-evening timeline format the concierge produces.
const stops = [
  { time: "08:30", icon: Coffee, title: "Breakfast in Karaköy", note: "Simit, tea and the ferries" },
  { time: "10:00", icon: Landmark, title: "Hagia Sophia", note: "Go early, before the tour groups", highlight: "Pre-book" },
  { time: "13:30", icon: UtensilsCrossed, title: "Lunch in Balat", note: "Colourful streets, slow meal" },
  { time: "17:15", icon: Ship, title: "Bosphorus ferry", note: "Sunset from the top deck" },
];

export function DayPlanCard({ className = "" }: { className?: string }) {
  return (
    <div className={`story-shadow overflow-hidden rounded-[2rem] border border-ink/10 bg-white ${className}`}>
      <div className="flex items-center justify-between gap-3 bg-night px-5 py-4 text-white">
        <div>
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-sun">Sample day · Day 3 of 5</p>
          <p className="mt-1 font-display text-xl font-bold">Istanbul</p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm font-semibold">
          <CloudSun className="h-4 w-4 text-sun" />
          Mild &amp; sunny
        </div>
      </div>

      <ol className="relative px-5 py-4">
        <span aria-hidden className="absolute bottom-8 left-[3.55rem] top-8 w-px border-l-2 border-dashed border-ink/15" />
        {stops.map(({ time, icon: Icon, title, note, highlight }) => (
          <li key={time} className="relative flex items-start gap-4 py-2.5">
            <span className="w-11 shrink-0 pt-1.5 text-xs font-bold tabular-nums text-muted">{time}</span>
            <span
              className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                highlight ? "bg-coral text-night" : "bg-sand text-ink"
              }`}
            >
              <Icon className="h-4 w-4" />
            </span>
            <div className="min-w-0 pt-0.5">
              <p className="flex flex-wrap items-center gap-2 text-sm font-bold text-ink">
                {title}
                {highlight && (
                  <span className="rounded-full bg-coral px-2 py-0.5 text-[0.65rem] font-extrabold text-night">
                    {highlight}
                  </span>
                )}
              </p>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-muted">
                <MapPin className="h-3 w-3" />
                {note}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
