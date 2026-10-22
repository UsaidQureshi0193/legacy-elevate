import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { requirePageBusiness } from "@/server/page-guards";
import { loadForecasts, listForecastSnapshots } from "@/server/ai/forecast";
import { getAiConfig } from "@/lib/env/server";
import { HORIZONS, parseHorizon } from "@/lib/forecast";
import { PageHeader, PageSkeleton } from "@/features/workspace/page-header";
import { ForecastKpis } from "@/features/forecast/forecast-kpis";
import { ForecastCharts } from "@/features/forecast/forecast-charts";
import { ForecastFinancials } from "@/features/forecast/forecast-financials";
import { ForecastSeasonality } from "@/features/forecast/forecast-seasonality";
import { ForecastTable } from "@/features/forecast/forecast-table";
import { ForecastExplain } from "@/features/forecast/forecast-explain";
import { Note } from "@/components/ui/note";
import { ForecastTabs } from "@/features/forecast/forecast-tabs";
import { emptyStateClass } from "@/features/auth/ui";

export const metadata: Metadata = { title: "Business Forecast — Elevate" };

type Params = Promise<{ businessId: string }>;
type SearchParams = Promise<Record<string, string | string[] | undefined>>;

async function ForecastContent({ params, searchParams }: { params: Params; searchParams: SearchParams }) {
  const { businessId } = await params;
  const query = await searchParams;
  const business = await requirePageBusiness(businessId);
  const horizon = parseHorizon(query.horizon);

  const [{ businessForecast }, savedSnapshots] = await Promise.all([
    loadForecasts(business, horizon),
    listForecastSnapshots(businessId, 6),
  ]);

  const hasProducts = businessForecast.products.length > 0;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Business Forecast & Projections"
        description="Estimates, not guarantees. Combines your recorded sales, inventory, expenses, and Pakistan seasonal demand cycles."
        actions={
          <nav aria-label="Forecast horizon" className="flex gap-1 bg-surface-muted p-1 rounded-xl border border-border">
            {HORIZONS.map((h) => (
              <Link
                key={h}
                href={`/dashboard/${businessId}/forecast?horizon=${h}`}
                aria-current={h === horizon ? "page" : undefined}
                className={`inline-flex h-9 items-center rounded-lg px-3 text-xs font-semibold transition ${
                  h === horizon
                    ? "bg-surface text-foreground shadow-xs font-bold"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {h} days
              </Link>
            ))}
          </nav>
        }
      />

      <Note title="Estimates, not guarantees:">
        Projections assume current operational velocity and recorded cost structures. Unrecorded overheads or market
        shifts may alter actual outcomes.
      </Note>

      {!hasProducts ? (
        <p className={emptyStateClass}>
          No products found. Add products to your inventory and record sales transactions to generate business forecasts.
        </p>
      ) : (
        <ForecastTabs
          tabs={[
            {
              id: "overview",
              label: "Overview & Trends",
              content: (
                <>
                  <ForecastKpis forecast={businessForecast} currency={business.currency} />
                  <ForecastCharts forecast={businessForecast} currency={business.currency} />
                </>
              ),
            },
            {
              id: "demand",
              label: "Product Demand & Restock",
              content: (
                <>
                  <ForecastTable products={businessForecast.products} horizon={horizon} />
                  <ForecastSeasonality seasonality={businessForecast.seasonality} horizon={horizon} />
                </>
              ),
            },
            {
              id: "financial",
              label: "Financial Projections",
              content: <ForecastFinancials forecast={businessForecast} currency={business.currency} />,
            },
            {
              id: "advisor",
              label: "AI Strategic Advisor",
              content: (
                <ForecastExplain
                  businessId={businessId}
                  horizon={horizon}
                  configured={getAiConfig() !== null}
                  savedSnapshots={savedSnapshots}
                />
              ),
            },
          ]}
        />
      )}
    </div>
  );
}

export default function ForecastPage({ params, searchParams }: { params: Params; searchParams: SearchParams }) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <ForecastContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}
