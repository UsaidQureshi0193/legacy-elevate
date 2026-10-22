"use client";

import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

export type ForecastTab = { id: string; label: string; content: ReactNode };

/** Accessible tablist (arrow keys, Home/End). Panels are server-rendered and passed in. */
export function ForecastTabs({ tabs }: { tabs: ForecastTab[] }) {
  const [active, setActive] = useState(0);
  const base = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  function onKeyDown(e: KeyboardEvent) {
    let next = active;
    if (e.key === "ArrowRight") next = (active + 1) % tabs.length;
    else if (e.key === "ArrowLeft") next = (active - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = tabs.length - 1;
    else return;
    e.preventDefault();
    setActive(next);
    refs.current[next]?.focus();
  }

  return (
    <div className="flex flex-col gap-5">
      <div
        role="tablist"
        aria-label="Forecast sections"
        onKeyDown={onKeyDown}
        className="flex gap-1 overflow-x-auto rounded-xl border border-border bg-surface-muted p-1"
      >
        {tabs.map((t, i) => (
          <button
            key={t.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            role="tab"
            type="button"
            id={`${base}-tab-${t.id}`}
            aria-selected={i === active}
            aria-controls={`${base}-panel-${t.id}`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            className={`inline-flex min-h-11 shrink-0 items-center rounded-lg px-4 text-sm font-semibold whitespace-nowrap transition ${
              i === active ? "bg-surface text-foreground shadow-xs" : "text-muted hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map((t, i) => (
        <div
          key={t.id}
          role="tabpanel"
          id={`${base}-panel-${t.id}`}
          aria-labelledby={`${base}-tab-${t.id}`}
          hidden={i !== active}
          className="flex flex-col gap-6"
        >
          {t.content}
        </div>
      ))}
    </div>
  );
}
