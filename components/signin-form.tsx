"use client";

import Image from "next/image";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { Logo } from "@/components/logo";
import type { SignInNotice } from "@/lib/auth-errors";

function GoogleGlyph() {
  return (
    <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 48 48">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

export function SignInForm({
  googleConfigured,
  callbackUrl,
  title,
  subtitle,
  notice = null,
}: {
  googleConfigured: boolean;
  callbackUrl: string;
  title: string;
  subtitle: string;
  notice?: SignInNotice | null;
}) {
  const [isSigningIn, setIsSigningIn] = useState(false);

  function handleGoogle() {
    setIsSigningIn(true);
    signIn("google", { callbackUrl });
  }

  return (
    <main className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
      <aside className="relative isolate hidden overflow-hidden bg-night text-white lg:block">
        <Image
          src="/media/hero.jpg"
          alt="Aerial view of a turquoise lagoon at sunset"
          fill
          sizes="55vw"
          priority
          className="-z-10 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(10,34,51,0.55),rgba(10,34,51,0.1)_40%,rgba(10,34,51,0.85))]" />
        <div className="flex h-full flex-col justify-between p-12">
          <Logo tone="light" />
          <div>
            <p className="font-display text-5xl font-extrabold leading-[0.98] tracking-tight xl:text-6xl">
              Your passport is probably more powerful than{" "}
              <span className="font-serif font-normal italic text-sun">you think.</span>
            </p>
            <p className="mt-5 max-w-md text-base font-medium leading-7 text-white/85">
              Check where it opens doors, then let the concierge turn the idea into a day-by-day plan.
            </p>
          </div>
        </div>
      </aside>

      <section className="flex flex-col justify-center px-5 py-10 sm:px-10">
        <div className="mx-auto w-full max-w-md">
          <Logo className="mb-10 lg:hidden" />
          <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-ink md:text-5xl">
            {title}
          </h1>
          <p className="mt-4 text-base leading-7 text-muted">{subtitle}</p>

          {notice && (
            <p
              role="status"
              className={`mt-6 rounded-2xl border px-4 py-3 text-sm font-medium leading-6 ${
                notice.tone === "error"
                  ? "border-clay/30 bg-clay/10 text-clay"
                  : "border-lagoon/30 bg-lagoon/10 text-lagoon-deep"
              }`}
            >
              {notice.text}
            </p>
          )}

          {googleConfigured ? (
            <>
              <button
                className="mt-9 inline-flex h-14 w-full items-center justify-center gap-3 rounded-full bg-coral px-5 text-base font-bold text-night shadow-[0_14px_36px_rgba(255,107,74,0.42)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#ff7d5f] active:scale-[0.98] disabled:cursor-wait disabled:opacity-60"
                disabled={isSigningIn}
                onClick={handleGoogle}
                type="button"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
                  <GoogleGlyph />
                </span>
                {isSigningIn ? "Opening Google…" : "Continue with Google"}
              </button>
              <p className="mt-6 text-sm leading-6 text-muted">
                We use Google to sign you in securely and only see your name and email.
              </p>
            </>
          ) : (
            <div className="mt-9 rounded-[1.4rem] border border-sun/60 bg-sun/15 p-5">
              <p className="font-display text-xl font-bold text-ink">
                Google sign-in isn’t configured yet.
              </p>
              <p className="mt-2 text-sm leading-6 text-ink/75">
                The site owner needs to add Google OAuth credentials
                (<code className="font-mono">AUTH_GOOGLE_ID</code> and{" "}
                <code className="font-mono">AUTH_GOOGLE_SECRET</code>) before
                sign-in can be enabled.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
