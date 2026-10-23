import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { requirePageBusiness } from "@/server/page-guards";
import { listProductsForBusiness } from "@/server/products";
import { listSalesForBusiness, type Sale } from "@/server/sales";
import { formatMoney } from "@/lib/money";
import { PageHeader, PageSkeleton } from "@/features/workspace/page-header";
import { SaleForm } from "@/features/sales/sale-form";
import { SalesVisuals } from "@/features/sales/sales-visuals";
import { emptyStateClass, panelClass, panelTitleClass, secondaryButtonClass } from "@/features/auth/ui";

export const metadata: Metadata = { title: "Sales — Elevate" };

function SaleList({ sales, currency }: { sales: Sale[]; currency: string }) {
  if (sales.length === 0) {
    return (
      <p className={emptyStateClass}>
        No sales recorded yet. Confirmed sales appear here with their exact
        totals.
      </p>
    );
  }
  return (
    <section aria-labelledby="sales-heading" className={`${panelClass} shadow-xs`}>
      <div className="flex items-center justify-between border-b border-border bg-surface-muted/40 px-5 py-3 sm:px-6">
        <h2 id="sales-heading" className="text-sm font-semibold tracking-wide text-foreground">
          Recorded sales
        </h2>
        <span className="inline-flex items-center rounded-full border border-border bg-surface px-2.5 py-0.5 text-xs font-semibold text-muted">
          {sales.length} transactions
        </span>
      </div>
      <ul className="divide-y divide-border/60">
        {sales.map((sale) => (
          <li
            key={sale.saleId}
            className="flex flex-col gap-2 px-5 py-3.5 transition-colors hover:bg-surface-muted/40 sm:flex-row sm:items-center sm:justify-between sm:px-6"
          >
            <div className="flex min-w-0 flex-col gap-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-block rounded-md border border-border bg-surface-muted px-2 py-0.5 font-mono text-xs text-muted">
                  {sale.date}
                </span>
                <span className="text-xs text-muted">
                  {sale.items.reduce((sum, item) => sum + item.quantity, 0)} items sold
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {sale.items.map((item, idx) => (
                  <span
                    key={`${sale.saleId}-${item.name}-${idx}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1 text-xs font-medium text-foreground shadow-2xs"
                  >
                    <span className="font-bold text-foreground/80">{item.quantity}×</span>
                    <span>{item.name}</span>
                  </span>
                ))}
              </div>
            </div>
            <div className="flex shrink-0 items-center justify-end">
              <span className="font-mono text-base font-bold text-foreground tabular-nums">
                {formatMoney(sale.total, currency)}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

async function SalesContent({
  params,
}: {
  params: Promise<{ businessId: string }>;
}) {
  const { businessId } = await params;
  const business = await requirePageBusiness(businessId);
  const [products, sales] = await Promise.all([
    listProductsForBusiness(businessId),
    listSalesForBusiness(businessId),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Sales"
        description="Recording a sale takes the items out of stock straight away. Totals are calculated by Elevate, not typed in."
        actions={
          <Link
            href={`/dashboard/${businessId}/invoices?type=sale`}
            className={`${secondaryButtonClass} inline-flex items-center gap-1.5 h-10 px-4`}
          >
            <span>📷</span> Scan sales receipt
          </Link>
        }
      />

      <SaleForm
        businessId={businessId}
        currency={business.currency}
        timezone={business.timezone}
        products={products.map((product) => ({
          productId: product.productId,
          name: product.name,
          sellingPrice: product.sellingPrice,
          quantity: product.quantity,
        }))}
      />
      <SalesVisuals sales={sales} currency={business.currency} />
      <SaleList sales={sales} currency={business.currency} />
    </div>
  );
}

export default function SalesPage({
  params,
}: {
  params: Promise<{ businessId: string }>;
}) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <SalesContent params={params} />
    </Suspense>
  );
}
