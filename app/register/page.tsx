import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { isGoogleConfigured } from "@/auth.config";
import { SignInForm } from "@/components/signin-form";

export default async function Register({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const session = await auth();
  const { callbackUrl } = await searchParams;
  const destination = callbackUrl && callbackUrl.startsWith("/") ? callbackUrl : "/dashboard";

  if (session?.user) {
    redirect(destination);
  }

  return (
    <SignInForm
      googleConfigured={isGoogleConfigured}
      callbackUrl={destination}
      title="Create your account."
      subtitle="Check visas, sketch trips and plan with an AI concierge. Continuing with Google creates your account automatically."
    />
  );
}
