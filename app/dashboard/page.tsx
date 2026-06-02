"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Compass,
  LogOut,
  MapPinned,
  PlaneTakeoff,
  Plus,
  Sparkles,
} from "lucide-react";
import { Logo } from "@/components/logo";
import {
  getSignedInAccount,
  getLatestTripDraft,
  LocalAccount,
  signOutLocally,
  TripDraft,
} from "@/lib/local-auth";

const recommendations = [
  ["Georgia", "No visa", "Mountain stays and old-city weekends"],
  ["Japan", "eVisa path", "Design hotels and late-summer food"],
  ["Morocco", "No visa", "Warm evenings and riad shortlists"],
];

export default function Dashboard() {
  const router = useRouter();
  const [account, setAccount] = useState<LocalAccount | null>(null);
  const [latestTrip, setLatestTrip] = useState<TripDraft | null>(null);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const signedInAccount = getSignedInAccount();

      if (!signedInAccount) {
        router.replace("/signin");
        return;
      }

      setAccount(signedInAccount);
      setLatestTrip(getLatestTripDraft());
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [router]);

  function handleSignOut() {
    signOutLocally();
    router.push("/");
  }

  if (!account) {
    return <main className="min-h-screen" />;
  }

  return (
    <main className="min-h-screen pb-12">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-6 lg:px-8">
        <Logo />
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-ink">{account.name}</p>
            <p className="text-xs text-muted">{account.email}</p>
          </div>
          <button
            className="inline-flex h-11 items-center gap-2 rounded-full border border-black/10 bg-white/70 px-4 text-sm font-semibold text-ink transition hover:bg-white"
            onClick={handleSignOut}
            type="button"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 pt-8 lg:px-8">
        <div className="grid items-end gap-6 lg:grid-cols-[1fr_auto]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-clay">
              Your travel workspace
            </p>
            <h1 className="mt-4 max-w-3xl font-display text-5xl leading-[0.94] tracking-tight text-ink md:text-7xl">
              Good morning, {account.name.split(" ")[0]}.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
              Your next escape is taking shape. Start a fresh idea or keep polishing the Turkey route.
            </p>
          </div>
          <button
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ink px-6 text-sm font-semibold text-white shadow-[0_18px_48px_rgba(32,25,20,0.22)]"
            onClick={() => router.push("/trips/new")}
            type="button"
          >
            <Plus className="h-4 w-4" />
            Plan a new trip
          </button>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <Stat icon={CalendarDays} label="Leave available" value="18 days" detail="UAE office calendar synced" />
          <Stat icon={PlaneTakeoff} label="Trips planned" value={latestTrip ? "4 escapes" : "3 escapes"} detail={latestTrip ? "1 new brief saved" : "1 itinerary ready to book"} />
          <Stat icon={Compass} label="Shortlisted" value="12 places" detail="Filtered for your passport" />
        </div>

        {latestTrip && (
          <section className="mt-5 rounded-[2rem] border border-[#b7d4c8] bg-[#eff8f4]/90 p-6 shadow-[0_22px_70px_rgba(43,85,69,0.08)] md:p-7">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
              <div className="flex items-start gap-4">
                <span className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[#305247]">
                  <CheckCircle2 className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#53786b]">
                    Latest saved brief
                  </p>
                  <h2 className="mt-2 font-display text-3xl text-ink">
                    {latestTrip.destination || "Your next escape"}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    {latestTrip.dates} · {latestTrip.travellers} · {latestTrip.mood}
                  </p>
                </div>
              </div>
              <button
                className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-[#305247] px-5 text-sm font-semibold text-white"
                onClick={() => router.push("/trips/new")}
                type="button"
              >
                Edit brief <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </section>
        )}

        <div className="mt-5 grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">
          <section className="story-shadow overflow-hidden rounded-[2rem] border border-black/10 bg-[#201914] p-7 text-white md:p-8">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-sm text-white/55">Continue planning</p>
                <h2 className="mt-2 font-display text-4xl">Turkey anniversary escape</h2>
                <p className="mt-3 text-sm leading-7 text-white/65">
                  Dubai to Istanbul to Cappadocia. Five nights, a direct flight, and a slow final weekend.
                </p>
              </div>
              <MapPinned className="h-7 w-7 text-[#e5c39a]" />
            </div>
            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {[
                ["Flight", "Emirates direct"],
                ["Stay", "2 hotels saved"],
                ["Checklist", "7 of 10 ready"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-[1.35rem] border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/45">{label}</p>
                  <p className="mt-2 text-sm font-semibold">{value}</p>
                </div>
              ))}
            </div>
            <button className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#e5c39a]" type="button">
              Open itinerary <ArrowRight className="h-4 w-4" />
            </button>
          </section>

          <section className="glass-panel story-shadow rounded-[2rem] border border-black/10 p-7 md:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-muted">AI concierge</p>
                <h2 className="mt-2 font-display text-3xl text-ink">What kind of trip is on your mind?</h2>
              </div>
              <Sparkles className="h-6 w-6 text-clay" />
            </div>
            <p className="mt-4 text-sm leading-7 text-muted">
              Describe the mood, timing, and budget. PackYourBags will shape a visa-aware shortlist.
            </p>
            <button
              className="mt-7 flex w-full items-center justify-between rounded-full border border-black/10 bg-white/70 px-5 py-4 text-left text-sm font-semibold text-ink"
              onClick={() => router.push("/concierge")}
              type="button"
            >
              Ask AI to plan an escape <ArrowRight className="h-4 w-4" />
            </button>
          </section>
        </div>

        <section className="mt-5 rounded-[2rem] border border-black/10 bg-white/55 p-7 backdrop-blur md:p-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm text-muted">Visa-aware inspiration</p>
              <h2 className="mt-2 font-display text-3xl text-ink">Easy places for your next long weekend</h2>
            </div>
            <Compass className="hidden h-6 w-6 text-clay sm:block" />
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {recommendations.map(([place, visa, detail]) => (
              <div key={place} className="rounded-[1.45rem] border border-black/10 bg-white/70 p-5">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-semibold text-ink">{place}</p>
                  <span className="rounded-full bg-[#f2e7d9] px-3 py-1 text-xs font-semibold text-ink">{visa}</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted">{detail}</p>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: typeof CalendarDays;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="glass-panel rounded-[1.7rem] border border-black/10 p-5">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted">{label}</p>
        <Icon className="h-5 w-5 text-clay" />
      </div>
      <p className="mt-4 font-display text-4xl text-ink">{value}</p>
      <p className="mt-2 text-sm text-muted">{detail}</p>
    </div>
  );
}
