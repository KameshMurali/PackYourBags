import type { ResolvedDestination } from "@/lib/visa";

const MIN_ITEMS = 8;
const MAX_ITEMS = 14;

// A slow ticker of the destinations that are visa-free for the current selection. It only
// repeats what the cards below already say, so it is hidden from assistive tech. The list is
// rendered twice and shifted by exactly half for a seamless loop; reduced-motion users get
// a single static, wrapped row. Too few destinations would leave a gap at the loop point,
// so the strip is skipped in that case.
export function VisaTicker({ destinations }: { destinations: ResolvedDestination[] }) {
  const items = destinations
    .filter((d) => d.effective === "visa-free" && !d.residentHere)
    .slice(0, MAX_ITEMS)
    .map((d) => ({
      code: d.code,
      flag: d.flag,
      name: d.name,
      detail: d.effectiveDays ? `${d.effectiveDays} days` : "No visa",
    }));

  if (items.length < MIN_ITEMS) return null;

  return (
    <div
      aria-hidden
      className="visa-rise relative mt-6 flex items-stretch overflow-hidden rounded-[1.5rem] bg-sunset text-night shadow-[0_14px_36px_rgba(255,107,74,0.28)]"
      style={{ "--i": 4 } as React.CSSProperties}
    >
      <div className="relative z-10 flex max-w-[42%] shrink-0 items-center bg-night px-4 text-[0.68rem] font-extrabold uppercase leading-tight tracking-[0.18em] text-sun sm:px-6">
        <span className="sm:hidden">Visa-free</span>
        <span className="hidden sm:inline">Visa-free for you</span>
      </div>
      <div className="group visa-ticker-track relative flex-1 overflow-hidden py-3.5 motion-reduce:[mask-image:none]">
        <ul className="animate-marquee flex w-max gap-9 pr-9 group-hover:[animation-play-state:paused] motion-reduce:w-full motion-reduce:flex-wrap motion-reduce:gap-x-6 motion-reduce:gap-y-2 motion-reduce:px-4">
          {[...items, ...items].map((item, i) => (
            <li
              key={`${item.code}-${i}`}
              className={`flex items-center gap-2.5 whitespace-nowrap font-display text-base font-bold sm:text-lg ${
                i >= items.length ? "motion-reduce:hidden" : ""
              }`}
            >
              <span className="text-2xl leading-none">{item.flag}</span>
              {item.name}
              <span className="rounded-full bg-night/10 px-2.5 py-0.5 text-xs font-bold">{item.detail}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
