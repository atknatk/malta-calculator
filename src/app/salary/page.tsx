import { SalaryCalculatorServer } from "./_components/salary-calculator-server";
import SalaryPlaygroundCards from "./_components/play-ground-cart";
import { salaryParamsCache } from "./search-params";
import { BreadcrumbJsonLd } from "@/components/json-ld";
import type { SearchParams } from "nuqs/server";
import type { Metadata } from "next";
import { SITE_URL } from "../shared-metadata";
import { AffiliateCard } from "@/components/affiliate/affiliate-card";

// Query params okudugu icin dynamic
export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export const metadata: Metadata = {
  robots: { index: false, follow: true },
  alternates: { canonical: SITE_URL },
};

// Mirrors /net-to-gross — SoftwareApplication structured data for the salary
// calculator surface. /salary itself is noindex (canonical → /), but the schema
// is harmless and keeps the two reverse-pair pages structurally symmetric.
const softwareJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Malta Salary Calculator",
  description:
    "Calculate your Malta net salary from a gross amount. 2024–2026 tax brackets, SSC contributions, COLA adjustments, per-month bonus support.",
  url: `${SITE_URL}/salary`,
  applicationCategory: "FinanceApplication",
  applicationSubCategory: "Salary",
  operatingSystem: "Web Browser",
  offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
  featureList: [
    "Gross to net salary calculation",
    "Malta 2024–2026 tax brackets",
    "SSC contributions",
    "COLA adjustments",
    "Per-month bonus support",
  ],
  inLanguage: "en",
  isAccessibleForFree: true,
};

/**
 * /salary?params... - Paylasilmis hesaplama URL'lerini destekler.
 * Ana sayfa (/) static kalir, bu sayfa dynamic olarak query params ile calisir.
 */
export default async function SalaryCalculatorPage({
  searchParams,
}: PageProps) {
  const params = await salaryParamsCache.parse(searchParams);

  return (
    <main role="main" aria-label="Malta Salary Calculator">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Salary Calculator", url: `${SITE_URL}/salary` },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
      />

      <div className="grid w-full grid-cols-1 gap-4 xs:grid-cols-2">
        <SalaryCalculatorServer initialParams={params}>
          <SalaryPlaygroundCards />
        </SalaryCalculatorServer>
      </div>

      <AffiliateCard slug="salary" />
    </main>
  );
}
