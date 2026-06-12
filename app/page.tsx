import Link from "next/link";
import {
  ArrowRight,
  Compass,
  Luggage,
  PlaneTakeoff,
  ShieldCheck,
  Sparkles,
  Stars,
} from "lucide-react";
import { ButtonLink } from "@/components/button";
import { Logo } from "@/components/logo";
import { ChatCard, LeaveCard, MapCard, VisaCard } from "@/components/mockups";

const workflowSteps: Array<{
  icon: typeof Sparkles;
  title: string;
  text: string;
}> = [
  {
    icon: Sparkles,
    title: "1. Start with intent",
    text: "Tell the concierge your timing, budget, passport, flight preference, and overall mood.",
  },
  {
    icon: Compass,
    title: "2. Filter what is possible",
    text: "PackYourBags narrows the list based on visa ease, travel friction, and seasonality.",
  },
  {
    icon: PlaneTakeoff,
    title: "3. Shape the route",
    text: "Compare single-city escapes, island hops, or work-from-anywhere plans in one board.",
  },
  {
    icon: ShieldCheck,
    title: "4. Handle the admin",
    text: "Turn the final route into leave requests, booking notes, and a clear travel checklist.",
  },
];

function Header() {
  return (
    <header className="mx-auto flex max-w-7xl items-center justify-between px-5 py-6 lg:px-8">
      <Logo />
      <nav className="hidden items-center gap-7 text-sm text-muted md:flex">
        <a href="#product" className="transition hover:text-ink">
          Product
        </a>
        <a href="#workflow" className="transition hover:text-ink">
          Workflow
        </a>
        <a href="#pricing" className="transition hover:text-ink">
          Pricing
        </a>
      </nav>
      <div className="flex items-center gap-3">
        <ButtonLink href="/signin" variant="ghost">
          Sign in
        </ButtonLink>
        <ButtonLink href="/register">Get started</ButtonLink>
      </div>
    </header>
  );
}

function Feature({
  eyebrow,
  title,
  text,
  points,
  children,
  reverse = false,
}: {
  eyebrow: string;
  title: string;
  text: string;
  points: string[];
  children: React.ReactNode;
  reverse?: boolean;
}) {
  return (
    <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-12 lg:grid-cols-[0.92fr_1.08fr] lg:px-8">
      <div className={reverse ? "lg:order-2" : ""}>
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-clay">
          {eyebrow}
        </p>
        <h2 className="display-balance max-w-xl font-display text-4xl leading-[0.96] tracking-tight text-ink md:text-6xl">
          {title}
        </h2>
        <p className="mt-5 max-w-xl text-lg leading-8 text-muted">{text}</p>
        <div className="mt-6 space-y-3">
          {points.map((point) => (
            <div key={point} className="flex items-start gap-3 text-sm leading-6 text-ink/80">
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-clay" />
              <span>{point}</span>
            </div>
          ))}
        </div>
      </div>
      <div className={reverse ? "lg:order-1" : ""}>{children}</div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden">
      <Header />

      <section className="relative mx-auto max-w-7xl px-5 pb-14 pt-10 lg:px-8 lg:pb-20 lg:pt-12">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[34rem]">
          <div className="animate-drift absolute left-0 top-10 h-56 w-56 rounded-full bg-[#ead6bb] blur-3xl" />
          <div className="absolute right-0 top-16 h-72 w-72 rounded-full bg-[#dbe8e2] blur-3xl" />
        </div>

        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="glass-panel inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-sm font-medium shadow-sm">
              <PlaneTakeoff className="h-4 w-4" />
              Premium trip planning for frequent travellers
            </div>

            <h1 className="display-balance mt-8 max-w-5xl font-display text-6xl leading-[0.88] tracking-[-0.05em] text-ink md:text-8xl lg:text-[7rem]">
              Travel planning that feels as calm as the trip itself.
            </h1>

            <p className="text-balance mt-7 max-w-2xl text-lg leading-8 text-muted md:text-xl">
              PackYourBags combines leave management, visa clarity, itinerary building,
              and an AI concierge into one elegant workspace built for modern travellers.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/register" className="h-12 px-7">
                Get started free
                <ArrowRight className="ml-2 h-4 w-4" />
              </ButtonLink>
              <ButtonLink href="#product" variant="secondary" className="h-12 px-7">
                Explore the product
              </ButtonLink>
            </div>

            <div className="mt-10 grid max-w-2xl gap-3 sm:grid-cols-3">
              {[
                ["Leave synced", "Track PTO before you book."],
                ["Visa-aware", "Know what is actually possible."],
                ["AI concierge", "Turn intent into an itinerary."],
              ].map(([title, text]) => (
                <div key={title} className="glass-panel rounded-[1.4rem] border border-black/10 p-4">
                  <p className="text-sm font-semibold text-ink">{title}</p>
                  <p className="mt-2 text-sm leading-6 text-muted">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="hero-shadow glass-panel relative rounded-[2.4rem] border border-black/10 p-4 sm:p-5">
              <div className="absolute inset-0 rounded-[2.4rem] bg-[linear-gradient(135deg,rgba(255,255,255,0.55),transparent_45%)]" />
              <div className="relative grid gap-4">
                <div className="animate-float-slow">
                  <MapCard />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="animate-float-delayed">
                    <LeaveCard />
                  </div>
                  <div className="animate-float-slow">
                    <VisaCard />
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-panel hero-shadow absolute -bottom-10 left-4 right-4 rounded-[1.7rem] border border-black/10 p-4 sm:left-auto sm:right-6 sm:w-[22rem]">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-[#f4e7d3] p-3 text-ink">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">Next escape ready</p>
                  <p className="text-sm text-muted">Bodrum shortlist generated in 14 seconds</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <div className="grid gap-4 md:grid-cols-4">
          {[
            ["4.9/5", "Loved by fast-moving teams and founder-travellers"],
            ["195", "destinations mapped with visa context and timing"],
            ["< 2 min", "to turn an idea into a structured trip draft"],
            ["1 workspace", "for leave, flights, hotels, and packing lists"],
          ].map(([figure, copy]) => (
            <div key={copy} className="glass-panel rounded-[1.8rem] border border-black/10 p-5">
              <p className="font-display text-4xl leading-none text-ink">{figure}</p>
              <p className="mt-3 text-sm leading-6 text-muted">{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="product" className="mx-auto max-w-7xl px-5 pb-4 pt-16 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-clay">
            A calmer operating system for travel
          </p>
          <h2 className="display-balance mt-4 font-display text-4xl leading-tight text-ink md:text-6xl">
            PackYourBags replaces the spreadsheet, the notes app, and the last-minute panic.
          </h2>
        </div>
      </section>

      <Feature
        eyebrow="Leave tracking"
        title="Plan around real availability, not guesswork."
        text="Know your usable leave, public holidays, and approval windows before you fall in love with a destination."
        points={[
          "See your live balance across upcoming quarters.",
          "Draft leave requests directly from your trip plan.",
          "Build smarter long weekends with policy-aware suggestions.",
        ]}
      >
        <LeaveCard />
      </Feature>

      <Feature
        reverse
        eyebrow="Trip planning"
        title="Design the route before you start chasing tabs."
        text="Flights, hotels, notes, travel moodboards, and city-hopping logic sit together in one minimal planner."
        points={[
          "Visual route planning with city-to-city movement.",
          "A calmer structure for bookings, notes, and day plans.",
          "Ideal for multi-stop escapes and hybrid work trips.",
        ]}
      >
        <MapCard />
      </Feature>

      <Feature
        eyebrow="Visa discovery"
        title="Start with destinations you can actually reach."
        text="Filter ideas by passport, residence, existing visas, and travel timing so you only see relevant options."
        points={[
          "Know whether a city is no-visa, eVisa, or arrival-only.",
          "Reduce friction before you start planning hotels or flights.",
          "Surface better shortlists for couples, families, or solo trips.",
        ]}
      >
        <VisaCard />
      </Feature>

      <Feature
        reverse
        eyebrow="AI concierge"
        title="Describe the mood. Let AI shape the logistics."
        text="From one prompt, generate a trip concept, a booking structure, an itinerary, and the admin around it."
        points={[
          "Build destination shortlists from your constraints.",
          "Auto-generate packing, leave, and itinerary blocks.",
          "Keep the premium feel without the planning overhead.",
        ]}
      >
        <ChatCard />
      </Feature>

      <section id="workflow" className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2rem] border border-black/10 bg-[#1f1913] p-8 text-white md:p-10">
            <p className="text-xs uppercase tracking-[0.28em] text-[#e5c39a]">Workflow</p>
            <h2 className="mt-4 font-display text-4xl leading-tight md:text-5xl">
              From “we should go somewhere” to “everything is sorted.”
            </h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-white/[0.68]">
              Built for people who want premium travel outcomes without juggling six tools and
              a dozen loose documents.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {workflowSteps.map(({ icon: Icon, title, text }) => (
              <div key={title} className="glass-panel rounded-[1.8rem] border border-black/10 p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f2e7d9] text-ink">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-semibold text-ink">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-6xl px-5 pb-20 lg:px-8">
        <div className="hero-shadow overflow-hidden rounded-[2.4rem] border border-black/10 bg-[#f8f3ea] p-8 md:p-12">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm">
                <Stars className="h-4 w-4 text-clay" />
                Launch offer
              </div>
              <h2 className="display-balance mt-6 font-display text-4xl leading-tight text-ink md:text-6xl">
                Start free. Upgrade when your travel life gets serious.
              </h2>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
                Explore the core planner for free, then unlock concierge workflows, advanced visa intelligence,
                and polished trip spaces as your planning becomes more ambitious.
              </p>
            </div>

            <div className="story-shadow rounded-[2rem] border border-black/10 bg-white/90 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-clay">Starter</p>
              <div className="mt-4 flex items-end gap-2">
                <span className="font-display text-6xl text-ink">$0</span>
                <span className="pb-2 text-muted">to begin</span>
              </div>
              <div className="mt-6 space-y-3 text-sm text-ink/80">
                {[
                  "Trip boards and itinerary drafts",
                  "Leave tracking and planning windows",
                  "3 AI concierge itineraries included",
                  "Beautiful shareable planning spaces",
                ].map((item) => (
                  <div key={item} className="flex gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-clay" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <ButtonLink href="/register" className="mt-8 h-12 w-full">
                Create your account
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <footer className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-black/10 px-5 py-8 text-sm text-muted lg:flex-row lg:px-8">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-ink text-white">
            <Luggage className="h-4 w-4" />
          </span>
          <span className="font-semibold text-ink">PackYourBags</span>
        </div>
        <div className="flex gap-5">
          <Link href="/signin">Sign in</Link>
          <Link href="/register">Register</Link>
          <a href="#product">Product</a>
        </div>
        <p>© 2026 PackYourBags. Designed for calmer travel planning.</p>
      </footer>
    </main>
  );
}
