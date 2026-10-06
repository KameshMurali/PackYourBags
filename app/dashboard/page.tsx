"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Compass,
  Globe2,
  LogOut,
  MapPinned,
  PlaneTakeoff,
  Plug,
  Plus,
  Shield,
  Sparkles,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { ItineraryTimeline } from "@/components/itinerary";
import {
  getLatestGeneratedItinerary,
  getLatestTripDraft,
  GeneratedItinerary,
  TripDraft,
} from "@/lib/local-auth";

const recommendations = [
  ["Georgia", "No visa", "Mountain stays and old-city weekends"],
  ["Japan", "eVisa path", "Design hotels and late-summer food"],
  ["Morocco", "No visa", "Warm evenings and riad shortlists"],
];

function getGreeting() {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return "Good morning";
  }

  if (hour >= 12 && hour < 18) {
    return "Good afternoon";
  }

  return "Good evening";
}

export default function Dashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [latestTrip, setLatestTrip] = useState<TripDraft | null>(null);
  const [itinerary, setItinerary] = useState<GeneratedItinerary | null>(null);

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (status === "unauthenticated") {
      router.replace("/signin");
      return;
    }

    // Trips & itineraries continue to live in this browser's localStorage.
    // Deferred so setState isn't called synchronously inside the effect body.
    const timeout = window.setTimeout(() => {
      setLatestTrip(getLatestTripDraft());
      setItinerary(getLatestGeneratedItinerary());
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [status, router]);

  function handleSignOut() {
    signOut({ callbackUrl: "/" });
  }

  const user = session?.user;

  if (status !== "authenticated" || !user) {
    return <main className="min-h-screen" />;
  }

  const displayName = user.name?.trim() || user.email || "Traveller";
  const firstName = displayName.split(" ")[0];
  const isAdmin = user.role === "admin";

  return (
    <main className="min-h-screen pb-12">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-6 lg:px-8">
        <Logo />
        <div className="flex items-center gap-3">
          <nav className="mr-1 hidden items-center gap-1 md:flex">
            <Link
              href="/visa"
              className="inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold text-ink/70 transition hover:bg-white/60 hover:text-ink"
            >
              <Globe2 className="h-4 w-4" />
              Visas
            </Link>
            <Link
              href="/connect"
              className="inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold text-ink/70 transition hover:bg-white/60 hover:text-ink"
            >
              <Plug className="h-4 w-4" />
              Connect
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                className="inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold text-ink/70 transition hover:bg-white/60 hover:text-ink"
              >
                <Shield className="h-4 w-4" />
                Admin
              </Link>
            )}
          </nav>
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-ink">{displayName}</p>
            <p className="text-xs text-muted">{user.email}</p>
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
              {getGreeting()}, {firstName}.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
              {latestTrip
                ? `Your ${latestTrip.destination || "next escape"} plan is taking shape. Start a fresh idea or keep refining the brief.`
                : "Your next escape starts here. Capture a trip brief or ask the concierge for ideas."}
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

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Link
            href="/visa"
            className="group glass-panel flex items-center justify-between gap-4 rounded-[1.7rem] border border-black/10 p-5 transition hover:-translate-y-0.5 hover:border-clay/40 hover:bg-white"
          >
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f2e7d9] text-clay">
                <Globe2 className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold text-ink">Visa intelligence</p>
                <p className="mt-1 text-sm text-muted">Where can you go, visa-free?</p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-muted transition group-hover:translate-x-0.5 group-hover:text-ink" />
          </Link>
          <Link
            href="/connect"
            className="group glass-panel flex items-center justify-between gap-4 rounded-[1.7rem] border border-black/10 p-5 transition hover:-translate-y-0.5 hover:border-clay/40 hover:bg-white"
          >
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f2e7d9] text-clay">
                <Plug className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold text-ink">Connect ChatGPT or Claude</p>
                <p className="mt-1 text-sm text-muted">Plan in chat, keep it here</p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-muted transition group-hover:translate-x-0.5 group-hover:text-ink" />
          </Link>
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
                  <p className="mt-3 text-sm font-semibold text-[#305247]">
                    {itinerary ? "Next: refine or regenerate the plan." : "Next: turn this into a day-by-day plan."}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 flex-col gap-2 sm:items-end">
                <button
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#305247] px-5 text-sm font-semibold text-white"
                  onClick={() => router.push("/concierge?from=brief")}
                  type="button"
                >
                  Generate itinerary <Sparkles className="h-4 w-4" />
                </button>
                <div className="flex gap-2">
                  <button
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#b7d4c8] bg-white/70 px-4 text-sm font-semibold text-[#305247] transition hover:bg-white"
                    onClick={() => router.push("/visa")}
                    type="button"
                  >
                    <Globe2 className="h-4 w-4" />
                    Check visas
                  </button>
                  <button
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#b7d4c8] bg-white/70 px-4 text-sm font-semibold text-[#305247] transition hover:bg-white"
                    onClick={() => router.push("/trips/new")}
                    type="button"
                  >
                    Edit brief
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {itinerary && (
          <section className="mt-5 rounded-[2rem] border border-black/10 bg-white/70 p-6 backdrop-blur md:p-7">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clay">
                  Generated itinerary
                </p>
                <h2 className="mt-2 font-display text-3xl text-ink">{itinerary.destination}</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">{itinerary.summary}</p>
              </div>
              <div className="flex shrink-0 flex-col gap-2 sm:items-end">
                <button
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-white"
                  onClick={() => router.push("/concierge?view=latest")}
                  type="button"
                >
                  View full itinerary <ArrowRight className="h-4 w-4" />
                </button>
                <button
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-5 text-sm font-semibold text-ink"
                  onClick={() => router.push("/concierge")}
                  type="button"
                >
                  Generate another <Sparkles className="h-4 w-4 text-clay" />
                </button>
              </div>
            </div>
            <div className="mt-6">
              <ItineraryTimeline days={itinerary.days.slice(0, 3)} />
            </div>
            {itinerary.days.length > 3 && (
              <button
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-clay transition hover:text-ink"
                onClick={() => router.push("/concierge?view=latest")}
                type="button"
              >
                +{itinerary.days.length - 3} more {itinerary.days.length - 3 === 1 ? "day" : "days"} in the full itinerary
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </section>
        )}

        <div className={`mt-5 grid gap-5 ${itinerary ? "" : "lg:grid-cols-[1.08fr_0.92fr]"}`}>
          {!itinerary && (
            <section className="story-shadow overflow-hidden rounded-[2rem] border border-black/10 bg-[#201914] p-7 text-white md:p-8">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="text-sm text-white/55">Sample plan</p>
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
              <button
                className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[#e5c39a]"
                onClick={() => router.push("/concierge")}
                type="button"
              >
                Plan something like this <ArrowRight className="h-4 w-4" />
              </button>
            </section>
          )}

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
            <Link
              href="/visa"
              className="hidden shrink-0 items-center gap-2 rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm font-semibold text-ink transition hover:bg-white sm:inline-flex"
            >
              <Globe2 className="h-4 w-4 text-clay" />
              Open visa explorer
            </Link>
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {recommendations.map(([place, visa, detail]) => (
              <Link
                href="/visa"
                key={place}
                className="group rounded-[1.45rem] border border-black/10 bg-white/70 p-5 transition hover:-translate-y-0.5 hover:border-clay/40 hover:bg-white"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="font-semibold text-ink">{place}</p>
                  <span className="rounded-full bg-[#f2e7d9] px-3 py-1 text-xs font-semibold text-ink">{visa}</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted">{detail}</p>
              </Link>
            ))}
          </div>
          <Link
            href="/visa"
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-clay transition hover:text-ink sm:hidden"
          >
            Open visa explorer <ArrowRight className="h-4 w-4" />
          </Link>
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
