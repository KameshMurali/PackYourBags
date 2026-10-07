import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowLeft, Globe2 } from "lucide-react";
import { Logo } from "@/components/logo";
import { VisaExplorer } from "./visa-explorer";

export const metadata: Metadata = {
  title: "Visa explorer",
  description:
    "See where your passport, residence and visas let you travel, with source-linked visa rules and the date each was last reviewed.",
};

function ExplorerFallback() {
  return (
    <div aria-busy="true">
      <p className="sr-only">Loading the visa explorer…</p>
      <div
        className="glass-panel hero-shadow mt-9 h-72 animate-pulse rounded-[2rem] border border-black/10 motion-reduce:animate-none"
        aria-hidden
      />
    </div>
  );
}

export default function VisaPage() {
  return (
    <main className="min-h-screen pb-16">
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-6 lg:px-8">
        <Logo />
        <Link
          className="inline-flex shrink-0 items-center gap-2 rounded-sm text-sm font-semibold text-muted transition hover:text-ink"
          href="/dashboard"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          <span>
            <span className="hidden sm:inline">Back to </span>dashboard
          </span>
        </Link>
      </header>

      <section className="mx-auto max-w-6xl px-5 pt-8 lg:px-8">
        <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#8a4a24]">
          <Globe2 className="h-4 w-4" aria-hidden />
          Visa intelligence
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-5xl leading-[0.96] tracking-tight text-ink md:text-7xl">
          Where can you go?
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
          Start with destinations you can actually reach. Pick your passport and residence, add any
          visas you already hold, and see what opens up.
        </p>

        <Suspense fallback={<ExplorerFallback />}>
          <VisaExplorer />
        </Suspense>
      </section>
    </main>
  );
}
