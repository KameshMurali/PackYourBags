import type { Metadata } from "next";
import { Suspense } from "react";
import { VisaBackdrop } from "@/components/visa-backdrop";
import { VisaHero } from "@/components/visa-hero";
import { VisaExplorer } from "./visa-explorer";

export const metadata: Metadata = {
  title: "Visa explorer",
  description:
    "See where your passport, residence and visas let you travel, with source-linked visa rules and the date each was last reviewed.",
};

// Same footprint as the controls card (including its overlap with the banner), so the page
// doesn't jump when the explorer hydrates.
function ExplorerFallback() {
  return (
    <div aria-busy="true" className="relative z-10 -mt-24 sm:-mt-28">
      <p className="sr-only">Loading the visa explorer…</p>
      <div
        className="hero-shadow h-72 animate-pulse rounded-[2rem] border border-black/10 bg-white/80 motion-reduce:animate-none"
        aria-hidden
      />
    </div>
  );
}

export default function VisaPage() {
  return (
    <main className="relative min-h-screen overflow-x-clip pb-20">
      <VisaBackdrop />

      <div className="relative z-10">
        <VisaHero />

        <section className="mx-auto max-w-7xl px-5 lg:px-8">
          <Suspense fallback={<ExplorerFallback />}>
            <VisaExplorer />
          </Suspense>
        </section>
      </div>
    </main>
  );
}
