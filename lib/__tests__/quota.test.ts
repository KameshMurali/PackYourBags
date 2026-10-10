import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  conciergeEnabled,
  readQuota,
  releaseGeneration,
  requestPro,
  reserveGeneration,
  resetQuotaMemory,
  setConciergeEnabled,
  setPlan,
  usageFor,
} from "@/lib/quota";

// These run against the in-memory backend (no Upstash in the test environment), which
// implements exactly the same rules as the Redis one.

const alice = "alice@example.com";
const bob = "bob@example.com";

// The one-at-a-time lock lasts 20 seconds; tests move the clock past it.
function pastLock() {
  vi.setSystemTime(Date.now() + 21_000);
}

beforeEach(() => {
  resetQuotaMemory();
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date("2026-10-10T10:00:00Z"));
  delete process.env.CONCIERGE_DAILY_CAP;
});

afterEach(() => {
  vi.useRealTimers();
  delete process.env.CONCIERGE_DAILY_CAP;
});

describe("free allowance", () => {
  it("allows exactly three itineraries, then asks for Pro", async () => {
    for (let i = 0; i < 3; i += 1) {
      expect(await reserveGeneration(alice)).toEqual({ ok: true });
      pastLock();
    }

    const fourth = await reserveGeneration(alice);
    expect(fourth).toMatchObject({ ok: false, status: 402, upgradeRequired: true });
    expect((await readQuota(alice)).used).toBe(3);
  });

  it("counts each person separately", async () => {
    for (let i = 0; i < 3; i += 1) {
      await reserveGeneration(alice);
      pastLock();
    }
    expect(await reserveGeneration(alice)).toMatchObject({ ok: false, status: 402 });
    expect(await reserveGeneration(bob)).toEqual({ ok: true });
  });

  it("treats email case and spacing as the same person", async () => {
    await reserveGeneration("Alice@Example.com ");
    pastLock();
    expect((await readQuota(alice)).used).toBe(1);
  });

  it("gives an itinerary back when generation fails", async () => {
    await reserveGeneration(alice);
    await releaseGeneration(alice);
    expect((await readQuota(alice)).used).toBe(0);

    // The lock is freed too, so they can retry straight away.
    expect(await reserveGeneration(alice)).toEqual({ ok: true });
  });
});

describe("one at a time", () => {
  it("refuses a second request while the first is running", async () => {
    expect(await reserveGeneration(alice)).toEqual({ ok: true });
    expect(await reserveGeneration(alice)).toMatchObject({ ok: false, status: 429 });

    // The refused attempt must not have used up an itinerary.
    expect((await readQuota(alice)).used).toBe(1);
  });

  it("can't be beaten by firing requests in parallel", async () => {
    const results = await Promise.all(Array.from({ length: 10 }, () => reserveGeneration(alice)));
    expect(results.filter((r) => r.ok)).toHaveLength(1);
    expect((await readQuota(alice)).used).toBe(1);
  });

  it("lets people go again once the lock expires", async () => {
    await reserveGeneration(alice);
    pastLock();
    expect(await reserveGeneration(alice)).toEqual({ ok: true });
  });
});

describe("Pro", () => {
  it("is never self-served: requesting only flags the request", async () => {
    await requestPro(alice);
    const quota = await readQuota(alice);
    expect(quota.plan).toBe("starter");
    expect(quota.requested).toBe(true);
    expect(await usageFor(alice)).toMatchObject({ plan: "starter", proRequested: true, remaining: 3 });
  });

  it("is unlimited once an admin grants it, and clears the request", async () => {
    await requestPro(alice);
    await setPlan(alice, "pro");

    for (let i = 0; i < 8; i += 1) {
      expect(await reserveGeneration(alice)).toEqual({ ok: true });
      pastLock();
    }

    const quota = await readQuota(alice);
    expect(quota.plan).toBe("pro");
    expect(quota.requested).toBe(false);
    expect(await usageFor(alice)).toMatchObject({ plan: "pro", remaining: null });
  });

  it("can be taken away again", async () => {
    await setPlan(alice, "pro");
    await setPlan(alice, "starter");
    expect((await readQuota(alice)).plan).toBe("starter");
  });
});

describe("daily cap", () => {
  it("stops everyone once the day's total is reached, without charging the person", async () => {
    process.env.CONCIERGE_DAILY_CAP = "2";

    expect(await reserveGeneration("a@example.com")).toEqual({ ok: true });
    expect(await reserveGeneration("b@example.com")).toEqual({ ok: true });

    const third = await reserveGeneration("c@example.com");
    expect(third).toMatchObject({ ok: false, status: 503 });
    expect((await readQuota("c@example.com")).used).toBe(0);
  });

  it("starts fresh the next day", async () => {
    process.env.CONCIERGE_DAILY_CAP = "1";
    await reserveGeneration(alice);
    expect(await reserveGeneration(bob)).toMatchObject({ ok: false, status: 503 });

    vi.setSystemTime(new Date("2026-10-11T10:00:00Z"));
    expect(await reserveGeneration(bob)).toEqual({ ok: true });
  });
});

describe("off switch", () => {
  it("blocks everyone immediately and can be turned back on", async () => {
    await setConciergeEnabled(false);
    expect(await conciergeEnabled()).toBe(false);
    expect(await reserveGeneration(alice)).toMatchObject({ ok: false, status: 503 });
    expect((await readQuota(alice)).used).toBe(0);

    await setConciergeEnabled(true);
    expect(await reserveGeneration(alice)).toEqual({ ok: true });
  });
});
