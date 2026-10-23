"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatMoney, minorToDecimalString } from "@/lib/money";
import { emptyStateClass, errorTextClass, inputClass, panelClass } from "@/features/auth/ui";

export type ProductRow = {
  productId: string;
  name: string;
  sku: string | null;
  quantity: number;
  unitCost: number;
  sellingPrice: number;
  reorderLevel: number | null;
};

const editInputClass = `${inputClass} w-28`;

function isLow(p: ProductRow): boolean {
  return p.reorderLevel !== null && p.quantity <= p.reorderLevel;
}

function EditRow({
  businessId,
  product,
  onDone,
}: {
  businessId: string;
  product: ProductRow;
  onDone: () => void;
}) {
  const router = useRouter();
  const [name, setName] = useState(product.name);
  const [sku, setSku] = useState(product.sku ?? "");
  const [unitCost, setUnitCost] = useState(minorToDecimalString(product.unitCost));
  const [sellingPrice, setSellingPrice] = useState(
    minorToDecimalString(product.sellingPrice),
  );
  const [reorderLevel, setReorderLevel] = useState(
    product.reorderLevel !== null ? String(product.reorderLevel) : "",
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);
    try {
      const response = await fetch(
        `/api/businesses/${businessId}/products/${product.productId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name.trim(),
            sku: sku.trim() === "" ? null : sku.trim(),
            unitCost: unitCost.trim(),
            sellingPrice: sellingPrice.trim(),
            reorderLevel: reorderLevel.trim() === "" ? null : Number(reorderLevel),
          }),
        },
      );
      const data = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;
      if (!response.ok) throw new Error(data?.error ?? "Could not update.");
      router.refresh();
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update.");
      setPending(false);
    }
  }

  return (
    <tr className="border-t border-rule bg-surface-muted">
      <td colSpan={7} className="px-4 py-3">
        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-3">
          <div className="flex flex-wrap items-end gap-3">
            <label className="flex flex-col gap-1 text-xs font-medium">
              Name
              <input value={name} onChange={(e) => setName(e.target.value)} required maxLength={120} className={`${inputClass} w-44`} />
            </label>
            <label className="flex flex-col gap-1 text-xs font-medium">
              SKU
              <input value={sku} onChange={(e) => setSku(e.target.value)} maxLength={60} className={editInputClass} />
            </label>
            <label className="flex flex-col gap-1 text-xs font-medium">
              Unit cost
              <input inputMode="decimal" value={unitCost} onChange={(e) => setUnitCost(e.target.value)} required className={editInputClass} />
            </label>
            <label className="flex flex-col gap-1 text-xs font-medium">
              Price
              <input inputMode="decimal" value={sellingPrice} onChange={(e) => setSellingPrice(e.target.value)} required className={editInputClass} />
            </label>
            <label className="flex flex-col gap-1 text-xs font-medium">
              Alert at
              <input type="number" min={0} step={1} value={reorderLevel} onChange={(e) => setReorderLevel(e.target.value)} className={editInputClass} />
            </label>
            <div className="flex gap-2">
              <button type="submit" disabled={pending} className="h-10 rounded-lg bg-ink-button px-4 text-sm font-semibold text-ink-button-foreground disabled:opacity-60">
                {pending ? "Saving…" : "Save"}
              </button>
              <button type="button" onClick={onDone} className="h-10 rounded-lg border border-control bg-surface px-4 text-sm font-medium">
                Cancel
              </button>
            </div>
          </div>
          {error ? <p role="alert" className={errorTextClass}>{error}</p> : null}
        </form>
      </td>
    </tr>
  );
}

/** Inventory table with inline editing and text+icon low-stock flags. */
export function ProductTable({
  businessId,
  currency,
  products,
}: {
  businessId: string;
  currency: string;
  products: ProductRow[];
}) {
  const [editingId, setEditingId] = useState<string | null>(null);

  if (products.length === 0) {
    return (
      <p className={emptyStateClass}>
        No products yet. Add your first product above to start tracking stock.
      </p>
    );
  }

  return (
    <div className={`${panelClass} overflow-x-auto shadow-xs`}>
      <table className="w-full min-w-[760px] text-sm">
        <caption className="sr-only">Products and stock</caption>
        <thead>
          <tr className="border-b border-border bg-surface-muted/40 text-xs font-semibold tracking-wider text-muted uppercase">
            <th scope="col" className="px-5 py-3 text-left">Product</th>
            <th scope="col" className="px-4 py-3 text-left">SKU</th>
            <th scope="col" className="px-4 py-3 text-center">In stock</th>
            <th scope="col" className="px-4 py-3 text-right">Unit cost</th>
            <th scope="col" className="px-4 py-3 text-right">Selling Price</th>
            <th scope="col" className="px-4 py-3 text-center">Alert at</th>
            <th scope="col" className="px-5 py-3 text-right">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60">
          {products.map((product) =>
            editingId === product.productId ? (
              <EditRow
                key={product.productId}
                businessId={businessId}
                product={product}
                onDone={() => setEditingId(null)}
              />
            ) : (
              <tr key={product.productId} className="transition-colors hover:bg-surface-muted/40">
                <td className="px-5 py-3.5">
                  <Link
                    href={`/dashboard/${businessId}/products/${product.productId}`}
                    className="font-semibold text-foreground transition-colors hover:text-primary hover:underline"
                  >
                    {product.name}
                  </Link>
                </td>
                <td className="px-4 py-3.5">
                  {product.sku ? (
                    <span className="inline-block rounded-md border border-border bg-surface-muted px-2 py-0.5 font-mono text-xs text-muted">
                      {product.sku}
                    </span>
                  ) : (
                    <span className="text-muted/60">—</span>
                  )}
                </td>
                <td className="px-4 py-3.5 text-center whitespace-nowrap">
                  {product.quantity <= 0 ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 text-xs font-semibold text-rose-400">
                      <span className="size-1.5 rounded-full bg-rose-400" />
                      <span>0</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider opacity-90">Out</span>
                    </span>
                  ) : isLow(product) ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-400 dark:text-amber-300">
                      <span className="size-1.5 rounded-full bg-amber-400 animate-pulse" />
                      <span className="font-bold">{product.quantity}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 dark:text-amber-300">
                        Low Stock
                      </span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-muted/60 px-2.5 py-1 text-xs font-semibold text-foreground">
                      <span className="size-1.5 rounded-full bg-emerald-400" />
                      <span>{product.quantity}</span>
                    </span>
                  )}
                </td>
                <td className="px-4 py-3.5 text-right font-mono text-xs text-muted tabular-nums">
                  {formatMoney(product.unitCost, currency)}
                </td>
                <td className="px-4 py-3.5 text-right font-mono text-sm font-semibold text-foreground tabular-nums">
                  {formatMoney(product.sellingPrice, currency)}
                </td>
                <td className="px-4 py-3.5 text-center">
                  {product.reorderLevel !== null ? (
                    <span className="inline-block rounded-md border border-border bg-surface-muted px-2 py-0.5 text-xs text-muted">
                      ≤ {product.reorderLevel}
                    </span>
                  ) : (
                    <span className="text-muted/60">—</span>
                  )}
                </td>
                <td className="px-5 py-3.5 whitespace-nowrap text-right">
                  <div className="inline-flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingId(product.productId)}
                      className="inline-flex h-8 items-center justify-center rounded-lg border border-border bg-surface px-2.5 text-xs font-semibold text-foreground shadow-2xs transition-colors hover:bg-surface-muted hover:border-muted"
                    >
                      Edit
                    </button>
                    <Link
                      href={`/dashboard/${businessId}/products/${product.productId}`}
                      className="inline-flex h-8 items-center gap-1 rounded-lg border border-border bg-surface px-2.5 text-xs font-semibold text-muted shadow-2xs transition-colors hover:text-foreground hover:bg-surface-muted"
                    >
                      <span>Stock &amp; pricing</span>
                      <span aria-hidden="true" className="text-xs">→</span>
                    </Link>
                  </div>
                </td>
              </tr>
            ),
          )}
        </tbody>
      </table>
    </div>
  );
}
