import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Luggage, Plane, Sparkles } from "lucide-react";
import { ButtonLink } from "@/components/button";
import { LoopVideo } from "@/components/loop-video";
import { Logo } from "@/components/logo";
import { MarqueeStrip } from "@/components/marquee-strip";
import { ChatCard, ConnectCard, VisaCard } from "@/components/mockups";
import { Reveal } from "@/components/reveal";
import { SiteHeader } from "@/components/site-header";
import { DayPlanCard } from "@/components/today-card";
import { COUNTRIES, DATASETS, resolveDestinations } from "@/lib/visa";

// Real numbers from the visa engine, so the page can't drift from the product.
const verifiedRules = Object.values(DATASETS).reduce((total, rules) => total + rules.length, 0);
const passports = Object.values(DATASETS).filter((rules) => rules.length > 0).length;

const visaFreeTicker = resolveDestinations("IN", ["AE"], { residence: "AE" })
  .filter((d) => d.effective === "visa-free" && d.code !== "AE")
  .slice(0, 14)
  .map((d) => ({
    flag: d.flag,
    name: d.name,
    detail: d.effectiveDays ? `${d.effectiveDays} days` : "No visa",
  }));

const steps = [
  {
    title: "Tell us who's travelling",
    text: "Pick your passport, where you live and the visas you hold. The visa answers update instantly.",
  },
  {
    title: "Describe the trip",
    text: "One sentence is enough. The concierge drafts a day-by-day itinerary around your mood and budget.",
  },
  {
    title: "Make it yours",
    text: "Tweak the brief, regenerate, or bring in a plan you already made in Claude or ChatGPT.",
  },
  {
    title: "Take it with you",
    text: "A clean morning-to-evening timeline that reads well on your phone, at the gate or in the taxi.",
  },
];

function Chapter({
  number,
  eyebrow,
  title,
  text,
  points,
  cta,
  media,
  card,
  reverse = false,
}: {
  number: string;
  eyebrow: string;
  title: React.ReactNode;
  text: string;
  points: string[];
  cta?: { href: string; label: string };
  media: React.ReactNode;
  card: React.ReactNode;
  reverse?: boolean;
}) {
  return (
    <section className="mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-24">
      <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
        <Reveal className={`lg:col-span-6 ${reverse ? "lg:order-2 lg:col-start-7" : ""}`}>
          <div className="relative pb-0 lg:pb-12">
            <div
              className={`relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-sand shadow-[0_30px_80px_rgba(10,34,51,0.25)] lg:max-w-[88%] ${
                reverse ? "lg:ml-auto" : ""
              }`}
            >
              {media}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night/45 via-transparent to-transparent" />
              <span className="absolute left-5 top-5 rounded-full bg-white/90 px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-[0.18em] text-night backdrop-blur">
                {eyebrow}
              </span>
            </div>
            <div
              className={`mt-6 w-full lg:absolute lg:bottom-0 lg:mt-0 lg:w-[62%] ${
                reverse ? "lg:left-0" : "lg:right-0"
              }`}
            >
              {card}
            </div>
          </div>
        </Reveal>

        <Reveal delay={120} className={`lg:col-span-5 ${reverse ? "lg:col-start-1 lg:row-start-1" : "lg:col-start-8"}`}>
          <p
            aria-hidden
            className="font-display text-[7rem] font-extrabold leading-none text-transparent [-webkit-text-stroke:2px_rgba(14,42,59,0.18)] md:text-[9rem]"
          >
            {number}
          </p>
          <h2 className="display-balance -mt-6 font-display text-4xl font-extrabold leading-[1.02] tracking-tight text-ink md:text-6xl">
            {title}
          </h2>
          <p className="mt-6 max-w-lg text-lg leading-8 text-muted">{text}</p>
          <ul className="mt-7 space-y-3">
            {points.map((point) => (
              <li key={point} className="flex items-start gap-3 text-[0.95rem] font-medium leading-6 text-ink/85">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-lagoon text-white">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </span>
                {point}
              </li>
            ))}
          </ul>
          {cta && (
            <Link
              href={cta.href}
              className="group mt-8 inline-flex items-center gap-2 rounded-full bg-night px-6 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-lagoon-deep"
            >
              {cta.label}
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
          )}
        </Reveal>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-clip">
      <SiteHeader />

      {/* Hero: full-bleed golden-hour video, headline anchored bottom-left */}
      <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-night text-white">
        <LoopVideo src="/media/hero.mp4" poster="/media/hero.jpg" alt="Aerial view of a turquoise lagoon at sunset" priority />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,34,51,0.62)_0%,rgba(10,34,51,0.1)_32%,rgba(10,34,51,0.82)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_15%_80%,rgba(10,34,51,0.7),transparent_60%)]" />

        <div className="relative mx-auto w-full max-w-7xl px-5 pb-16 pt-36 lg:px-8 lg:pb-24">
          <div className="animate-rise-in inline-flex items-center gap-2.5 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur-md">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sun opacity-75 motion-reduce:hidden" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-sun" />
            </span>
            {verifiedRules} visa rules checked against official sources
          </div>

          <h1
            className="animate-rise-in mt-7 max-w-5xl font-display text-[clamp(3.2rem,9.5vw,8.5rem)] font-extrabold leading-[0.9] tracking-[-0.045em]"
            style={{ animationDelay: "120ms" }}
          >
            Go somewhere.
            <br />
            We&apos;ll handle the{" "}
            <span className="font-serif font-normal italic tracking-[-0.02em] text-sun">paperwork.</span>
          </h1>

          <p
            className="animate-rise-in mt-7 max-w-xl text-lg font-medium leading-8 text-white/90 md:text-xl"
            style={{ animationDelay: "260ms" }}
          >
            Check which countries your passport opens up, turn a one-line idea into a day-by-day itinerary,
            and keep every plan in one place.
          </p>

          <div className="animate-rise-in mt-9 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: "380ms" }}>
            <ButtonLink href="/register" className="h-14 px-8 text-base">
              Plan my first trip
              <ArrowRight className="ml-2 h-5 w-5" />
            </ButtonLink>
            <ButtonLink href="/visa" variant="light" className="h-14 px-8 text-base">
              Where can my passport go?
            </ButtonLink>
          </div>
        </div>
      </section>

      <MarqueeStrip
        label={
          <>
            <span className="sm:hidden">Visa-free</span>
            <span className="hidden sm:inline">Visa-free for an Indian passport · UAE resident</span>
          </>
        }
        items={visaFreeTicker}
      />

      {/* Real numbers */}
      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8 lg:py-20">
        <Reveal>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
            {[
              [`${COUNTRIES.length}`, "countries and territories recognised, even by native name or a typo"],
              [`${verifiedRules}`, `visa rules for ${passports} passports, each linked to its official source`],
              ["3", "free AI itineraries, no card needed"],
              ["2", "assistants, Claude and ChatGPT, can save trips straight to you"],
            ].map(([figure, copy]) => (
              <div key={copy} className="border-t-4 border-coral pt-4">
                <dt className="font-display text-6xl font-extrabold leading-none tracking-tight text-ink md:text-7xl">
                  {figure}
                </dt>
                <dd className="mt-3 max-w-[16rem] text-sm font-medium leading-6 text-muted">{copy}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </section>

      <div id="chapters" className="scroll-mt-20">
        <Chapter
          number="01"
          eyebrow="Visa explorer"
          title={
            <>
              Start with where your passport <span className="font-serif font-normal italic text-clay">actually</span> goes.
            </>
          }
          text="Pick your passport, where you live and any visas you hold. See what's visa-free, what's an e-visa and what needs an embassy, each with the official source and the date we last checked it."
          points={[
            "Search any country, city or even a typo. “germny” works.",
            "Honest “not yet verified” answers instead of guesses.",
            "Step-by-step guides for Schengen, US and UK visas.",
          ]}
          cta={{ href: "/visa", label: "Open the visa explorer" }}
          media={
            <Image
              src="/media/visa.jpg"
              alt="A traveller holding a passport and boarding pass at an airport gate at sunset"
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="parallax-img object-cover"
            />
          }
          card={<VisaCard />}
        />

        <Chapter
          reverse
          number="02"
          eyebrow="AI concierge"
          title={
            <>
              Say the mood. Get the <span className="font-serif font-normal italic text-clay">whole</span> trip.
            </>
          }
          text="Describe the trip in a sentence: dates, vibe, budget. The concierge, powered by Claude Sonnet, drafts a day-by-day itinerary you can refine. The first three are on us."
          points={[
            "Morning, afternoon and evening plans for every day.",
            "Built around the passport and residence you set.",
            "No card needed to try it.",
          ]}
          cta={{ href: "/register", label: "Try the concierge free" }}
          media={
            <Image
              src="/media/concierge.jpg"
              alt="Tea and a phone on a rooftop table overlooking Istanbul at sunset"
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="parallax-img object-cover"
            />
          }
          card={<ChatCard />}
        />

        <Chapter
          number="03"
          eyebrow="Claude & ChatGPT"
          title={
            <>
              Plan in chat. <span className="font-serif font-normal italic text-clay">Keep</span> it here.
            </>
          }
          text="Already sketching trips with Claude or ChatGPT? Connect once and say “save this trip”. Plans land in your PackYourBags inbox, next to the visa check."
          points={[
            "Sign in with Google to authorise. No tokens to copy.",
            "Works as a connector in Claude and ChatGPT.",
            "Your saved plans stay private to your account.",
          ]}
          cta={{ href: "/connect", label: "See how to connect" }}
          media={
            <Image
              src="/media/plan.jpg"
              alt="A map with a dotted route, a passport and a boarding pass on a linen table"
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="parallax-img object-cover"
            />
          }
          card={<ConnectCard />}
        />

        <Chapter
          reverse
          number="04"
          eyebrow="On the trip"
          title={
            <>
              A plan that <span className="font-serif font-normal italic text-clay">reads</span> like a good day.
            </>
          }
          text="Every itinerary is a clean, day-by-day timeline, from first coffee to the last ferry. It's built to be opened one-handed on a street corner."
          points={[
            "Mobile-first, readable in bright sunlight.",
            "Morning, afternoon and evening at a glance.",
            "Regenerate any trip when plans change.",
          ]}
          media={
            <LoopVideo
              src="/media/today.mp4"
              poster="/media/today.jpg"
              alt="A cafe table in a whitewashed Mediterranean alley by the sea"
              sizes="(min-width: 1024px) 45vw, 100vw"
            />
          }
          card={<DayPlanCard />}
        />
      </div>

      {/* How it works */}
      <section id="how" className="relative scroll-mt-20 overflow-hidden bg-night py-20 text-white lg:py-28">
        <div className="pointer-events-none absolute -left-24 top-0 h-96 w-96 rounded-full bg-lagoon/40 blur-[110px]" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-coral/30 blur-[110px]" />
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
          <Reveal>
            <p className="text-xs font-extrabold uppercase tracking-[0.28em] text-sun">How it works</p>
            <h2 className="display-balance mt-4 max-w-3xl font-display text-4xl font-extrabold leading-[1.02] tracking-tight md:text-6xl">
              From “we should go somewhere” to <span className="font-serif font-normal italic text-sun">“it&apos;s all sorted.”</span>
            </h2>
          </Reveal>

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <Reveal key={step.title} delay={i * 90}>
                <div className="h-full rounded-[1.8rem] border border-white/12 bg-white/[0.06] p-6 backdrop-blur transition hover:-translate-y-1 hover:bg-white/10">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sunset font-display text-lg font-extrabold text-night">
                    {i + 1}
                  </span>
                  <h3 className="mt-6 font-display text-xl font-bold">{step.title}</h3>
                  <p className="mt-2.5 text-sm leading-6 text-white/75">{step.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing as a boarding pass */}
      <section id="pricing" className="mx-auto max-w-7xl scroll-mt-20 px-5 py-20 lg:px-8 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <p className="text-xs font-extrabold uppercase tracking-[0.28em] text-clay">Pricing</p>
            <h2 className="display-balance mt-4 font-display text-4xl font-extrabold leading-[1.02] tracking-tight text-ink md:text-6xl">
              Start free. Pay only when you <span className="font-serif font-normal italic text-clay">outgrow</span> it.
            </h2>
            <p className="mt-6 max-w-lg text-lg leading-8 text-muted">
              The visa explorer is free forever and needs no account. Your first three AI itineraries are on us;
              upgrade only if you want more.
            </p>
          </Reveal>

          <Reveal delay={120}>
            <div className="mx-auto max-w-md rotate-1 transition-transform duration-500 hover:rotate-0">
              <div
                className="ticket-notch hero-shadow overflow-hidden rounded-[2rem] bg-white"
                style={{ "--notch-y": "calc(100% - 11.5rem)" } as React.CSSProperties}
              >
                <div className="bg-sunset px-7 py-5 text-night">
                  <div className="flex items-center justify-between text-xs font-extrabold uppercase tracking-[0.22em]">
                    <span>Boarding pass</span>
                    <Plane className="h-4 w-4" />
                  </div>
                  <p className="mt-3 font-display text-4xl font-extrabold leading-none">Starter</p>
                  <p className="mt-1 text-sm font-bold">Seat: anywhere you like</p>
                </div>
                <ul className="space-y-3.5 px-7 py-6 text-sm font-medium text-ink/85">
                  {[
                    "Visa explorer for every passport we cover",
                    "3 AI concierge itineraries included",
                    "Trip briefs and day-by-day timelines",
                    "Claude and ChatGPT connectors",
                  ].map((item) => (
                    <li key={item} className="flex gap-3">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-lagoon" strokeWidth={3} />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="border-t-2 border-dashed border-ink/20" />
                <div className="flex h-[11.5rem] flex-col justify-center gap-4 px-7">
                  <div className="flex items-end gap-2">
                    <span className="font-display text-6xl font-extrabold leading-none text-ink">$0</span>
                    <span className="pb-1.5 font-semibold text-muted">to begin</span>
                  </div>
                  <ButtonLink href="/register" className="h-12 w-full">
                    Create your account
                  </ButtonLink>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Closing call to action */}
      <section className="relative isolate overflow-hidden bg-night text-white">
        <Image
          src="/media/hero.jpg"
          alt=""
          fill
          sizes="100vw"
          className="-z-10 object-cover opacity-60"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(10,34,51,0.85),rgba(10,34,51,0.45)_50%,rgba(10,34,51,0.9))]" />
        <div className="mx-auto max-w-5xl px-5 py-28 text-center lg:py-40">
          <Reveal>
            <h2 className="font-display text-[clamp(3.2rem,10vw,8rem)] font-extrabold leading-[0.9] tracking-[-0.045em]">
              Where to <span className="font-serif font-normal italic text-sun">next?</span>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg font-medium text-white/85">
              Your passport is probably more powerful than you think. Find out in about a minute.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <ButtonLink href="/register" className="h-14 px-8 text-base">
                Plan my first trip
                <ArrowRight className="ml-2 h-5 w-5" />
              </ButtonLink>
              <ButtonLink href="/visa" variant="light" className="h-14 px-8 text-base">
                Try the visa explorer
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>

      <footer className="bg-night text-white/70">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 border-t border-white/10 px-5 py-8 text-sm lg:flex-row lg:px-8">
          <Logo tone="light" />
          <nav aria-label="Footer" className="flex flex-wrap justify-center gap-x-6 gap-y-2 font-semibold">
            <Link href="/visa" className="transition hover:text-white">Visa explorer</Link>
            <Link href="/connect" className="transition hover:text-white">Connect Claude or ChatGPT</Link>
            <Link href="/signin" className="transition hover:text-white">Sign in</Link>
            <Link href="/register" className="transition hover:text-white">Register</Link>
          </nav>
          <p className="flex items-center gap-2">
            <Luggage className="h-4 w-4 text-coral" />
            © 2026 PackYourBags. Made for people who&apos;d rather be travelling.
          </p>
        </div>
        <p className="mx-auto max-w-7xl px-5 pb-8 text-xs leading-5 text-white/50 lg:px-8">
          <Sparkles className="mr-1.5 inline h-3 w-3" />
          Visa information is indicative guidance, not legal advice. Rules change; always confirm with the official source
          before you book.
        </p>
      </footer>
    </main>
  );
}
