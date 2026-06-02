import { Luggage } from "lucide-react";
import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3 text-ink">
      <span className="flex h-11 w-11 items-center justify-center rounded-[1.15rem] bg-ink text-white shadow-[0_16px_32px_rgba(32,25,20,0.18)]">
        <Luggage className="h-5 w-5" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-[0.65rem] font-semibold uppercase tracking-[0.26em] text-clay">
          Travel OS
        </span>
        <span className="font-display text-xl">PackYourBags</span>
      </span>
    </Link>
  );
}

