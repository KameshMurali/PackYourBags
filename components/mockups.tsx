import { ArrowRight, CheckCircle2, Compass, Globe2, MapPinned, Sparkles, Stars } from "lucide-react";

// Illustrative product cards for the landing page. The visa rows mirror rules that
// are verified in lib/visa for an Indian passport with UAE residence.

export function ConnectCard() {
  return (
    <div className="story-shadow overflow-hidden rounded-[2rem] border border-ink/10 bg-white">
      <div className="bg-sunset px-6 py-5 text-night">
        <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.2em]">Connect once</p>
        <p className="mt-1 font-display text-2xl font-bold leading-tight">Plan in chat. Keep it here.</p>
      </div>
      <div className="space-y-3 p-6">
        {["Claude", "ChatGPT"].map((name) => (
          <div
            key={name}
            className="flex items-center justify-between rounded-[1.25rem] border border-ink/10 bg-cream px-4 py-3.5"
          >
            <span className="font-bold text-ink">{name}</span>
            <span className="flex items-center gap-1.5 rounded-full bg-lagoon/10 px-3 py-1 text-xs font-bold text-lagoon">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Connected
            </span>
          </div>
        ))}
        <div className="rounded-[1.25rem] bg-night p-4 text-sm leading-6 text-white/90">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-sun">You, in Claude</p>
          <p className="mt-1.5">&ldquo;Save this Istanbul itinerary to PackYourBags.&rdquo;</p>
        </div>
        <div className="flex items-center gap-3 rounded-[1.25rem] border border-dashed border-lagoon/50 bg-lagoon/5 px-4 py-3.5">
          <MapPinned className="h-5 w-5 shrink-0 text-lagoon" />
          <div className="min-w-0">
            <p className="font-bold text-ink">Istanbul · 5 days</p>
            <p className="text-sm text-muted">Saved from Claude, waiting in your inbox</p>
          </div>
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
          <p className="text-sm font-semibold text-muted">Indian passport · UAE resident</p>
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
        <div className="rounded-full border border-white/15 px-3 py-1 text-xs text-white/70">Claude Sonnet</div>
      </div>

      <div className="ml-auto max-w-[86%] rounded-[1.6rem] rounded-tr-md bg-sun p-4 text-sm font-medium leading-6 text-night">
        Plan a 6-day summer trip with beach clubs, one design hotel, and two days of remote work.
      </div>

      <div className="mt-4 rounded-[1.7rem] rounded-tl-md bg-white/10 p-5 text-sm leading-6 text-white/90">
        <p className="font-bold text-white">Done. Here&apos;s your trip stack:</p>
        {[
          "Day-by-day itinerary with morning, afternoon and evening plans",
          "Visa check for your passport and where you live",
          "Remote-work blocks placed between activity days",
          "Saved to your dashboard, ready to refine",
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
            Route
          </div>
          <p className="mt-2 font-bold text-white">Dubai → Bodrum → Istanbul</p>
        </div>
        <div className="rounded-[1.35rem] bg-white/[0.08] p-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-white/55">
            <Stars className="h-3.5 w-3.5" />
            Style
          </div>
          <p className="mt-2 font-bold text-white">Quiet luxury, local food spots</p>
        </div>
      </div>

      <div className="mt-6 flex w-full items-center justify-between rounded-full border border-white/15 bg-white/[0.06] px-4 py-3 text-left text-sm text-white/70">
        Ask for the next itinerary
        <ArrowRight className="h-4 w-4" />
      </div>
    </div>
  );
}
