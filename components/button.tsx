import Link from "next/link";
import { cn } from "@/lib/utils";

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex h-11 items-center justify-center rounded-full px-5 text-sm font-semibold transition-all duration-200",
        variant === "primary" &&
          "bg-ink text-white shadow-[0_18px_48px_rgba(32,25,20,0.22)] hover:-translate-y-0.5 hover:bg-[#120f0c]",
        variant === "secondary" &&
          "border border-black/10 bg-white/80 text-ink shadow-[0_10px_32px_rgba(39,29,22,0.08)] hover:-translate-y-0.5 hover:bg-white",
        variant === "ghost" && "bg-transparent text-ink/70 hover:bg-white/45 hover:text-ink",
        className,
      )}
    >
      {children}
    </Link>
  );
}

