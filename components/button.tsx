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
  variant?: "primary" | "secondary" | "ghost" | "light";
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex h-11 items-center justify-center whitespace-nowrap rounded-full px-5 text-sm font-bold transition-all duration-200 active:scale-[0.98]",
        // Coral with dark text: warm and energetic, and 5.7:1 contrast for the label.
        variant === "primary" &&
          "bg-coral text-night shadow-[0_14px_36px_rgba(255,107,74,0.42)] hover:-translate-y-0.5 hover:bg-[#ff7d5f] hover:shadow-[0_18px_44px_rgba(255,107,74,0.55)]",
        variant === "secondary" &&
          "border-2 border-ink/15 bg-white text-ink hover:-translate-y-0.5 hover:border-ink/40",
        variant === "ghost" && "bg-transparent text-ink/75 hover:bg-ink/5 hover:text-ink",
        variant === "light" &&
          "border-2 border-white/60 bg-white/10 text-white backdrop-blur hover:-translate-y-0.5 hover:border-white hover:bg-white/20",
        className,
      )}
    >
      {children}
    </Link>
  );
}
