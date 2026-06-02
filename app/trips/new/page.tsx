"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Sparkles } from "lucide-react";
import { Logo } from "@/components/logo";
import {
  getSignedInAccount,
  getLatestTripDraft,
  saveTripDraft,
  TripDraft,
} from "@/lib/local-auth";

export default function NewTrip() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [savedTrip, setSavedTrip] = useState<TripDraft | null>(null);
  const [draft, setDraft] = useState<TripDraft | null>(null);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (!getSignedInAccount()) {
        router.replace("/signin");
        return;
      }

      setDraft(getLatestTripDraft());
      setReady(true);
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [router]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const trip = {
      destination: String(formData.get("destination") ?? "").trim(),
      dates: String(formData.get("dates") ?? "").trim(),
      travellers: String(formData.get("travellers") ?? "").trim(),
      mood: String(formData.get("mood") ?? "").trim(),
      notes: String(formData.get("notes") ?? "").trim(),
    };

    saveTripDraft(trip);
    setSavedTrip(trip);
  }

  if (!ready) {
    return <main className="min-h-screen" />;
  }

  return (
    <main className="min-h-screen pb-12">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6 lg:px-8">
        <Logo />
        <Link
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted transition hover:text-ink"
          href="/dashboard"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>
      </header>

      <section className="mx-auto max-w-6xl px-5 pt-10 lg:px-8">
        {savedTrip ? (
          <div className="glass-panel hero-shadow mx-auto max-w-2xl rounded-[2.2rem] border border-black/10 p-8 text-center md:p-12">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#e2eee9] text-[#305247]">
              <Check className="h-6 w-6" />
            </span>
            <p className="mt-7 text-xs font-semibold uppercase tracking-[0.28em] text-clay">
              Trip brief saved
            </p>
            <h1 className="mt-4 font-display text-5xl leading-tight text-ink">
              Your {savedTrip.destination || "next escape"} draft is ready.
            </h1>
            <p className="mt-5 text-base leading-8 text-muted">
              We saved the brief in this browser. The next product step is generating itinerary options,
              visa guidance, and a booking checklist from it.
            </p>
            <Link
              className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ink px-6 text-sm font-semibold text-white"
              href="/dashboard"
            >
              Return to dashboard <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-clay">
                New trip brief
              </p>
              <h1 className="mt-5 font-display text-6xl leading-[0.93] tracking-tight text-ink">
                What kind of escape are you imagining?
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-muted">
                Give the concierge a few signals. This is enough to shape a thoughtful first draft.
              </p>
              <div className="mt-8 rounded-[1.8rem] border border-black/10 bg-[#201914] p-6 text-white">
                <Sparkles className="h-5 w-5 text-[#e5c39a]" />
                <p className="mt-4 font-display text-2xl">A good brief can be loose.</p>
                <p className="mt-3 text-sm leading-7 text-white/65">
                  Try: “A quiet anniversary trip in late September with direct flights and a design hotel.”
                </p>
              </div>
            </div>

            <form
              className="glass-panel hero-shadow rounded-[2rem] border border-black/10 p-6 md:p-8"
              onSubmit={handleSubmit}
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Destination or region">
                  <input className="field" defaultValue={draft?.destination} name="destination" placeholder="e.g. Japan or somewhere coastal" />
                </Field>
                <Field label="Timing">
                  <input className="field" defaultValue={draft?.dates} name="dates" placeholder="e.g. Late September, 5 nights" required />
                </Field>
                <Field label="Travellers">
                  <input className="field" defaultValue={draft?.travellers} name="travellers" placeholder="e.g. 2 adults" required />
                </Field>
                <Field label="Trip mood">
                  <select className="field" defaultValue={draft?.mood || ""} name="mood" required>
                    <option disabled value="">Choose a mood</option>
                    <option>Quiet luxury</option>
                    <option>Food and culture</option>
                    <option>Beach reset</option>
                    <option>Remote-work escape</option>
                    <option>Adventure</option>
                    <option>Concierge brief</option>
                  </select>
                </Field>
              </div>
              <Field label="Anything else the concierge should know?" className="mt-5">
                <textarea
                  className="field min-h-36 resize-y"
                  defaultValue={draft?.notes}
                  name="notes"
                  placeholder="Flight preferences, budget, hotel style, passport, pace, or one thing the trip must include."
                />
              </Field>
              <button
                className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink px-6 text-sm font-semibold text-white shadow-[0_18px_48px_rgba(32,25,20,0.22)]"
                type="submit"
              >
                Save trip brief <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        )}
      </section>
    </main>
  );
}

function Field({
  children,
  className = "",
  label,
}: {
  children: React.ReactNode;
  className?: string;
  label: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-sm font-semibold text-ink">{label}</span>
      {children}
    </label>
  );
}
