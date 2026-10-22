import { Suspense, type ReactNode } from "react";
import { requirePageBusiness, requirePageUser } from "@/server/page-guards";
import { AppShell, BusinessScope } from "@/features/workspace/app-shell";
import { UserMenu } from "@/features/workspace/user-menu";

/** Ownership-checked business name for the shell (same per-request lookup as the page). */
async function Scope({ params }: { params: Promise<{ businessId: string }> }) {
  const { businessId } = await params;
  const business = await requirePageBusiness(businessId);
  return (
    <BusinessScope
      name={business.name}
      detail={[business.businessType, business.currency].filter(Boolean).join(" · ")}
    />
  );
}

/** Verified session user for the account menu; only name and email reach the browser. */
async function Account({ params }: { params: Promise<{ businessId: string }> }) {
  const { businessId } = await params;
  const user = await requirePageUser(`/dashboard/${businessId}`);
  const name = user.name?.trim() || user.email?.split("@")[0] || "Account";
  return <UserMenu user={{ name, email: user.email }} businessId={businessId} />;
}

export default function BusinessLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ businessId: string }>;
}) {
  return (
    <AppShell
      scope={
        <Suspense fallback={<div className="h-10 w-32 rounded-full border border-border bg-surface" />}>
          <Scope params={params} />
        </Suspense>
      }
      account={
        <Suspense fallback={<div className="h-10 w-24 rounded-full border border-border bg-surface" />}>
          <Account params={params} />
        </Suspense>
      }
    >
      {children}
    </AppShell>
  );
}
