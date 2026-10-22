import { formatMoney } from "@/lib/money";
import type { Sale } from "@/server/sales";
import { SalesIcon } from "@/components/icons";
import { panelClass, panelTitleClass } from "@/features/auth/ui";

export function SalesVisuals({
  sales,
  currency,
}: {
  sales: Sale[];
  currency: string;
}) {
  if (sales.length === 0) return null;

  const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0);
  const avgSale = Math.round(totalRevenue / sales.length);
  const recentSales = sales.slice(0, 10).reverse();
  const maxSale = Math.max(...recentSales.map((s) => s.total), 1);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* 1. Key Metrics Cards */}
      <div className="flex flex-col gap-4">
        <div className={`${panelClass} p-5 flex flex-col justify-between shadow-xs border-l-4 border-l-primary`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-muted tracking-wider">Total Sales Volume</span>
            <SalesIcon size={18} className="text-primary" />
          </div>
          <div className="mt-3">
            <p className="num text-2xl font-bold tracking-tight text-foreground">
              {formatMoney(totalRevenue, currency)}
            </p>
            <p className="mt-1 text-xs text-muted">Across {sales.length} confirmed orders</p>
          </div>
        </div>

        <div className={`${panelClass} p-5 flex flex-col justify-between shadow-xs border-l-4 border-l-emerald-500`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-muted tracking-wider">Average Order Value</span>
            <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              Per Customer
            </span>
          </div>
          <div className="mt-3">
            <p className="num text-2xl font-bold tracking-tight text-foreground">
              {formatMoney(avgSale, currency)}
            </p>
            <p className="mt-1 text-xs text-muted">Calculated average receipt size</p>
          </div>
        </div>
      </div>

      {/* 2. Visual Sales Trajectory Chart */}
      <div className={`${panelClass} p-5 sm:p-6 shadow-xs flex flex-col justify-between lg:col-span-2`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className={panelTitleClass}>Recent Sales Activity</h3>
            <p className="mt-0.5 text-xs text-muted">Transaction sizes for the last {recentSales.length} orders</p>
          </div>
          <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
            Realtime
          </span>
        </div>

        <div className="mt-6 flex h-36 items-end justify-between gap-2 border-b border-border pb-2 pt-4 px-2">
          {recentSales.map((s, idx) => {
            const heightPercent = Math.max(12, Math.round((s.total / maxSale) * 100));
            return (
              <div
                key={s.saleId}
                className="group relative flex flex-1 flex-col items-center justify-end h-full"
              >
                {/* Tooltip on hover */}
                <div className="absolute -top-9 z-20 hidden rounded-md bg-surface border border-border px-2 py-1 text-[11px] font-semibold text-foreground shadow-lg group-hover:block whitespace-nowrap">
                  {formatMoney(s.total, currency)} ({s.date})
                </div>
                <div
                  style={{ height: `${heightPercent}%` }}
                  className="w-full max-w-[28px] rounded-t-md bg-primary/30 border border-primary/50 border-b-0 transition-all group-hover:bg-primary/60"
                />
                <span className="mt-2 text-[10px] text-muted truncate max-w-full">
                  #{idx + 1}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-3 flex items-center justify-between text-[11px] text-muted">
          <span>Chronological order (oldest → newest)</span>
          <span className="num font-semibold text-foreground">Max: {formatMoney(maxSale, currency)}</span>
        </div>
      </div>
    </div>
  );
}
