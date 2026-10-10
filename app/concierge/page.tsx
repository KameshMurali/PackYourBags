"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowLeft, ArrowRight, CalendarDays, CheckCircle2, Lock, MapPin, Sparkles } from "lucide-react";
import { Logo } from "@/components/logo";
import { ItineraryTimeline } from "@/components/itinerary";
import {
  GeneratedItinerary,
  getLatestGeneratedItinerary,
  getLatestTripDraft,
  saveGeneratedItinerary,
  saveTripDraft,
  TripDraft,
} from "@/lib/local-auth";
import { UsageInfo } from "@/lib/plan";

const MAX_PROMPT_LENGTH = 2000;

function promptFromDraft(draft: TripDraft) {
  return [
    draft.destination && `Destination: ${draft.destination}`,
    draft.dates && `Timing: ${draft.dates}`,
    draft.travellers && `Travellers: ${draft.travellers}`,
    draft.mood && `Mood: ${draft.mood}`,
    draft.notes && `Notes: ${draft.notes}`,
  ]
    .filter(Boolean)
    .join("\n");
}

export default function Concierge() {
  const router = useRouter();
  const { status } = useSession();
  const [ready, setReady] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [itinerary, setItinerary] = useState<GeneratedItinerary | null>(null);
  const [usage, setUsage] = useState<UsageInfo | null>(null);
  const [error, setError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (status === "unauthenticated") {
      router.replace("/signin");
      return;
    }

    // Deferred so setState isn't called synchronously inside the effect body.
    const timeout = window.setTimeout(() => {
      const params = new URLSearchParams(window.location.search);

      if (params.get("view") === "latest") {
        setItinerary(getLatestGeneratedItinerary());
      } else if (params.get("from") === "brief") {
        const draft = getLatestTripDraft();

        if (draft) {
          setPrompt(promptFromDraft(draft).slice(0, MAX_PROMPT_LENGTH));
        }
      }

      fetch("/api/usage")
        .then((response) => (response.ok ? (response.json() as Promise<UsageInfo>) : null))
        .then((info) => info && setUsage(info))
        .catch(() => {});

      setReady(true);
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [status, router]);

  function handleStartOver() {
    setItinerary(null);
    setPrompt("");
    setError("");
  }

  async function handleUpgrade() {
    setError("");
    setIsUpgrading(true);

    try {
      const response = await fetch("/api/subscribe", { method: "POST" });

      if (!response.ok) {
        throw new Error("request failed");
      }

      setUsage((await response.json()) as UsageInfo);
    } catch {
      setError("Could not send your request. Please try again.");
    } finally {
      setIsUpgrading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsGenerating(true);

    try {
      const response = await fetch("/api/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });
      const result = (await response.json()) as
        | { itinerary: GeneratedItinerary; usage: UsageInfo }
        | { error: string; upgradeRequired?: boolean; usage?: UsageInfo };

      if (!response.ok || "error" in result) {
        if ("usage" in result && result.usage) {
          setUsage(result.usage);
        }

        setError("error" in result ? result.error : "The concierge could not generate an itinerary.");
        setIsGenerating(false);
        return;
      }

      setUsage(result.usage);
      const generatedItinerary = result.itinerary;
      saveTripDraft({
        destination: generatedItinerary.destination,
        dates: "Timing to refine",
        travellers: "Traveller details to refine",
        mood: "Concierge brief",
        notes: prompt.trim(),
      });
      saveGeneratedItinerary(generatedItinerary);
      setItinerary(generatedItinerary);
    } catch {
      setError("The concierge could not reach the model service. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }

  const outOfFreeGenerations = usage?.plan === "starter" && usage.remaining === 0;

  if (!ready) {
    return <main className="min-h-screen" />;
  }

  return (
    <main className="min-h-screen pb-12">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-5 py-6 lg:px-8">
        <Logo />
        <Link
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted transition hover:text-ink"
          href="/dashboard"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>
      </header>

      <section
        className={`mx-auto px-5 pt-14 text-center lg:px-8 ${itinerary ? "max-w-4xl" : "max-w-3xl"}`}
      >
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#fde8d3] text-clay">
          <Sparkles className="h-6 w-6" />
        </span>
        <p className="mt-7 text-xs font-semibold uppercase tracking-[0.28em] text-clay">
          AI concierge
        </p>
        <h1 className="mt-4 font-display text-6xl leading-[0.94] tracking-tight text-ink">
          {itinerary ? "Your itinerary is ready." : "Describe the trip in your own words."}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted">
          {itinerary
            ? "Review the day-by-day plan, save it to your dashboard, or start a fresh brief."
            : "Keep it loose. Mention timing, mood, budget, passport, or one thing the trip must include."}
        </p>
        {usage && (
          <p className="mx-auto mt-5 inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm font-semibold text-ink">
            <Sparkles className="h-4 w-4 text-clay" />
            {usage.plan === "pro"
              ? "Pro plan · Unlimited itineraries"
              : `Starter plan · ${usage.remaining} of ${usage.limit} free itineraries left`}
          </p>
        )}
        {itinerary ? (
          <div className="glass-panel hero-shadow mt-9 overflow-hidden rounded-[2rem] border border-black/10 text-left">
            <div className="relative overflow-hidden border-b border-black/10 bg-gradient-to-br from-[#fde8d3] via-[#fff8ee] to-[#eaf2ed] p-6 md:p-9">
              <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-[#ffd9b8] opacity-50 blur-3xl" />
              <div className="relative">
                <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#2b7a85]">
                  <CheckCircle2 className="h-4 w-4 text-[#0a4d5c]" />
                  Concierge itinerary
                </p>
                <h2 className="mt-3 font-display text-4xl leading-[0.96] tracking-tight text-ink md:text-5xl">
                  {itinerary.destination}
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-7 text-muted">{itinerary.summary}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white/70 px-3 py-1.5 text-xs font-semibold text-ink">
                    <CalendarDays className="h-3.5 w-3.5 text-clay" />
                    {itinerary.days.length} {itinerary.days.length === 1 ? "day" : "days"}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white/70 px-3 py-1.5 text-xs font-semibold text-ink">
                    <MapPin className="h-3.5 w-3.5 text-clay" />
                    {itinerary.destination}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white/70 px-3 py-1.5 text-xs font-semibold text-ink">
                    <Sparkles className="h-3.5 w-3.5 text-clay" />
                    Day-by-day plan
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-9">
              <ItineraryTimeline days={itinerary.days} />
            </div>

            <div className="border-t border-black/10 bg-white/40 p-6 md:px-9">
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-ink px-6 text-sm font-semibold text-white shadow-[0_18px_48px_rgba(10,34,51,0.22)] transition hover:-translate-y-0.5 hover:bg-[#0a2233]"
                  href="/dashboard"
                >
                  Save and return to dashboard <ArrowRight className="h-4 w-4" />
                </Link>
                <button
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-black/10 bg-white/70 px-6 text-sm font-semibold text-ink transition hover:bg-white"
                  onClick={handleStartOver}
                  type="button"
                >
                  Plan another trip <Sparkles className="h-4 w-4 text-clay" />
                </button>
              </div>
            </div>
          </div>
        ) : outOfFreeGenerations ? (
          <div className="glass-panel hero-shadow mt-9 rounded-[2rem] border border-black/10 p-6 text-left md:p-8">
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#fde8d3] text-clay">
                <Lock className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-display text-3xl text-ink">
                  You have used all {usage?.limit} free itineraries.
                </h2>
                <p className="mt-3 text-sm leading-7 text-muted">
                  Pro gives you unlimited concierge itineraries, generated with Claude Sonnet.
                  Your saved trips and briefs stay exactly where they are.
                </p>
              </div>
            </div>
            <button
              className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink px-6 text-sm font-semibold text-white shadow-[0_18px_48px_rgba(10,34,51,0.22)] disabled:cursor-wait disabled:opacity-60"
              disabled={isUpgrading || Boolean(usage?.proRequested)}
              onClick={handleUpgrade}
              type="button"
            >
              {usage?.proRequested
                ? "Request sent"
                : isUpgrading
                  ? "Sending your request..."
                  : "Request Pro access"}{" "}
              <Sparkles className="h-4 w-4" />
            </button>
            {error && <p className="mt-4 text-sm leading-6 text-red-700">{error}</p>}
            <p className="mt-4 text-xs leading-5 text-muted">
              {usage?.proRequested
                ? "Thanks. Pro is approved by hand for now, and your request is waiting in the admin's queue. Check back soon."
                : "Pro is approved by hand for now. Send a request and it goes straight to the admin."}
            </p>
          </div>
        ) : (
        <form className="glass-panel hero-shadow mt-9 rounded-[2rem] border border-black/10 p-5 md:p-7" onSubmit={handleSubmit}>
          <textarea
            aria-label="Describe the trip you want to plan"
            className="field min-h-48 resize-y text-base leading-7"
            maxLength={MAX_PROMPT_LENGTH}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="Try: I want a relaxed 5-day anniversary trip in September with a design hotel, good food, and a direct flight from Dubai..."
            required
            value={prompt}
          />
          <button
            className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink px-6 text-sm font-semibold text-white shadow-[0_18px_48px_rgba(10,34,51,0.22)] disabled:cursor-wait disabled:opacity-60"
            disabled={isGenerating}
            type="submit"
          >
            {isGenerating ? "Planning your itinerary..." : "Generate itinerary"} <ArrowRight className="h-4 w-4" />
          </button>
          {error && <p className="mt-4 text-left text-sm leading-6 text-red-700">{error}</p>}
        </form>
        )}
        <p className="mt-5 text-xs leading-5 text-muted">
          The concierge uses Claude Sonnet to create a destination-specific itinerary from your prompt.
          Starter accounts include {usage?.limit ?? 3} free itineraries.
        </p>
      </section>
    </main>
  );
}
