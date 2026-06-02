"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { Logo } from "@/components/logo";
import {
  GeneratedItinerary,
  getSignedInAccount,
  saveGeneratedItinerary,
  saveTripDraft,
} from "@/lib/local-auth";

export default function Concierge() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [itinerary, setItinerary] = useState<GeneratedItinerary | null>(null);
  const [error, setError] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (!getSignedInAccount()) {
        router.replace("/signin");
        return;
      }

      setReady(true);
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [router]);

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
      const result = (await response.json()) as GeneratedItinerary | { error: string };

      if (!response.ok || "error" in result) {
        setError("error" in result ? result.error : "The concierge could not generate an itinerary.");
        setIsGenerating(false);
        return;
      }

      const generatedItinerary = result;
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

      <section className="mx-auto max-w-3xl px-5 pt-14 text-center lg:px-8">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f2e7d9] text-clay">
          <Sparkles className="h-6 w-6" />
        </span>
        <p className="mt-7 text-xs font-semibold uppercase tracking-[0.28em] text-clay">
          AI concierge
        </p>
        <h1 className="mt-4 font-display text-6xl leading-[0.94] tracking-tight text-ink">
          Describe the trip in your own words.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted">
          Keep it loose. Mention timing, mood, budget, passport, or one thing the trip must include.
        </p>
        {itinerary ? (
          <div className="glass-panel hero-shadow mt-9 rounded-[2rem] border border-black/10 p-6 text-left md:p-8">
            <div className="flex items-start gap-4">
              <CheckCircle2 className="mt-1 h-6 w-6 shrink-0 text-[#305247]" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#53786b]">
                  Concierge itinerary generated
                </p>
                <h2 className="mt-2 font-display text-4xl text-ink">{itinerary.destination}</h2>
                <p className="mt-3 text-sm leading-7 text-muted">{itinerary.summary}</p>
              </div>
            </div>
            <div className="mt-7 space-y-3">
              {itinerary.days.map((day) => (
                <div key={day.day} className="rounded-[1.35rem] border border-black/10 bg-white/70 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-clay">Day {day.day}</p>
                  <h3 className="mt-2 font-semibold text-ink">{day.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{day.plan}</p>
                </div>
              ))}
            </div>
            <Link
              className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink px-6 text-sm font-semibold text-white"
              href="/dashboard"
            >
              Save and return to dashboard <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
        <form className="glass-panel hero-shadow mt-9 rounded-[2rem] border border-black/10 p-5 md:p-7" onSubmit={handleSubmit}>
          <textarea
            className="field min-h-48 resize-y text-base leading-7"
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="Try: I want a relaxed 5-day anniversary trip in September with a design hotel, good food, and a direct flight from Dubai..."
            required
            value={prompt}
          />
          <button
            className="mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink px-6 text-sm font-semibold text-white shadow-[0_18px_48px_rgba(32,25,20,0.22)] disabled:cursor-wait disabled:opacity-60"
            disabled={isGenerating}
            type="submit"
          >
            {isGenerating ? "Planning your itinerary..." : "Generate itinerary"} <ArrowRight className="h-4 w-4" />
          </button>
          {error && <p className="mt-4 text-left text-sm leading-6 text-red-700">{error}</p>}
        </form>
        )}
        <p className="mt-5 text-xs leading-5 text-muted">
          The concierge uses a language model to create a destination-specific itinerary from your prompt.
        </p>
      </section>
    </main>
  );
}
