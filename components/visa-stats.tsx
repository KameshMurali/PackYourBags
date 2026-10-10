import { CATEGORY_META, type summarise, type VisaCategory } from "@/lib/visa";
import { CountUp } from "@/components/visa-count-up";
import { VISA_TONES } from "@/components/visa-tones";

const STAT_CATEGORIES: VisaCategory[] = ["visa-free", "visa-on-arrival", "visa-required"];

type Stats = ReturnType<typeof summarise>;

function ratio(count: number, total: number) {
  return total > 0 ? Math.min(1, count / total) : 0;
}

// The four summary tiles. Numbers count to their new value and the bars glide when the
// passport, residence or held visas change. Bars are decorative (the numbers carry the meaning).
export function VisaStats({ stats }: { stats: Stats }) {
  return (
    <dl className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
      <div
        className="visa-tile visa-rise rounded-[1.5rem] bg-night p-4 text-white shadow-[0_18px_44px_rgba(10,34,51,0.22)] sm:p-5"
        style={{ "--visa-accent": "#ffb938", "--i": 0 } as React.CSSProperties}
      >
        <dt className="text-sm font-medium text-white/80">Reachable without a prior visa</dt>
        <dd className="mt-2 font-display text-4xl font-extrabold leading-none text-sun sm:text-5xl">
          <CountUp value={stats.freedom} />
          <span className="ml-2 font-sans text-lg font-semibold text-white/70">
            / <CountUp value={stats.total} />
          </span>
          <span aria-hidden className="mt-4 block h-1.5 overflow-hidden rounded-full bg-white/15">
            <span
              className="visa-bar block h-full rounded-full bg-sun"
              style={{ transform: `scaleX(${ratio(stats.freedom, stats.total)})` }}
            />
          </span>
        </dd>
      </div>

      {STAT_CATEGORIES.map((cat, i) => {
        const accent = VISA_TONES[CATEGORY_META[cat].tone].accent;
        return (
          <div
            key={cat}
            className="visa-tile visa-rise rounded-[1.5rem] border border-black/10 bg-white/90 p-4 shadow-[0_8px_24px_rgba(10,34,51,0.06)] sm:p-5"
            style={{ "--visa-accent": accent, "--i": i + 1 } as React.CSSProperties}
          >
            <dt className="text-sm font-medium text-muted">{CATEGORY_META[cat].label}</dt>
            <dd className="mt-2 font-display text-4xl font-extrabold leading-none text-ink sm:text-5xl">
              <CountUp value={stats.counts[cat]} />
              <span aria-hidden className="mt-4 block h-1.5 overflow-hidden rounded-full bg-ink/10">
                <span
                  className="visa-bar block h-full rounded-full"
                  style={{
                    background: accent,
                    transform: `scaleX(${ratio(stats.counts[cat], stats.total)})`,
                  }}
                />
              </span>
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
