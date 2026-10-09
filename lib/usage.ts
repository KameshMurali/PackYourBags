import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { Plan } from "@/lib/plan";

const COOKIE_NAME = "pyb_usage";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
// The free-tier counter lives in a signed cookie. The signing key must never be a
// value that's public in the source (anyone could then forge an "unlimited" cookie
// and spend the Anthropic budget), so it comes from, in order:
//   1. USAGE_COOKIE_SECRET, if set;
//   2. a key derived from AUTH_SECRET (always present once sign-in works);
//   3. a random per-process key: forgery-proof, but the counter resets on restart.
export type UsageSecretSource = "dedicated" | "derived" | "ephemeral";

export const usageSecretSource: UsageSecretSource = process.env.USAGE_COOKIE_SECRET
  ? "dedicated"
  : process.env.AUTH_SECRET
    ? "derived"
    : "ephemeral";

const SECRET =
  process.env.USAGE_COOKIE_SECRET ||
  (process.env.AUTH_SECRET
    ? createHmac("sha256", process.env.AUTH_SECRET).update("packyourbags:usage-cookie").digest("hex")
    : randomBytes(32).toString("hex"));

export type UsageState = {
  plan: Plan;
  used: number;
};

function sign(payload: string) {
  return createHmac("sha256", SECRET).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string) {
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);

  return bufferA.length === bufferB.length && timingSafeEqual(bufferA, bufferB);
}

export async function readUsageState(): Promise<UsageState> {
  const store = await cookies();
  const raw = store.get(COOKIE_NAME)?.value;

  if (!raw) {
    return { plan: "starter", used: 0 };
  }

  const [plan, usedText, signature] = raw.split(":");
  const used = Number.parseInt(usedText ?? "", 10);

  if (
    (plan !== "starter" && plan !== "pro") ||
    !Number.isInteger(used) ||
    used < 0 ||
    !signature ||
    !safeEqual(signature, sign(`${plan}:${used}`))
  ) {
    return { plan: "starter", used: 0 };
  }

  return { plan, used };
}

export async function writeUsageState(state: UsageState) {
  const store = await cookies();
  const payload = `${state.plan}:${state.used}`;

  store.set(COOKIE_NAME, `${payload}:${sign(payload)}`, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
    secure: process.env.NODE_ENV === "production",
  });
}
