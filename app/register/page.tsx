import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { isGoogleConfigured } from "@/auth.config";
import { SignInForm } from "@/components/signin-form";
import { signInNotice } from "@/lib/auth-errors";

export default async function Register({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const session = await auth();
  const { callbackUrl, error } = await searchParams;
  const destination = callbackUrl && callbackUrl.startsWith("/") ? callbackUrl : "/dashboard";

  if (session?.user) {
    redirect(destination);
  }

  return (
    <SignInForm
      googleConfigured={isGoogleConfigured}
      callbackUrl={destination}
      notice={signInNotice(error)}
      title="Create your account."
      subtitle="Check visas, sketch trips and plan with an AI concierge. Continuing with Google creates your account automatically."
    />
  );
}
