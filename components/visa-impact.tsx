import { Info, Sparkles } from "lucide-react";
import type { SelectionImpact } from "@/lib/visa";

// One sentence under the controls saying what the chosen residence and visas did, including
// when they did nothing. It is a polite live region so a screen reader hears it change, and it
// takes no space until something is chosen.
export function VisaImpact({ impact }: { impact: SelectionImpact | null }) {
  return (
    <div role="status" aria-live="polite">
      {impact && (
        <p
          key={impact.text}
          className={`visa-pop mt-4 flex items-start gap-3 rounded-[1.4rem] border p-4 text-sm leading-6 ${
            impact.kind === "easier"
              ? "border-lagoon/30 bg-lagoon/[0.08] text-ink"
              : "border-ink/10 bg-white/75 text-ink/85"
          }`}
        >
          {impact.kind === "easier" ? (
            <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-lagoon" aria-hidden />
          ) : (
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-muted" aria-hidden />
          )}
          <span>{impact.text}</span>
        </p>
      )}
    </div>
  );
}
