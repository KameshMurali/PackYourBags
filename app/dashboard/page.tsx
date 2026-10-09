"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
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
import { DATASETS, resolveDestinations } from "@/lib/visa";
import type { UsageInfo } from "@/lib/plan";
import {
  getLatestGeneratedItinerary,
  getLatestTripDraft,
  GeneratedItinerary,
  TripDraft,
} from "@/lib/local-auth";

// Real, verified rules: an Indian passport with UAE residence (the explorer's default).
// Computed once at module load; the visa explorer lets people change both.
const verifiedRules = Object.values(DATASETS).reduce((total, rules) => total + rules.length, 0);
const easyPicks = resolveDestinations("IN", ["AE"], { residence: "AE" })
  .filter((d) => d.effective === "visa-free" && d.code !== "AE")
  .slice(0, 3);

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
  const [usage, setUsage] = useState<UsageInfo | null>(null);

  useEffect(() => {
    if (status !== "authenticated") {
      return;
    }
    fetch("/api/usage")
      .then((res) => (res.ok ? (res.json() as Promise<UsageInfo>) : null))
      .then((info) => setUsage(info))
      .catch(() => setUsage(null));
  }, [status]);

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
            <p className="flex items-center justify-end gap-2 text-sm font-semibold text-ink">
              {isAdmin && (
                <span className="rounded-full bg-sunset px-2.5 py-0.5 text-[0.65rem] font-extrabold uppercase tracking-wider text-night">
                  Admin
                </span>
              )}
              {displayName}
            </p>
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

      <nav aria-label="Main" className="mx-auto -mt-2 flex max-w-7xl gap-2 overflow-x-auto px-5 pb-3 md:hidden">
        {[
          { href: "/visa", label: "Visas", icon: Globe2, show: true },
          { href: "/connect", label: "Connect", icon: Plug, show: true },
          { href: "/admin", label: "Admin", icon: Shield, show: isAdmin },
        ]
          .filter((item) => item.show)
          .map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="inline-flex h-10 shrink-0 items-center gap-2 rounded-full border border-ink/10 bg-white px-4 text-sm font-bold text-ink transition active:scale-[0.97]"
            >
              <Icon className="h-4 w-4 text-clay" />
              {label}
            </Link>
          ))}
      </nav>

      <section className="mx-auto max-w-7xl px-5 pt-4 lg:px-8">
        <div className="relative isolate overflow-hidden rounded-[2.2rem] bg-night text-white shadow-[0_30px_80px_rgba(10,34,51,0.25)]">
          <Image
            src="/media/hero.jpg"
            alt=""
            fill
            sizes="(min-width: 1280px) 1216px, 100vw"
            className="-z-10 object-cover"
            priority
          />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgba(10,34,51,0.9)_0%,rgba(10,34,51,0.55)_55%,rgba(10,34,51,0.2)_100%)]" />
          <div className="grid items-end gap-8 p-7 md:p-10 lg:grid-cols-[1fr_auto] lg:p-12">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.28em] text-sun">Your travel workspace</p>
              <h1 className="mt-4 max-w-3xl font-display text-5xl font-extrabold leading-[0.95] tracking-tight md:text-7xl">
                {getGreeting()},{" "}
                <span className="font-serif font-normal italic text-sun">{firstName}.</span>
              </h1>
              <p className="mt-5 max-w-xl text-lg font-medium leading-8 text-white/85">
                {latestTrip
                  ? `Your ${latestTrip.destination || "next escape"} brief is ready. Turn it into a day-by-day plan, or start something new.`
                  : "Where to next? Check where your passport goes, or ask the concierge to sketch a trip."}
              </p>
            </div>
            <button
              className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-coral px-8 text-base font-bold text-night shadow-[0_14px_36px_rgba(255,107,74,0.5)] transition hover:-translate-y-0.5 hover:bg-[#ff7d5f] active:scale-[0.98]"
              onClick={() => router.push("/trips/new")}
              type="button"
            >
              <Plus className="h-5 w-5" />
              Plan a new trip
            </button>
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <Stat
            icon={Globe2}
            label="Visa rules at hand"
            value={`${verifiedRules}`}
            detail="Each linked to its official source"
          />
          <Stat
            icon={MapPinned}
            label="Saved trip brief"
            value={latestTrip?.destination || "None yet"}
            detail={latestTrip ? `${latestTrip.dates} · ${latestTrip.travellers}` : "Takes a minute to start one"}
          />
          <Stat
            icon={Sparkles}
            label="AI itineraries"
            value={usage ? (usage.remaining === null ? "Unlimited" : `${usage.remaining} left`) : "…"}
            detail={usage ? (usage.plan === "pro" ? "Pro plan" : `${usage.used} of ${usage.limit} free used`) : "Checking your plan"}
          />
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Link
            href="/visa"
            className="group glass-panel flex items-center justify-between gap-4 rounded-[1.7rem] border border-black/10 p-5 transition hover:-translate-y-0.5 hover:border-clay/40 hover:bg-white"
          >
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fde8d3] text-clay">
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
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fde8d3] text-clay">
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
                <span className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[#0a4d5c]">
                  <CheckCircle2 className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#2b7a85]">
                    Latest saved brief
                  </p>
                  <h2 className="mt-2 font-display text-3xl text-ink">
                    {latestTrip.destination || "Your next escape"}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    {latestTrip.dates} · {latestTrip.travellers} · {latestTrip.mood}
                  </p>
                  <p className="mt-3 text-sm font-semibold text-[#0a4d5c]">
                    {itinerary ? "Next: refine or regenerate the plan." : "Next: turn this into a day-by-day plan."}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 flex-col gap-2 sm:items-end">
                <button
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#0a4d5c] px-5 text-sm font-semibold text-white"
                  onClick={() => router.push("/concierge?from=brief")}
                  type="button"
                >
                  Generate itinerary <Sparkles className="h-4 w-4" />
                </button>
                <div className="flex gap-2">
                  <button
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#b7d4c8] bg-white/70 px-4 text-sm font-semibold text-[#0a4d5c] transition hover:bg-white"
                    onClick={() => router.push("/visa")}
                    type="button"
                  >
                    <Globe2 className="h-4 w-4" />
                    Check visas
                  </button>
                  <button
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[#b7d4c8] bg-white/70 px-4 text-sm font-semibold text-[#0a4d5c] transition hover:bg-white"
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
            <section className="story-shadow relative isolate overflow-hidden rounded-[2rem] bg-night p-7 text-white md:p-8">
              <Image
                src="/media/today.jpg"
                alt=""
                fill
                sizes="(min-width: 1024px) 640px, 100vw"
                className="-z-10 object-cover"
              />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-night/90 via-night/55 to-night/20" />
              <div className="flex min-h-[18rem] flex-col justify-end">
                <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-sun">No itinerary yet</p>
                <h2 className="mt-2 font-display text-4xl font-extrabold leading-tight">
                  Your first plan is a sentence away.
                </h2>
                <p className="mt-3 max-w-md text-sm leading-7 text-white/80">
                  Tell the concierge the mood, dates and budget. You&apos;ll get a morning-to-evening plan for every day.
                </p>
                <button
                  className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-coral px-6 py-3 text-sm font-bold text-night transition hover:bg-[#ff7d5f]"
                  onClick={() => router.push("/concierge")}
                  type="button"
                >
                  Plan something like this <ArrowRight className="h-4 w-4" />
                </button>
              </div>
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
              <p className="text-sm font-semibold text-muted">Visa-free from where you live</p>
              <h2 className="mt-2 font-display text-3xl text-ink">Easy places for your next escape</h2>
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
            {easyPicks.map((d) => (
              <Link
                href="/visa"
                key={d.code}
                className="group rounded-[1.45rem] border border-ink/10 bg-white p-5 transition hover:-translate-y-0.5 hover:border-coral hover:shadow-[0_14px_36px_rgba(10,34,51,0.12)]"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="flex items-center gap-2.5 font-display text-lg font-bold text-ink">
                    <span className="text-2xl leading-none">{d.flag}</span>
                    {d.name}
                  </p>
                  <span className="rounded-full bg-lagoon px-3 py-1 text-xs font-bold text-white">
                    {d.effectiveDays ? `No visa · ${d.effectiveDays}d` : "No visa"}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-muted">{d.region}</p>
              </Link>
            ))}
          </div>
          <p className="mt-4 text-xs leading-5 text-muted">
            Based on an Indian passport with UAE residence. Change both in the visa explorer.
          </p>
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
