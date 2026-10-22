"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * Thin top bar shown from the moment an internal link is clicked until the
 * new route renders. Solid token colour, pulse is disabled for reduced motion.
 * Must sit inside <Suspense> (reads pathname and search params).
 */
export function RouteProgress() {
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const [loading, setLoading] = useState(false);
  const key = `${pathname}?${search}`;

  useEffect(() => {
    setLoading(false);
  }, [key]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element).closest("a");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      if (`${url.pathname}?${url.searchParams.toString()}` === key) return;
      setLoading(true);
    };
    const onSubmit = () => setLoading(true);
    document.addEventListener("click", onClick);
    document.addEventListener("submit", onSubmit);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("submit", onSubmit);
    };
  }, [key]);

  // Safety net so the bar never sticks (e.g. a submit that stays on the page).
  useEffect(() => {
    if (!loading) return;
    const t = setTimeout(() => setLoading(false), 8000);
    return () => clearTimeout(t);
  }, [loading]);

  return (
    <div
      role="progressbar"
      aria-label="Loading"
      aria-hidden={!loading}
      hidden={!loading}
      className="fixed inset-x-0 top-0 z-[100] h-1 animate-pulse bg-primary motion-reduce:animate-none"
    />
  );
}
