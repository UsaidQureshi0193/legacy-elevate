import type { ReactNode } from "react";
import { InfoIcon } from "@/components/icons";

/** Neutral, low-profile note. Replaces the old yellow warning boxes. */
export function Note({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div
      role="note"
      className="flex items-start gap-2.5 rounded-xl border border-border bg-surface-muted/50 p-3.5 text-xs text-muted shadow-xs"
    >
      <InfoIcon className="mt-0.5 shrink-0 text-foreground/60" size={15} />
      <p className="leading-relaxed">
        {title ? <strong className="font-semibold text-foreground">{title} </strong> : null}
        {children}
      </p>
    </div>
  );
}
