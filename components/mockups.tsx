import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Compass,
  Globe2,
  MapPinned,
  Plane,
  Sparkles,
  Stars,
} from "lucide-react";

export function LeaveCard() {
  return (
    <div className="story-shadow overflow-hidden rounded-[2rem] border border-black/10 bg-white/85 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted">Leave balance</p>
          <h3 className="mt-2 font-display text-5xl tracking-tight text-ink">
            18
            <span className="ml-2 text-xl font-sans text-muted">days left</span>
          </h3>
          <p className="mt-3 max-w-xs text-sm leading-6 text-muted">
            Accrual, public holidays, and approved time off in one place.
          </p>
        </div>
        <div className="rounded-2xl bg-sand p-3 text-ink">
          <CalendarDays className="h-6 w-6" />
        </div>
      </div>

      <div className="mt-8 grid grid-cols-5 gap-3 text-center text-xs text-muted">
        {[
          ["Apr", "42%"],
          ["May", "56%"],
          ["Jun", "78%"],
          ["Jul", "62%"],
          ["Aug", "88%"],
        ].map(([month, height]) => (
          <div key={month} className="space-y-2">
            <div className="flex h-32 items-end rounded-full bg-[#f6efe3] p-1.5">
              <div
                className="w-full rounded-full bg-gradient-to-t from-ink to-clay"
                style={{ height }}
              />
            </div>
            <span>{month}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-2xl bg-[#fbf7f1] p-4">
          <p className="text-muted">Summer window</p>
          <p className="mt-1 font-semibold text-ink">July 18 → August 2</p>
        </div>
        <div className="rounded-2xl bg-[#fbf7f1] p-4">
          <p className="text-muted">Auto-synced policy</p>
          <p className="mt-1 font-semibold text-ink">UAE office calendar</p>
        </div>
      </div>
    </div>
  );
}

export function MapCard() {
  return (
    <div className="story-shadow relative overflow-hidden rounded-[2rem] border border-black/10 bg-white/82 p-6">
      <div className="page-grid absolute inset-0 opacity-65" />
      <div className="absolute -right-8 top-10 h-36 w-36 rounded-full bg-[#e8d7bf] blur-3xl" />
      <div className="relative min-h-[360px]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted">Route canvas</p>
            <h3 className="mt-1 font-display text-3xl text-ink">Turkey anniversary escape</h3>
          </div>
          <div className="rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm text-muted">
            5 nights
          </div>
        </div>

        <div className="absolute left-3 top-28 rounded-full bg-ink px-4 py-2 text-xs font-semibold text-white">
          Dubai
        </div>
        <div className="absolute right-8 top-24 rounded-full bg-clay px-4 py-2 text-xs font-semibold text-white">
          Istanbul
        </div>
        <div className="absolute bottom-16 left-[42%] rounded-full bg-[#305247] px-4 py-2 text-xs font-semibold text-white">
          Cappadocia
        </div>

        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 540 360" fill="none">
          <path
            d="M85 130 C190 50 340 120 430 118"
            stroke="#201914"
            strokeWidth="2"
            strokeDasharray="9 9"
          />
          <path
            d="M430 124 C388 186 336 238 256 282"
            stroke="#201914"
            strokeWidth="2"
            strokeDasharray="9 9"
          />
        </svg>
        <Plane className="absolute left-[48%] top-[35%] h-6 w-6 rotate-45 text-ink" />

        <div className="absolute bottom-3 left-3 right-3 rounded-[1.65rem] border border-black/10 bg-white/85 p-4 backdrop-blur">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-ink">Dubai → Istanbul</p>
              <p className="mt-1 text-sm text-muted">22 May · Emirates · Direct</p>
            </div>
            <div className="rounded-2xl bg-[#f5edde] px-3 py-2 text-sm font-semibold text-ink">
              Confirmed
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function VisaCard() {
  const items = [
    ["Georgia", "No visa", "Weekend-ready"],
    ["Japan", "eVisa path", "Documents prefilled"],
    ["Morocco", "No visa", "Warm weather"],
    ["Thailand", "Visa on arrival", "Popular in August"],
  ];

  return (
    <div className="story-shadow rounded-[2rem] border border-black/10 bg-white/85 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted">Visa intelligence</p>
          <h3 className="mt-1 font-display text-3xl text-ink">Where can I go next month?</h3>
        </div>
        <div className="rounded-2xl bg-[#f7efe3] p-3 text-ink">
          <Globe2 className="h-6 w-6" />
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {items.map(([country, visa, note]) => (
          <div
            key={country}
            className="flex items-center justify-between gap-4 rounded-[1.35rem] border border-black/10 bg-[#fffcf7] px-4 py-4"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-[#f1e7d9] p-3">
                <Compass className="h-4 w-4 text-ink" />
              </div>
              <div>
                <p className="font-semibold text-ink">{country}</p>
                <p className="text-sm text-muted">{note}</p>
              </div>
            </div>
            <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-semibold text-ink">
              {visa}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ChatCard() {
  return (
    <div className="story-shadow rounded-[2rem] border border-black/10 bg-[#1d1914] p-6 text-white">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Sparkles className="h-4 w-4" />
          PackYourBags AI
        </div>
        <div className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/70">
          Concierge mode
        </div>
      </div>

      <div className="ml-auto max-w-[86%] rounded-[1.6rem] rounded-tr-md bg-[#f2e6d6] p-4 text-sm leading-6 text-[#1d1914]">
        Plan a 6-day summer trip with beach clubs, one design hotel, and two days of remote work.
      </div>

      <div className="mt-4 rounded-[1.7rem] rounded-tl-md bg-white/10 p-5 text-sm leading-6 text-white/85">
        <p className="font-semibold text-white">Done. I created your trip stack:</p>
        {[
          "5 candidate cities ranked by visa ease and flight time",
          "Two hotel moods: boutique calm and modern waterfront",
          "Remote-work blocks placed between activity days",
          "PTO request drafted for your manager",
        ].map((item) => (
          <p key={item} className="mt-2 flex gap-2">
            <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#e6c298]" />
            {item}
          </p>
        ))}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-[1.35rem] bg-white/8 p-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-white/50">
            <MapPinned className="h-3.5 w-3.5" />
            Route
          </div>
          <p className="mt-2 font-semibold text-white">Dubai → Bodrum → Istanbul</p>
        </div>
        <div className="rounded-[1.35rem] bg-white/8 p-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-white/50">
            <Stars className="h-3.5 w-3.5" />
            Style
          </div>
          <p className="mt-2 font-semibold text-white">Quiet luxury with local food spots</p>
        </div>
      </div>

      <button className="mt-6 flex w-full items-center justify-between rounded-full border border-white/10 bg-white/6 px-4 py-3 text-left text-sm text-white/70">
        Ask AI to build the next itinerary
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}

