"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/logo";
import { signInLocally } from "@/lib/local-auth";

export default function SignIn() {
  const router = useRouter();
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (!email || !password) {
      setError("Enter your email and password.");
      return;
    }

    if (!signInLocally(email)) {
      setError("No browser-local account was found for that email. Create an account first.");
      return;
    }

    router.push("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-10">
      <div className="glass-panel hero-shadow w-full max-w-md rounded-[2rem] border border-black/10 p-8">
        <Logo />
        <h1 className="mt-8 font-display text-4xl text-ink">Welcome back.</h1>
        <p className="mt-3 text-base leading-7 text-muted">
          Continue with your trips, visa shortlists, and travel concierge plans.
        </p>

        <form className="mt-8 space-y-3" onSubmit={handleSubmit}>
          <input
            aria-label="Email"
            autoComplete="email"
            className="w-full rounded-[1.2rem] border border-black/10 bg-white/80 px-4 py-3 text-ink placeholder:text-muted focus:border-clay"
            name="email"
            placeholder="Email"
            required
            type="email"
          />
          <input
            aria-label="Password"
            autoComplete="current-password"
            className="w-full rounded-[1.2rem] border border-black/10 bg-white/80 px-4 py-3 text-ink placeholder:text-muted focus:border-clay"
            name="password"
            placeholder="Password"
            required
            type="password"
          />
          {error && <p className="text-sm leading-6 text-red-700">{error}</p>}
          <button
            className="inline-flex h-12 w-full items-center justify-center rounded-full bg-ink px-5 text-sm font-semibold text-white shadow-[0_18px_48px_rgba(32,25,20,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#120f0c]"
            type="submit"
          >
            Continue
          </button>
        </form>
        <a
          href="/register"
          className="mt-3 inline-flex h-11 w-full items-center justify-center rounded-full px-5 text-sm font-semibold text-ink/70 transition-all duration-200 hover:bg-white/45 hover:text-ink"
        >
          Need an account?
        </a>
        <p className="mt-6 text-xs leading-5 text-muted">
          Prototype mode: accounts live in this browser only and passwords are not stored or checked.
        </p>
      </div>
    </main>
  );
}
