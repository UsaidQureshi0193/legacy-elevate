"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

const CLOSE_DELAY_MS = 160;

/**
 * Disclosure dropdown: opens on hover (with a close delay so the pointer can
 * cross the gap), on focus-within and on click/tap; Escape closes it.
 */
export function Dropdown({
  trigger,
  children,
  align = "left",
  triggerClassName = "",
  label,
}: {
  trigger: ReactNode;
  children: (close: () => void) => ReactNode;
  align?: "left" | "right";
  triggerClassName?: string;
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const root = useRef<HTMLDivElement>(null);

  const cancel = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  };
  const show = () => {
    cancel();
    setOpen(true);
  };
  const hideSoon = () => {
    cancel();
    timer.current = setTimeout(() => setOpen(false), CLOSE_DELAY_MS);
  };
  const close = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    if (!open) {
      if (timer.current) clearTimeout(timer.current);
      timer.current = null;
      return;
    }
    const onDown = (e: PointerEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) close();
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open, close]);

  useEffect(() => cancel, []);

  return (
    <div
      ref={root}
      className="relative"
      onMouseEnter={show}
      onMouseLeave={hideSoon}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) hideSoon();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          close();
          root.current?.querySelector("button")?.focus();
        }
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={label}
        onClick={() => (open ? close() : show())}
        className={triggerClassName}
      >
        {trigger}
      </button>
      <div
        hidden={!open}
        className={`absolute top-full z-50 pt-2 ${align === "right" ? "right-0" : "left-0"}`}
      >
        <div className="animate-fade-in min-w-56 rounded-2xl border border-border bg-surface/95 p-2 shadow-float backdrop-blur-xl">
          {children(close)}
        </div>
      </div>
    </div>
  );
}
