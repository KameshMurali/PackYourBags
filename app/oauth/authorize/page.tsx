import Link from "next/link";
import { redirect } from "next/navigation";
import { BookmarkPlus, Globe2, ListChecks, ShieldAlert } from "lucide-react";
import { auth } from "@/auth";
import { Logo } from "@/components/logo";
import {
  isOAuthConfigured,
  isValidCodeChallenge,
  readClient,
  redirectUriMatches,
  withQuery,
} from "@/lib/oauth";
import { approveConnection, denyConnection } from "./actions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Search = Record<string, string | string[] | undefined>;

function one(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function hostOf(uri: string) {
  try {
    const url = new URL(uri);
    return url.host || url.protocol.replace(/:$/, "");
  } catch {
    return uri;
  }
}

function Problem({ title, detail }: { title: string; detail: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-10">
      <div className="glass-panel hero-shadow w-full max-w-md rounded-[2rem] border border-black/10 p-8 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f6dede] text-[#9a3131]">
          <ShieldAlert className="h-6 w-6" />
        </span>
        <h1 className="mt-6 font-display text-3xl text-ink">{title}</h1>
        <p className="mt-3 text-sm leading-7 text-muted">{detail}</p>
        <Link
          className="mt-7 inline-flex h-12 items-center justify-center rounded-full bg-ink px-6 text-sm font-semibold text-white"
          href="/connect"
        >
          How to connect an assistant
        </Link>
      </div>
    </main>
  );
}

export default async function AuthorizePage({ searchParams }: { searchParams: Promise<Search> }) {
  const params = await searchParams;
  const clientId = one(params.client_id);
  const redirectUri = one(params.redirect_uri);
  const state = one(params.state);
  const codeChallenge = one(params.code_challenge);
  const codeChallengeMethod = one(params.code_challenge_method);

  if (!isOAuthConfigured) {
    return (
      <Problem
        title="Connections aren't switched on yet"
        detail="The site owner still needs to finish setup (AUTH_SECRET) before assistants can connect."
      />
    );
  }

  const client = readClient(clientId);
  if (!client || !clientId) {
    return (
      <Problem
        title="Unknown app"
        detail="This request didn't come from a registered app. Start the connection again from Claude or ChatGPT."
      />
    );
  }

  // Until the redirect URI is verified against the registration we must not
  // send the browser anywhere, or this page becomes an open redirect.
  if (!redirectUri || !redirectUriMatches(client.redirect_uris, redirectUri)) {
    return (
      <Problem
        title="Redirect not allowed"
        detail="The app asked to send you somewhere it didn't register. Start the connection again from your assistant."
      />
    );
  }

  if (one(params.response_type) !== "code") {
    redirect(withQuery(redirectUri, { error: "unsupported_response_type", state }));
  }
  if (!isValidCodeChallenge(codeChallenge, codeChallengeMethod)) {
    redirect(
      withQuery(redirectUri, {
        error: "invalid_request",
        error_description: "PKCE with the S256 method is required.",
        state,
      }),
    );
  }

  const session = await auth();
  if (!session?.user?.email) {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      const single = one(value);
      if (single) {
        query.set(key, single);
      }
    }
    redirect(`/signin?callbackUrl=${encodeURIComponent(`/oauth/authorize?${query.toString()}`)}`);
  }

  const appName = client.client_name || hostOf(redirectUri);
  const permissions = [
    { icon: BookmarkPlus, text: "Save trip briefs and day-by-day itineraries to your workspace" },
    { icon: ListChecks, text: "Read the trips and itineraries you've saved" },
    { icon: Globe2, text: "Check visa requirements for your passport and residence" },
  ];

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-10">
      <div className="glass-panel hero-shadow w-full max-w-md rounded-[2rem] border border-black/10 p-8">
        <Logo />
        <h1 className="mt-8 font-display text-4xl leading-tight text-ink">
          Connect {appName} to PackYourBags?
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          Signed in as <span className="font-semibold text-ink">{session.user.email}</span>.{" "}
          {appName} will be able to:
        </p>

        <ul className="mt-5 space-y-3">
          {permissions.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-start gap-3 text-sm leading-6 text-ink/85">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f2e7d9] text-clay">
                <Icon className="h-4 w-4" />
              </span>
              {text}
            </li>
          ))}
        </ul>

        <p className="mt-5 rounded-[1.1rem] border border-black/10 bg-white/60 p-4 text-xs leading-5 text-muted">
          It can&apos;t see your Google account or anything outside PackYourBags. You&apos;ll be sent back
          to <span className="font-semibold text-ink">{hostOf(redirectUri)}</span>. Remove the connector in
          your assistant&apos;s settings to disconnect.
        </p>

        <form action={approveConnection} className="mt-6">
          <input type="hidden" name="client_id" value={clientId} />
          <input type="hidden" name="redirect_uri" value={redirectUri} />
          <input type="hidden" name="state" value={state ?? ""} />
          <input type="hidden" name="code_challenge" value={codeChallenge} />
          <input type="hidden" name="code_challenge_method" value={codeChallengeMethod ?? ""} />
          <button
            className="inline-flex h-12 w-full items-center justify-center rounded-full bg-ink px-5 text-sm font-semibold text-white shadow-[0_18px_48px_rgba(32,25,20,0.22)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#120f0c]"
            type="submit"
          >
            Allow access
          </button>
        </form>
        <form action={denyConnection} className="mt-3">
          <input type="hidden" name="client_id" value={clientId} />
          <input type="hidden" name="redirect_uri" value={redirectUri} />
          <input type="hidden" name="state" value={state ?? ""} />
          <button
            className="inline-flex h-11 w-full items-center justify-center rounded-full border border-black/10 bg-white/70 px-5 text-sm font-semibold text-ink transition hover:bg-white"
            type="submit"
          >
            Cancel
          </button>
        </form>
      </div>
    </main>
  );
}
