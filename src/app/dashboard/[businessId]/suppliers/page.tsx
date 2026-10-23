import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { requirePageBusiness } from "@/server/page-guards";
import { listSuppliersForBusiness } from "@/server/suppliers";
import { PageHeader, PageSkeleton } from "@/features/workspace/page-header";
import { SupplierForm } from "@/features/suppliers/supplier-form";
import { emptyStateClass, panelClass, panelTitleClass } from "@/features/auth/ui";

export const metadata: Metadata = { title: "Suppliers — Elevate" };

type Params = Promise<{ businessId: string }>;

async function SuppliersContent({ params }: { params: Params }) {
  const { businessId } = await params;
  await requirePageBusiness(businessId);
  const suppliers = await listSuppliersForBusiness(businessId);
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Suppliers"
        description="The people and wholesalers you buy stock from. Open one to see what you paid them over time."
      />
      {suppliers.length === 0 ? (
        <p className={emptyStateClass}>
          No suppliers yet. Add the first one below, then record purchases against them.
        </p>
      ) : (
        <section aria-labelledby="suppliers-heading" className={`${panelClass} shadow-xs`}>
          <div className="flex items-center justify-between border-b border-border bg-surface-muted/40 px-5 py-3 sm:px-6">
            <h2 id="suppliers-heading" className="text-sm font-semibold tracking-wide text-foreground">
              Your suppliers
            </h2>
            <span className="inline-flex items-center rounded-full border border-border bg-surface px-2.5 py-0.5 text-xs font-semibold text-muted">
              {suppliers.length} suppliers
            </span>
          </div>
          <ul className="divide-y divide-border/60">
            {suppliers.map((s) => (
              <li key={s.supplierId}>
                <Link
                  href={`/dashboard/${businessId}/suppliers/${s.supplierId}`}
                  className="group flex items-center justify-between gap-4 px-5 py-3.5 text-sm transition-colors hover:bg-surface-muted/40 sm:px-6"
                >
                  <div className="flex min-w-0 items-center gap-3.5">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 font-bold text-sm text-foreground">
                      {s.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <span className="block truncate font-semibold text-foreground group-hover:text-primary transition-colors">
                        {s.name}
                      </span>
                      <span className="block truncate text-xs text-muted">
                        {s.contact.phone || s.contact.email || "No contact info recorded"}
                      </span>
                    </div>
                  </div>
                  <span className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-surface px-3 text-xs font-semibold text-muted shadow-2xs transition-colors group-hover:border-muted group-hover:bg-surface-muted group-hover:text-foreground">
                    <span>View history</span>
                    <span aria-hidden="true" className="text-xs">→</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
      <SupplierForm businessId={businessId} />
    </div>
  );
}

export default function SuppliersPage({ params }: { params: Params }) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <SuppliersContent params={params} />
    </Suspense>
  );
}
