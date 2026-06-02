import { ButtonLink } from "@/components/button";
import { Logo } from "@/components/logo";

export default function SignIn() {
  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-10">
      <div className="glass-panel hero-shadow w-full max-w-md rounded-[2rem] border border-black/10 p-8">
        <Logo />
        <h1 className="mt-8 font-display text-4xl text-ink">Welcome back.</h1>
        <p className="mt-3 text-base leading-7 text-muted">
          Continue with your trips, visa shortlists, and travel concierge plans.
        </p>

        <div className="mt-8 space-y-3">
          <input
            className="w-full rounded-[1.2rem] border border-black/10 bg-white/80 px-4 py-3 text-ink placeholder:text-muted focus:border-clay"
            placeholder="Email"
            type="email"
          />
          <input
            className="w-full rounded-[1.2rem] border border-black/10 bg-white/80 px-4 py-3 text-ink placeholder:text-muted focus:border-clay"
            placeholder="Password"
            type="password"
          />
        </div>

        <ButtonLink href="/" className="mt-6 h-12 w-full">
          Continue
        </ButtonLink>
        <ButtonLink href="/register" variant="ghost" className="mt-3 w-full">
          Need an account?
        </ButtonLink>
      </div>
    </main>
  );
}

