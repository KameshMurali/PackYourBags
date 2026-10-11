"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { setBudgetUsd } from "@/lib/budget";
import { setConciergeEnabled, setPlan } from "@/lib/quota";

// Server actions are public POST endpoints, so every one re-checks the admin role
// itself instead of trusting that only the admin page renders the form.
async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    throw new Error("Not authorized");
  }
}

export async function setUserPlanAction(formData: FormData) {
  await requireAdmin();

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email.includes("@") || email.length > 254) {
    return;
  }

  await setPlan(email, formData.get("plan") === "pro" ? "pro" : "starter");
  revalidatePath("/admin");
}

export async function setConciergeAction(formData: FormData) {
  await requireAdmin();
  await setConciergeEnabled(formData.get("enabled") === "1");
  revalidatePath("/admin");
}

export async function setBudgetAction(formData: FormData) {
  await requireAdmin();

  const amount = Number.parseFloat(String(formData.get("budget") ?? ""));
  if (!Number.isFinite(amount) || amount < 1 || amount > 1000) {
    return;
  }

  await setBudgetUsd(Math.round(amount * 100) / 100);
  revalidatePath("/admin");
}
