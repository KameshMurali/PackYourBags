import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { isGoogleConfigured } from "@/auth.config";
import { SignInForm } from "@/components/signin-form";

export default async function SignIn({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const session = await auth();
  const { callbackUrl } = await searchParams;
  const destination = callbackUrl && callbackUrl.startsWith("/") ? callbackUrl : "/dashboard";

  // Already signed in — skip the sign-in screen.
  if (session?.user) {
    redirect(destination);
  }

  return (
    <SignInForm
      googleConfigured={isGoogleConfigured}
      callbackUrl={destination}
      title="Welcome back."
      subtitle="Continue with your trips, visa shortlists, and travel concierge plans."
    />
  );
}
