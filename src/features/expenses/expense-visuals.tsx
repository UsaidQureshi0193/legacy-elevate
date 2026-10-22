import { formatMoney } from "@/lib/money";
import type { Expense } from "@/server/expenses";
import { ExpensesIcon } from "@/components/icons";
import { panelClass, panelTitleClass } from "@/features/auth/ui";

export function ExpenseVisuals({
  expenses,
  currency,
}: {
  expenses: Expense[];
  currency: string;
}) {
  const activeExpenses = expenses.filter((e) => e.voidedAt === null);
  if (activeExpenses.length === 0) return null;

  const totalAmount = activeExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Group by category
  const categoriesMap = new Map<string, number>();
  for (const exp of activeExpenses) {
    const cat = exp.category.trim() || "General";
    categoriesMap.set(cat, (categoriesMap.get(cat) ?? 0) + exp.amount);
  }

  const categoryList = Array.from(categoriesMap.entries())
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: totalAmount > 0 ? Math.round((amount / totalAmount) * 100) : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  const topCategory = categoryList[0];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* 1. Summary Cards */}
      <div className="flex flex-col gap-4">
        <div className={`${panelClass} p-5 flex flex-col justify-between shadow-xs border-l-4 border-l-danger`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-muted tracking-wider">Total Running Expenses</span>
            <ExpensesIcon size={18} className="text-danger" />
          </div>
          <div className="mt-3">
            <p className="num text-2xl font-bold tracking-tight text-foreground">
              {formatMoney(totalAmount, currency)}
            </p>
            <p className="mt-1 text-xs text-muted">Across {activeExpenses.length} active records</p>
          </div>
        </div>

        {topCategory ? (
          <div className={`${panelClass} p-5 flex flex-col justify-between shadow-xs border-l-4 border-l-amber-500`}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-muted tracking-wider">Largest Expense Area</span>
              <span className="text-xs font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">
                {topCategory.percentage}% of total
              </span>
            </div>
            <div className="mt-3">
              <p className="text-lg font-bold tracking-tight text-foreground truncate">
                {topCategory.category}
              </p>
              <p className="num mt-1 text-xs font-semibold text-muted">
                {formatMoney(topCategory.amount, currency)}
              </p>
            </div>
          </div>
        ) : null}
      </div>

      {/* 2. Visual Category Distribution Bars */}
      <div className={`${panelClass} p-5 sm:p-6 shadow-xs flex flex-col justify-between lg:col-span-2`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className={panelTitleClass}>Category Breakdown</h3>
            <p className="mt-0.5 text-xs text-muted">Share of operational spending by category</p>
          </div>
          <span className="text-xs text-muted">{categoryList.length} categories</span>
        </div>

        <div className="mt-5 flex flex-col gap-3.5">
          {categoryList.slice(0, 5).map((item) => (
            <div key={item.category} className="flex flex-col gap-1.5">
              <div className="flex items-baseline justify-between text-xs">
                <span className="font-semibold text-foreground truncate max-w-[200px]">{item.category}</span>
                <span className="num text-muted">
                  <span className="font-bold text-foreground">{formatMoney(item.amount, currency)}</span> ({item.percentage}%)
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-surface-muted overflow-hidden">
                <div
                  style={{ width: `${Math.max(4, item.percentage)}%` }}
                  className="h-full rounded-full bg-danger/80 transition-all duration-500"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-[11px] text-muted">
          <span>Only active expenses shown (voided records excluded)</span>
          <span className="font-medium text-foreground">100% accounted</span>
        </div>
      </div>
    </div>
  );
}
