import { ItineraryDay } from "@/lib/local-auth";

function dayLabel(index: number, total: number) {
  if (index === 0) {
    return "Arrival";
  }

  if (index === total - 1) {
    return "Final day";
  }

  return "On the ground";
}

/** `compact` is a smaller rendering of the same timeline, for the landing page example. */
export function ItineraryTimeline({ days, compact = false }: { days: ItineraryDay[]; compact?: boolean }) {
  return (
    <ol className={`relative ${compact ? "space-y-3" : "space-y-4"}`}>
      <span
        aria-hidden
        className={`pointer-events-none absolute w-px bg-gradient-to-b from-clay/40 via-black/10 to-transparent ${
          compact ? "bottom-5 left-[1.125rem] top-5" : "bottom-7 left-[1.375rem] top-7"
        }`}
      />
      {days.map((day, index) => (
        <li key={day.day} className={`relative flex ${compact ? "gap-3" : "gap-4 sm:gap-5"}`}>
          <span
            className={`relative z-10 mt-1 flex shrink-0 items-center justify-center rounded-full bg-ink font-display leading-none text-[#fde8d3] shadow-[0_12px_26px_rgba(10,34,51,0.26)] ${
              compact ? "h-9 w-9 text-base" : "h-11 w-11 text-lg"
            }`}
          >
            {day.day}
          </span>
          <div
            className={`flex-1 rounded-[1.4rem] border border-black/10 bg-white/75 transition duration-200 hover:-translate-y-0.5 hover:border-clay/40 hover:bg-white hover:shadow-[0_18px_44px_rgba(10,34,51,0.1)] ${
              compact ? "p-3.5" : "p-5"
            }`}
          >
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-clay">
              {dayLabel(index, days.length)}
            </p>
            <h3 className={`mt-1.5 font-display leading-tight text-ink ${compact ? "text-lg" : "text-2xl"}`}>
              {day.title}
            </h3>
            <p className={`mt-2 text-muted ${compact ? "text-xs leading-6" : "text-sm leading-7"}`}>{day.plan}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
