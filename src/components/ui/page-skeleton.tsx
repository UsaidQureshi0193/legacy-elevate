/** Placeholder shown while a workspace page streams in. */
export function PageSkeleton() {
  return (
    <div role="status" aria-live="polite" className="flex animate-pulse flex-col gap-6 motion-reduce:animate-none">
      <span className="sr-only">Loading…</span>
      <div className="h-8 w-56 rounded-lg bg-active" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="h-24 rounded-xl border border-border bg-surface" />
        ))}
      </div>
      <div className="h-64 rounded-xl border border-border bg-surface" />
    </div>
  );
}
