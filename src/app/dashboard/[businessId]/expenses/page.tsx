import { Suspense } from "react";
import type { Metadata } from "next";
import { requirePageBusiness } from "@/server/page-guards";
import { listExpensesForBusiness, type Expense } from "@/server/expenses";
import { formatMoney } from "@/lib/money";
import { PageHeader, PageSkeleton } from "@/features/workspace/page-header";
import { ExpenseForm } from "@/features/expenses/expense-form";
import { ExpenseVisuals } from "@/features/expenses/expense-visuals";
import { DeleteExpenseButton } from "@/features/expenses/delete-expense-button";
import { emptyStateClass, panelClass } from "@/features/auth/ui";

export const metadata: Metadata = { title: "Expenses — Elevate" };

function ExpenseList({
  businessId,
  expenses,
  currency,
}: {
  businessId: string;
  expenses: Expense[];
  currency: string;
}) {
  if (expenses.length === 0) {
    return (
      <p className={emptyStateClass}>
        No expenses recorded yet. Recording all costs keeps your profit figures
        honest.
      </p>
    );
  }
  return (
    <div className={`${panelClass} overflow-x-auto shadow-xs`}>
      <table className="w-full min-w-[640px] text-sm">
        <caption className="sr-only">Recorded expenses</caption>
        <thead>
          <tr className="border-b border-border bg-surface-muted/40 text-xs font-semibold tracking-wider text-muted uppercase">
            <th scope="col" className="px-5 py-3 text-left">Date</th>
            <th scope="col" className="px-4 py-3 text-left">Category</th>
            <th scope="col" className="px-4 py-3 text-left">Description</th>
            <th scope="col" className="px-4 py-3 text-right">Amount</th>
            <th scope="col" className="px-5 py-3 text-right">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60">
          {expenses.map((expense) => (
            <tr
              key={expense.expenseId}
              className={`transition-colors hover:bg-surface-muted/40 ${expense.voidedAt ? "opacity-60" : ""}`}
            >
              <td className="px-5 py-3.5 whitespace-nowrap">
                <span className="inline-block rounded-md border border-border bg-surface-muted px-2 py-0.5 font-mono text-xs text-muted">
                  {expense.date}
                </span>
              </td>
              <td className="px-4 py-3.5 whitespace-nowrap">
                <span className="inline-flex items-center rounded-full border border-border bg-surface px-2.5 py-0.5 text-xs font-semibold text-foreground shadow-2xs">
                  {expense.category}
                </span>
              </td>
              <td className="px-4 py-3.5 text-muted">
                <span>{expense.description ?? "—"}</span>
                {expense.voidReason ? (
                  <span className="ml-1 text-xs text-destructive">({expense.voidReason})</span>
                ) : null}
              </td>
              <td
                className="px-4 py-3.5 text-right font-mono text-sm font-semibold tabular-nums"
              >
                <span className={expense.voidedAt ? "line-through text-muted" : "text-foreground"}>
                  {formatMoney(expense.amount, currency)}
                </span>
              </td>
              <td className="px-5 py-3.5 text-right whitespace-nowrap">
                {expense.voidedAt ? (
                  <span className="inline-flex items-center rounded-full border border-border bg-surface-muted px-2.5 py-0.5 text-xs font-medium text-muted">
                    Voided
                  </span>
                ) : (
                  <DeleteExpenseButton
                    businessId={businessId}
                    expenseId={expense.expenseId}
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

async function ExpensesContent({
  params,
}: {
  params: Promise<{ businessId: string }>;
}) {
  const { businessId } = await params;
  const business = await requirePageBusiness(businessId);
  const expenses = await listExpensesForBusiness(businessId);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Expenses"
        description="Rent, bills, salaries and other running costs. Recording every cost keeps your net profit honest. Stock you buy goes under Purchases."
      />
      <ExpenseForm
        businessId={businessId}
        currency={business.currency}
        timezone={business.timezone}
      />
      <ExpenseVisuals
        expenses={expenses}
        currency={business.currency}
      />
      <ExpenseList
        businessId={businessId}
        expenses={expenses}
        currency={business.currency}
      />
    </div>
  );
}

export default function ExpensesPage({
  params,
}: {
  params: Promise<{ businessId: string }>;
}) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <ExpensesContent params={params} />
    </Suspense>
  );
}
