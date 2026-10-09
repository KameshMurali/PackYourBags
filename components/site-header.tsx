"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { ButtonLink } from "@/components/button";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";

const links = [
  { href: "/visa", label: "Visa explorer" },
  { href: "#chapters", label: "What it does" },
  { href: "#how", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
];

// Floats over the hero (white text), then settles into a solid paper bar once you scroll.
export function SiteHeader() {
  const { data: session, status } = useSession();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const signedIn = status === "authenticated";

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-ink/10 bg-cream/90 shadow-[0_8px_30px_rgba(10,34,51,0.08)] backdrop-blur-xl"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 lg:px-8">
        <Logo tone={scrolled ? "dark" : "light"} />
        <nav
          aria-label="Main"
          className={cn(
            "hidden items-center gap-1 text-sm font-semibold md:flex",
            scrolled ? "text-ink/75" : "text-white/85",
          )}
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-full px-3.5 py-2 transition",
                scrolled ? "hover:bg-ink/5 hover:text-ink" : "hover:bg-white/15 hover:text-white",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {signedIn ? (
            <>
              {session?.user?.role === "admin" && (
                <ButtonLink
                  href="/admin"
                  variant="ghost"
                  className={cn(!scrolled && "text-white hover:bg-white/15 hover:text-white")}
                >
                  Admin
                </ButtonLink>
              )}
              <ButtonLink href="/dashboard">My trips</ButtonLink>
            </>
          ) : (
            <>
              <ButtonLink
                href="/signin"
                variant="ghost"
                className={cn(!scrolled && "text-white hover:bg-white/15 hover:text-white")}
              >
                Sign in
              </ButtonLink>
              <ButtonLink href="/register" className="hidden sm:inline-flex">
                Get started
              </ButtonLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
