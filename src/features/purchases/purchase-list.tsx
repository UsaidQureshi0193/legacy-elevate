import Link from "next/link";
import { formatMoney } from "@/lib/money";
import type { Purchase } from "@/server/purchases";
import { emptyStateClass, panelClass } from "@/features/auth/ui";
import { VoidPurchaseButton } from "./void-purchase-button";

export function PurchaseList({
  purchases,
  currency,
  businessId,
}: {
  purchases: Purchase[];
  currency: string;
  businessId: string;
}) {
  if (purchases.length === 0) {
    return <p className={emptyStateClass}>No purchases found.</p>;
  }
  return (
    <div className={`${panelClass} shadow-xs`}>
      <div className="flex items-center justify-between border-b border-border bg-surface-muted/40 px-5 py-3 sm:px-6">
        <h2 className="text-sm font-semibold tracking-wide text-foreground">Recorded purchases</h2>
        <span className="inline-flex items-center rounded-full border border-border bg-surface px-2.5 py-0.5 text-xs font-semibold text-muted">
          {purchases.length} records
        </span>
      </div>
      <ul className="divide-y divide-border/60">
        {purchases.map((p) => (
          <li
            key={p.purchaseId}
            className={`flex flex-col gap-2.5 px-5 py-4 transition-colors hover:bg-surface-muted/40 sm:px-6 ${
              p.voidedAt ? "opacity-60" : ""
            }`}
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex min-w-0 flex-col gap-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-base text-foreground">{p.supplierName}</span>
                  <span className="inline-block rounded-md border border-border bg-surface-muted px-2 py-0.5 font-mono text-xs text-muted">
                    {p.date}
                  </span>
                  {p.sourceDocumentId ? (
                    <Link
                      href={`/dashboard/${businessId}/invoices/${p.sourceDocumentId}`}
                      className="inline-flex items-center gap-1 rounded-md border border-primary/30 bg-primary/10 px-2 py-0.5 text-xs font-semibold text-foreground hover:underline"
                    >
                      <span>From scanned bill</span>
                      <span aria-hidden="true" className="text-[10px]">→</span>
                    </Link>
                  ) : null}
                  {p.voidedAt ? (
                    <span className="inline-flex items-center rounded-full border border-border bg-surface-muted px-2.5 py-0.5 text-xs font-medium text-muted">
                      Voided
                    </span>
                  ) : null}
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  {p.items.map((i, idx) => (
                    <span
                      key={`${p.purchaseId}-${i.name}-${idx}`}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1 text-xs font-medium text-foreground shadow-2xs"
                    >
                      <span className="font-bold text-foreground/80">{i.quantity} {i.unit}×</span>
                      <span>{i.name}</span>
                      <span className="font-mono text-muted text-[11px]">@{formatMoney(i.unitCost, currency)}</span>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex shrink-0 flex-col items-start gap-1 sm:items-end">
                <span className={`font-mono text-base font-bold tabular-nums ${p.voidedAt ? "line-through text-muted" : "text-foreground"}`}>
                  {formatMoney(p.total, currency)}
                </span>
                {!p.voidedAt ? (
                  <div className="mt-1">
                    <VoidPurchaseButton businessId={businessId} purchaseId={p.purchaseId} />
                  </div>
                ) : null}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
