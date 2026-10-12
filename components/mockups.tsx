import { CalendarDays, CheckCircle2, Compass, Download, Globe2, MapPinned, Sparkles } from "lucide-react";

// Illustrative cards for the landing page, each tagged "Example". The visa rows mirror rules
// verified in lib/visa for an Indian passport with UAE residence. The chat and connect cards
// only show things the product really does: there is no weather, route, remote-work or
// connection-status feature behind them.

function ExampleTag({ tone }: { tone: "on-light" | "on-dark" | "on-sun" }) {
  const colours = {
    "on-light": "bg-ink/[0.06] text-muted",
    "on-dark": "bg-white/15 text-white/80",
    "on-sun": "bg-night/10 text-night/70",
  }[tone];
  return (
    <span
      className={`shrink-0 rounded-full px-2.5 py-1 text-[0.62rem] font-extrabold uppercase tracking-[0.18em] ${colours}`}
    >
      Example
    </span>
  );
}

export function ConnectCard() {
  return (
    <div className="story-shadow overflow-hidden rounded-[2rem] border border-ink/10 bg-white">
      <div className="bg-sunset px-6 py-5 text-night">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.2em]">Connect once</p>
          <ExampleTag tone="on-sun" />
        </div>
        <p className="mt-1 font-display text-2xl font-bold leading-tight">Plan in chat. Keep it here.</p>
      </div>
      <div className="space-y-3 p-6">
        <div className="flex flex-wrap gap-2">
          {["Claude", "ChatGPT"].map((name) => (
            <span
              key={name}
              className="rounded-full border border-ink/10 bg-cream px-4 py-2 text-sm font-bold text-ink"
            >
              {name}
            </span>
          ))}
        </div>
        <div className="rounded-[1.25rem] bg-night p-4 text-sm leading-6 text-white/90">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-sun">You, in Claude</p>
          <p className="mt-1.5">&ldquo;Save this Istanbul itinerary to PackYourBags.&rdquo;</p>
        </div>
        {/* Mirrors a row of the "From your assistant" inbox on the Connect page. */}
        <div className="flex items-center justify-between gap-3 rounded-[1.25rem] border border-dashed border-lagoon/50 bg-lagoon/5 px-4 py-3.5">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-clay">Itinerary</p>
            <p className="mt-1 font-bold text-ink">Istanbul</p>
            <p className="text-xs text-muted">from your assistant</p>
          </div>
          <span className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-ink px-4 text-sm font-semibold text-white">
            <Download className="h-4 w-4" />
            Import
          </span>
        </div>
      </div>
    </div>
  );
}

export function VisaCard() {
  const items: Array<[string, string, string, "free" | "free-cond"]> = [
    ["Philippines", "No visa · 14 days", "Indian passport", "free"],
    ["Georgia", "No visa · 90 days", "With your UAE residence", "free-cond"],
    ["Armenia", "No visa · 180 days", "UAE residents, until Jul 2027", "free-cond"],
    ["Sri Lanka", "Free online ETA", "Apply before you fly", "free"],
  ];

  return (
    <div className="story-shadow rounded-[2rem] border border-ink/10 bg-white p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-muted">Indian passport · UAE resident</p>
            <ExampleTag tone="on-light" />
          </div>
          <h3 className="mt-1 font-display text-3xl font-bold text-ink">Where can I go next month?</h3>
        </div>
        <div className="rounded-2xl bg-lagoon/10 p-3 text-lagoon">
          <Globe2 className="h-6 w-6" />
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {items.map(([country, visa, note, kind]) => (
          <div
            key={country}
            className="flex items-center justify-between gap-4 rounded-[1.35rem] border border-ink/10 bg-cream px-4 py-4"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-sand p-3">
                <Compass className="h-4 w-4 text-ink" />
              </div>
              <div>
                <p className="font-bold text-ink">{country}</p>
                <p className="text-sm text-muted">{note}</p>
              </div>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${
                kind === "free" ? "bg-lagoon text-white" : "bg-sun text-night"
              }`}
            >
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
    <div className="story-shadow rounded-[2rem] border border-white/10 bg-night p-6 text-white">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm font-bold">
          <Sparkles className="h-4 w-4 text-sun" />
          PackYourBags concierge
        </div>
        <ExampleTag tone="on-dark" />
      </div>

      <div className="ml-auto max-w-[86%] rounded-[1.6rem] rounded-tr-md bg-sun p-4 text-sm font-medium leading-6 text-night">
        Plan a 6-day summer trip to Bodrum with beach clubs and one design hotel.
      </div>

      <div className="mt-4 rounded-[1.7rem] rounded-tl-md bg-white/10 p-5 text-sm leading-6 text-white/90">
        <p className="font-bold text-white">Done. Here&apos;s what you get:</p>
        {[
          "Day-by-day itinerary with morning, afternoon and evening plans",
          "A short overview of the trip’s shape and pacing",
          "Saved in this browser, ready to regenerate",
        ].map((item) => (
          <p key={item} className="mt-2 flex gap-2">
            <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-sun" />
            {item}
          </p>
        ))}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-[1.35rem] bg-white/[0.08] p-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-white/55">
            <MapPinned className="h-3.5 w-3.5" />
            Destination
          </div>
          <p className="mt-2 font-bold text-white">Bodrum</p>
        </div>
        <div className="rounded-[1.35rem] bg-white/[0.08] p-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-white/55">
            <CalendarDays className="h-3.5 w-3.5" />
            Length
          </div>
          <p className="mt-2 font-bold text-white">6 days</p>
        </div>
      </div>

      <div className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-white/10 px-4 py-3 text-sm font-bold text-white">
        Plan another trip
        <Sparkles className="h-4 w-4 text-sun" />
      </div>
    </div>
  );
}
