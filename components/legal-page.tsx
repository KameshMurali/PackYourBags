import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/logo";
import { LEGAL_LAST_UPDATED } from "@/lib/site";

// Shared frame for the privacy policy and terms: readable column, plain headings,
// and links between the two.
export function LegalPage({
  title,
  intro,
  children,
}: {
  title: string;
  intro: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen pb-20">
      <header className="mx-auto flex max-w-3xl items-center justify-between px-5 py-6">
        <Logo />
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted transition hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" />
          Home
        </Link>
      </header>

      <article className="mx-auto max-w-3xl px-5 pt-6">
        <p className="text-xs font-extrabold uppercase tracking-[0.28em] text-clay">Legal</p>
        <h1 className="mt-3 font-display text-4xl font-extrabold leading-tight tracking-tight text-ink md:text-5xl">
          {title}
        </h1>
        <p className="mt-2 text-sm text-muted">Last updated {LEGAL_LAST_UPDATED}</p>
        <p className="mt-6 text-lg leading-8 text-ink/85">{intro}</p>

        <div className="mt-10 space-y-10 [&_a]:font-semibold [&_a]:text-clay [&_a]:underline-offset-4 hover:[&_a]:underline [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-ink [&_li]:leading-7 [&_p]:leading-7 [&_p]:text-ink/85 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_ul]:text-ink/85">
          {children}
        </div>

        <nav
          aria-label="Legal pages"
          className="mt-14 flex gap-5 border-t border-ink/10 pt-6 text-sm font-semibold text-muted"
        >
          <Link href="/privacy" className="transition hover:text-ink">
            Privacy policy
          </Link>
          <Link href="/terms" className="transition hover:text-ink">
            Terms of use
          </Link>
        </nav>
      </article>
    </main>
  );
}
