import { ExternalLink } from "lucide-react";
import type { ReactNode } from "react";

// Opens in a new tab and says so to screen readers.
export function VisaExternalLink({
  href,
  children,
  className = "",
  label,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  /** Extra context for assistive tech and the tooltip, e.g. who publishes the page. */
  label?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={label}
      className={`inline-flex items-center gap-1.5 rounded-sm underline-offset-2 transition hover:underline ${className}`}
    >
      {children}
      <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden />
      <span className="sr-only">
        {label ? ` — ${label}` : ""} (opens in a new tab)
      </span>
    </a>
  );
}
