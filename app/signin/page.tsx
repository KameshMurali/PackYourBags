import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { isGoogleConfigured } from "@/auth.config";
import { SignInForm } from "@/components/signin-form";
import { signInNotice } from "@/lib/auth-errors";

export default async function SignIn({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const session = await auth();
  const { callbackUrl, error } = await searchParams;
  const destination = callbackUrl && callbackUrl.startsWith("/") ? callbackUrl : "/dashboard";

  // Already signed in — skip the sign-in screen.
  if (session?.user) {
    redirect(destination);
  }

  return (
    <SignInForm
      googleConfigured={isGoogleConfigured}
      callbackUrl={destination}
      notice={signInNotice(error)}
      title="Welcome back."
      subtitle="Continue with your trips, visa shortlists, and travel concierge plans."
    />
  );
}
