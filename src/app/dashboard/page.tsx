import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { listBusinessesForUser, type Business } from "@/server/businesses";
import { requirePageUser } from "@/server/page-guards";
import { ArrowRightIcon, CheckIcon, PlusIcon } from "@/components/icons";
import { WorkspaceHeader } from "@/features/workspace/workspace-header";
import { PageSkeleton } from "@/features/workspace/page-header";

export const metadata: Metadata = { title: "Your businesses — Elevate" };

function BusinessCard({ business }: { business: Business }) {
  const initial = (business.name.trim()[0] ?? "?").toUpperCase();
  return (
    <li>
      <Link
        href={`/dashboard/${business.businessId}`}
        className="group flex h-full min-h-48 flex-col justify-between gap-5 rounded-2xl border border-border bg-surface p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-control hover:shadow-xl"
      >
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex size-11 items-center justify-center rounded-xl bg-primary text-lg font-bold text-primary-foreground">
            {initial}
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-medium text-muted">
            <CheckIcon size={14} />
            Active
          </span>
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            {business.businessType ? (
              <span className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted">
                {business.businessType}
              </span>
            ) : null}
          </div>
          <h2 className="mt-2 text-lg font-bold">{business.name}</h2>
          <p className="mt-1 text-sm text-muted">
            {business.currency}
            {business.createdAt ? (
              <>
                {" · Since "}
                <span className="num">{business.createdAt.slice(0, 10)}</span>
              </>
            ) : null}
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-sm font-semibold">
          Launch Workspace
          <ArrowRightIcon className="transition-transform group-hover:translate-x-1" />
        </span>
      </Link>
    </li>
  );
}

async function DashboardContent() {
  const user = await requirePageUser("/dashboard");
  const businesses = await listBusinessesForUser(user.uid);
  if (businesses.length === 0) redirect("/onboarding");
  const firstName = user.name?.trim().split(/\s+/)[0];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-xl">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {firstName ? `Welcome back, ${firstName}` : "Your businesses"}
          </h1>
          <p className="mt-1.5 text-sm text-muted">
            Select a business workspace to manage inventory, sales and forecasts, or add a new shop.
            Each workspace is private to your account.
          </p>
        </div>
        <Link
          href="/onboarding?new=true"
          className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:brightness-105 transition"
        >
          <PlusIcon />
          Register New Business
        </Link>
      </div>
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {businesses.map((business) => (
          <BusinessCard key={business.businessId} business={business} />
        ))}
        <li>
          <Link
            href="/onboarding?new=true"
            className="flex h-full min-h-48 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border p-6 text-center text-muted transition-all hover:border-primary hover:text-foreground hover:bg-surface-muted/30"
          >
            <PlusIcon size={22} className="text-primary" />
            <span className="text-sm font-semibold">Add Another Business</span>
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <>
      <WorkspaceHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pt-28 pb-16 sm:px-6">
        <Suspense fallback={<PageSkeleton />}>
          <DashboardContent />
        </Suspense>
      </main>
    </>
  );
}
