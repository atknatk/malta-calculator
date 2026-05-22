import type { Metadata } from "next";
import type { SearchParams } from "nuqs/server";
import { SITE_URL } from "@/app/shared-metadata";
import { BreadcrumbJsonLd } from "@/components/json-ld";
import { NetToGrossCalculatorServer } from "./_components/net-to-gross-server";
import { netToGrossParamsCache } from "./search-params";

// Query params okudugu icin dynamic
export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<SearchParams>;
};

const title =
  "Malta Net to Gross Salary Calculator 2026 | Reverse Tax Calculator";
const description =
  "Calculate the gross salary needed to take home a specific net pay in Malta. Reverse salary calculator with 2026 tax brackets, SSC contributions, and COLA. Free, accurate, instant.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: `${SITE_URL}/net-to-gross`,
  },
  openGraph: {
    title,
    description,
    url: `${SITE_URL}/net-to-gross`,
  },
  twitter: {
    title,
    description,
  },
  robots: { index: true, follow: true },
};

const softwareJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Malta Net to Gross Salary Calculator",
  description,
  url: `${SITE_URL}/net-to-gross`,
  applicationCategory: "FinanceApplication",
  applicationSubCategory: "Salary",
  operatingSystem: "Web Browser",
  offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
  featureList: [
    "Reverse salary calculation (net → gross)",
    "Malta 2024–2026 tax brackets",
    "SSC contributions",
    "COLA adjustments",
    "Per-month bonus support",
  ],
  inLanguage: "en",
  isAccessibleForFree: true,
};

export default async function NetToGrossPage({ searchParams }: PageProps) {
  const params = await netToGrossParamsCache.parse(searchParams);

  return (
    <main role="main" aria-label="Malta Net to Gross Salary Calculator">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Net to Gross Salary", url: `${SITE_URL}/net-to-gross` },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
      />

      <div className="grid w-full grid-cols-1 gap-4 xs:grid-cols-2">
        <NetToGrossCalculatorServer initialParams={params} />
      </div>
    </main>
  );
}
