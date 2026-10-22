import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { listBusinessesForUser } from "@/server/businesses";
import { requirePageUser } from "@/server/page-guards";
import { OnboardingForm } from "@/features/onboarding/onboarding-form";
import { WorkspaceHeader } from "@/features/workspace/workspace-header";

export const metadata: Metadata = { title: "Set up your business — Elevate" };

type Search = Promise<{ new?: string }>;

async function OnboardingContent({ searchParams }: { searchParams: Search }) {
  const user = await requirePageUser("/onboarding");
  const q = await searchParams;
  const businesses = await listBusinessesForUser(user.uid);
  const isAddingNew = q.new === "true";

  // If user already has businesses and didn't explicitly request to add a new one, redirect to dashboard
  if (businesses.length > 0 && !isAddingNew) {
    redirect("/dashboard");
  }

  const isAdditional = businesses.length > 0;

  return (
    <section>
      {isAdditional ? (
        <Link
          href="/dashboard"
          className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-foreground transition-colors"
        >
          ← Back to your businesses
        </Link>
      ) : null}
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
        {isAdditional ? "Add another business" : "Set up your business"}
      </h1>
      <p className="mt-1.5 text-sm text-muted">
        {isAdditional
          ? "Create an additional private workspace for your other shop, branch, or venture."
          : "This creates your private workspace. Only you can access it, and you can change these details later."}
      </p>
      <div className="mt-8 rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-xs">
        <OnboardingForm />
      </div>
    </section>
  );
}

export default function OnboardingPage({ searchParams }: { searchParams: Search }) {
  return (
    <>
      <WorkspaceHeader />
      <main className="mx-auto flex w-full max-w-[480px] flex-1 flex-col px-4 pt-28 pb-16">
        <Suspense fallback={<p className="text-sm text-muted">Loading…</p>}>
          <OnboardingContent searchParams={searchParams} />
        </Suspense>
      </main>
    </>
  );
}
