"use client";

import { signOut, useSession } from "next-auth/react";
import { useState } from "react";

const BROWSER_KEYS = ["packyourbags.latest-trip", "packyourbags.latest-itinerary"];

// Self-serve deletion. Only shown to signed-in visitors; everyone else sees the
// email route in the surrounding text.
export function DeleteAccount() {
  const { status } = useSession();
  const [step, setStep] = useState<"idle" | "confirm" | "working" | "error">("idle");

  if (status !== "authenticated") {
    return (
      <p className="mt-3 rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm text-muted">
        Sign in to see the delete button here, or use the email option below.
      </p>
    );
  }

  async function deleteEverything() {
    setStep("working");
    try {
      const response = await fetch("/api/account", { method: "DELETE" });
      if (!response.ok) throw new Error("delete failed");

      try {
        BROWSER_KEYS.forEach((key) => window.localStorage.removeItem(key));
      } catch {
        // Storage can be unavailable (private mode); the server side is already gone.
      }
      await signOut({ callbackUrl: "/" });
    } catch {
      setStep("error");
    }
  }

  return (
    <div className="mt-4 rounded-[1.4rem] border border-ink/10 bg-white p-5">
      {step === "confirm" || step === "working" || step === "error" ? (
        <>
          <p className="font-semibold text-ink">Delete your data and sign out?</p>
          <p className="mt-1 text-sm text-muted">This can’t be undone.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              disabled={step === "working"}
              onClick={deleteEverything}
              className="inline-flex h-11 items-center rounded-full bg-clay px-5 text-sm font-bold text-white transition hover:bg-[#9a2f17] disabled:cursor-wait disabled:opacity-60"
            >
              {step === "working" ? "Deleting…" : "Yes, delete my data"}
            </button>
            <button
              type="button"
              disabled={step === "working"}
              onClick={() => setStep("idle")}
              className="inline-flex h-11 items-center rounded-full border-2 border-ink/15 px-5 text-sm font-bold text-ink transition hover:border-ink/40"
            >
              Cancel
            </button>
          </div>
          {step === "error" && (
            <p role="alert" className="mt-3 text-sm font-medium text-clay">
              Something went wrong. Please try again, or email us and we’ll do it for you.
            </p>
          )}
        </>
      ) : (
        <button
          type="button"
          onClick={() => setStep("confirm")}
          className="inline-flex h-11 items-center rounded-full border-2 border-clay/40 px-5 text-sm font-bold text-clay transition hover:bg-clay/10"
        >
          Delete my data
        </button>
      )}
    </div>
  );
}
