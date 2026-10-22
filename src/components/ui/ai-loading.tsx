"use client";

import { useEffect, useState } from "react";

/** Three pulsing dots; static under prefers-reduced-motion. */
export function ThinkingDots() {
  return (
    <span aria-hidden="true" className="inline-flex items-center gap-1">
      {[0, 150, 300].map((d) => (
        <span
          key={d}
          className="size-1.5 animate-pulse rounded-full bg-primary motion-reduce:animate-none"
          style={{ animationDelay: `${d}ms` }}
        />
      ))}
    </span>
  );
}

/**
 * Staged status lines. These are timed UI hints, not real progress: the
 * last stage stays until the request finishes.
 */
export function StagedLoader({ stages, intervalMs = 2500 }: { stages: string[]; intervalMs?: number }) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIndex((i) => Math.min(i + 1, stages.length - 1)), intervalMs);
    return () => clearInterval(t);
  }, [stages.length, intervalMs]);

  return (
    <div role="status" aria-live="polite" className="flex flex-col gap-3 rounded-xl border border-border bg-surface-muted/40 p-4">
      <ol className="flex flex-col gap-1.5 text-xs">
        {stages.map((s, i) => (
          <li key={s} className={i <= index ? "text-foreground" : "text-muted/60"}>
            <span className="num mr-1.5">{i + 1}.</span>
            {s}
            {i === index ? (
              <span className="ml-2 align-middle">
                <ThinkingDots />
              </span>
            ) : null}
          </li>
        ))}
      </ol>
      <div aria-hidden="true" className="flex flex-col gap-2">
        {["w-full", "w-5/6", "w-2/3"].map((w) => (
          <div key={w} className={`h-3 ${w} animate-pulse rounded bg-surface-muted motion-reduce:animate-none`} />
        ))}
      </div>
    </div>
  );
}
