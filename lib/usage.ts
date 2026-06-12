import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { Plan } from "@/lib/plan";

const COOKIE_NAME = "pyb_usage";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
// Prototype fallback: per-user state lives in this browser cookie only. Set
// USAGE_COOKIE_SECRET in production so signatures can't be forged offline.
const SECRET = process.env.USAGE_COOKIE_SECRET ?? "packyourbags-dev-usage-secret";

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
