import { Luggage } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({ tone = "dark", className }: { tone?: "dark" | "light"; className?: string }) {
  return (
    <Link
      href="/"
      className={cn("group flex items-center gap-2.5", tone === "light" ? "text-white" : "text-ink", className)}
    >
      <span className="flex h-10 w-10 -rotate-6 items-center justify-center rounded-[0.95rem] bg-sunset text-night shadow-[0_10px_24px_rgba(255,107,74,0.45)] transition-transform duration-300 group-hover:rotate-0">
        <Luggage className="h-5 w-5" strokeWidth={2.4} />
      </span>
      <span className="font-display text-[1.35rem] font-extrabold leading-none tracking-tight">
        PackYourBags
      </span>
    </Link>
  );
}
