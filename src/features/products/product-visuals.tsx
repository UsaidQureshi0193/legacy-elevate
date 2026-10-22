import { formatMoney } from "@/lib/money";
import type { Product } from "@/server/products";
import { lowStockItems } from "@/lib/calculations";
import { ProductsIcon } from "@/components/icons";
import { panelClass, panelTitleClass } from "@/features/auth/ui";

export function ProductVisuals({
  products,
  currency,
}: {
  products: Product[];
  currency: string;
}) {
  if (products.length === 0) return null;

  const totalCost = products.reduce((sum, p) => sum + Math.round(p.quantity * p.unitCost), 0);
  const totalRetail = products.reduce((sum, p) => sum + Math.round(p.quantity * p.sellingPrice), 0);
  const totalUnits = products.reduce((sum, p) => sum + p.quantity, 0);

  const lowStock = lowStockItems(products);
  const outOfStockCount = products.filter((p) => p.quantity <= 0).length;
  const lowStockCount = lowStock.length - outOfStockCount;
  const healthyCount = Math.max(0, products.length - lowStockCount - outOfStockCount);

  const healthyPercent = Math.round((healthyCount / products.length) * 100);
  const lowPercent = Math.round((lowStockCount / products.length) * 100);
  const outPercent = Math.max(0, 100 - healthyPercent - lowPercent);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* 1. Value Summary Cards */}
      <div className="flex flex-col gap-4">
        <div className={`${panelClass} p-5 flex flex-col justify-between shadow-xs border-l-4 border-l-primary`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-muted tracking-wider">Inventory Asset Cost</span>
            <ProductsIcon size={18} className="text-primary" />
          </div>
          <div className="mt-3">
            <p className="num text-2xl font-bold tracking-tight text-foreground">
              {formatMoney(totalCost, currency)}
            </p>
            <p className="mt-1 text-xs text-muted">{totalUnits} total units in stock</p>
          </div>
        </div>

        <div className={`${panelClass} p-5 flex flex-col justify-between shadow-xs border-l-4 border-l-emerald-500`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-muted tracking-wider">Potential Retail Value</span>
            <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              At selling price
            </span>
          </div>
          <div className="mt-3">
            <p className="num text-2xl font-bold tracking-tight text-foreground">
              {formatMoney(totalRetail, currency)}
            </p>
            <p className="mt-1 text-xs text-muted">
              Projected margin: <span className="font-semibold text-foreground">{formatMoney(totalRetail - totalCost, currency)}</span>
            </p>
          </div>
        </div>
      </div>

      {/* 2. Inventory Health Status Distribution */}
      <div className={`${panelClass} p-5 sm:p-6 shadow-xs flex flex-col justify-between lg:col-span-2`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className={panelTitleClass}>Inventory Health Meter</h3>
            <p className="mt-0.5 text-xs text-muted">Stock availability breakdown across {products.length} products</p>
          </div>
          <span className="text-xs font-semibold text-foreground">{healthyPercent}% Healthy</span>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          {/* Segmented health meter bar */}
          <div className="h-4 w-full rounded-full bg-surface-muted overflow-hidden flex shadow-inner">
            {healthyPercent > 0 ? (
              <div
                style={{ width: `${healthyPercent}%` }}
                className="h-full bg-emerald-500 transition-all duration-500"
                title={`Healthy: ${healthyCount} products (${healthyPercent}%)`}
              />
            ) : null}
            {lowPercent > 0 ? (
              <div
                style={{ width: `${lowPercent}%` }}
                className="h-full bg-amber-500 transition-all duration-500"
                title={`Low Stock: ${lowStockCount} products (${lowPercent}%)`}
              />
            ) : null}
            {outPercent > 0 ? (
              <div
                style={{ width: `${outPercent}%` }}
                className="h-full bg-danger transition-all duration-500"
                title={`Out of Stock: ${outOfStockCount} products (${outPercent}%)`}
              />
            ) : null}
          </div>

          {/* Legend Badges */}
          <div className="flex flex-wrap items-center gap-4 text-xs mt-2">
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-emerald-500" />
              <span className="font-medium text-foreground">{healthyCount} Safe Stock</span>
              <span className="text-muted">({healthyPercent}%)</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-amber-500" />
              <span className="font-medium text-amber-500">{lowStockCount} Low Stock</span>
              <span className="text-muted">({lowPercent}%)</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-danger" />
              <span className="font-medium text-danger">{outOfStockCount} Out of Stock</span>
              <span className="text-muted">({outPercent}%)</span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-[11px] text-muted">
          <span>Automatic thresholds based on product reorder alerts</span>
          <span>{totalUnits} units total</span>
        </div>
      </div>
    </div>
  );
}
