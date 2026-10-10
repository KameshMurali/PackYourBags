import Link from "next/link";
import { ArrowLeft, Globe2, Plane } from "lucide-react";
import { LoopVideo } from "@/components/loop-video";
import { Logo } from "@/components/logo";

// A passport stamp that thumps down once beside the headline. Decorative.
function DepartureStamp() {
  return (
    <svg
      viewBox="0 0 200 200"
      aria-hidden
      className="visa-stamp pointer-events-none absolute right-14 top-32 hidden h-44 w-44 text-sun opacity-90 lg:block"
    >
      <defs>
        <path id="visa-stamp-ring" d="M100 100 m-70 0 a70 70 0 1 1 140 0 a70 70 0 1 1 -140 0" />
      </defs>
      <circle cx="100" cy="100" r="94" fill="none" stroke="currentColor" strokeWidth="3" />
      <circle cx="100" cy="100" r="86" fill="none" stroke="currentColor" strokeWidth="1" />
      <circle cx="100" cy="100" r="52" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 4" />
      <text
        fill="currentColor"
        fontSize="12"
        fontWeight="800"
        letterSpacing="2.2"
        style={{ fontFamily: "var(--font-sans), sans-serif" }}
      >
        <textPath href="#visa-stamp-ring">PACKYOURBAGS · VISA EXPLORER · OFFICIAL SOURCES ·</textPath>
      </text>
      <Plane x={78} y={68} width={44} height={44} strokeWidth={1.6} />
      <text
        x="100"
        y="134"
        textAnchor="middle"
        fill="currentColor"
        fontSize="10"
        fontWeight="800"
        letterSpacing="2.4"
        style={{ fontFamily: "var(--font-sans), sans-serif" }}
      >
        DEPARTURE
      </text>
    </svg>
  );
}

// Rounded golden-hour banner in the landing page's style: looping lagoon video (poster only
// for reduced motion / Data Saver), a dark gradient for legibility, and the page headline.
// The controls card in the explorer overlaps its bottom edge.
export function VisaHero() {
  return (
    <div className="mx-auto max-w-7xl px-3 pt-3 sm:px-5 lg:px-8">
      <div className="relative isolate overflow-hidden rounded-[2rem] bg-night text-white sm:rounded-[2.5rem]">
        <LoopVideo
          src="/media/hero.mp4"
          poster="/media/hero.jpg"
          sizes="(min-width: 1280px) 1216px, 100vw"
          priority
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,34,51,0.72)_0%,rgba(10,34,51,0.4)_36%,rgba(10,34,51,0.92)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_12%_70%,rgba(10,34,51,0.75),transparent_62%)]" />

        <header className="relative flex items-center justify-between gap-4 px-5 pt-5 sm:px-8 sm:pt-7">
          <Logo tone="light" className="[&>span:last-child]:text-[1.15rem] sm:[&>span:last-child]:text-[1.35rem]" />
          <Link
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/20 sm:gap-2 sm:px-4 sm:py-2"
            href="/dashboard"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            <span>
              <span className="hidden sm:inline">Back to </span>dashboard
            </span>
          </Link>
        </header>

        <DepartureStamp />

        <section className="relative px-5 pb-32 pt-14 sm:px-8 sm:pb-36 sm:pt-20 lg:pb-40 lg:pt-24">
          <p className="animate-rise-in inline-flex items-center gap-2.5 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] backdrop-blur-md">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sun opacity-75 motion-reduce:hidden" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-sun" />
            </span>
            <Globe2 className="h-4 w-4" aria-hidden />
            Visa intelligence
          </p>
          <h1
            className="animate-rise-in display-balance mt-6 max-w-3xl font-display text-[clamp(3.1rem,10vw,6.75rem)] font-extrabold leading-[0.92] tracking-[-0.04em]"
            style={{ animationDelay: "120ms" }}
          >
            Where can you{" "}
            <span className="font-serif font-normal italic tracking-[-0.02em] text-sun">go</span>?
          </h1>
          <p
            className="animate-rise-in mt-6 max-w-xl text-base font-medium leading-7 text-white/90 sm:text-lg sm:leading-8"
            style={{ animationDelay: "260ms" }}
          >
            Start with destinations you can actually reach. Pick your passport and residence, add any
            visas you already hold, and see what opens up.
          </p>
        </section>
      </div>
    </div>
  );
}
