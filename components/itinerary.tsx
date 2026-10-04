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

export function ItineraryTimeline({ days }: { days: ItineraryDay[] }) {
  return (
    <ol className="relative space-y-4">
      <span
        aria-hidden
        className="pointer-events-none absolute left-[1.375rem] top-7 bottom-7 w-px bg-gradient-to-b from-clay/40 via-black/10 to-transparent"
      />
      {days.map((day, index) => (
        <li key={day.day} className="relative flex gap-4 sm:gap-5">
          <span className="relative z-10 mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink font-display text-lg leading-none text-[#f2e6d6] shadow-[0_12px_26px_rgba(32,25,20,0.26)]">
            {day.day}
          </span>
          <div className="flex-1 rounded-[1.4rem] border border-black/10 bg-white/75 p-5 transition duration-200 hover:-translate-y-0.5 hover:border-clay/40 hover:bg-white hover:shadow-[0_18px_44px_rgba(43,30,20,0.1)]">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-clay">
              {dayLabel(index, days.length)}
            </p>
            <h3 className="mt-1.5 font-display text-2xl leading-tight text-ink">{day.title}</h3>
            <p className="mt-2 text-sm leading-7 text-muted">{day.plan}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
