"use client";

import { SessionProvider } from "next-auth/react";

// Thin client wrapper so `useSession()` works in client components. Rendered
// once at the root in app/layout.tsx.
export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
