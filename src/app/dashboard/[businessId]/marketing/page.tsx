import { Suspense } from "react";
import type { Metadata } from "next";
import { requirePageBusiness } from "@/server/page-guards";
import { getAiConfig } from "@/lib/env/server";
import { PageHeader, PageSkeleton } from "@/features/workspace/page-header";
import { MarketingForm } from "@/features/marketing/marketing-form";

export const metadata: Metadata = { title: "Marketing — Elevate" };

type Params = Promise<{ businessId: string }>;

async function MarketingContent({ params }: { params: Params }) {
  const { businessId } = await params;
  await requirePageBusiness(businessId);
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Marketing assistant"
        description="Promotional messages, seasonal plans and retention ideas in English, Urdu or Roman Urdu."
      />
      <MarketingForm businessId={businessId} configured={getAiConfig() !== null} />
    </div>
  );
}

export default function MarketingPage({ params }: { params: Params }) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <MarketingContent params={params} />
    </Suspense>
  );
}
