import { MarketingLayout } from "@/components/layout/marketing-layout";
import type { Metadata } from "next";
import {
  defaultMetadata,
  ogMetadata,
  twitterMetadata,
  SITE_URL,
  pageAlternates,
} from "../shared-metadata";
import Link from "next/link";
import { BreadcrumbJsonLd, CollectionPageJsonLd } from "@/components/json-ld";
import { CALCULATORS, CALCULATOR_CATEGORIES } from "@/config/calculators";
import { CalculatorDirectory } from "./_components/calculator-directory";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "All Calculators | Malta Calculator",
  description:
    "All free financial calculators for Malta — salary, income tax, SSC, pension, mortgage, stamp duty, rental tax and more. Tools for residents and expats.",
  alternates: pageAlternates("/calculators"),
  openGraph: {
    ...ogMetadata,
    title: "All Calculators | Malta Calculator",
    url: `${SITE_URL}/calculators`,
  },
  twitter: {
    ...twitterMetadata,
    title: "All Calculators | Malta Calculator",
  },
};

// Hesaplayıcı verisi (isim/href/açıklama) tek kaynaktan: @/config/calculators
const groups = CALCULATOR_CATEGORIES.map((title) => ({
  title,
  items: CALCULATORS.filter((c) => c.category === title).map((c) => ({
    href: c.href,
    title: c.title,
    tagline: c.tagline,
  })),
}));

export default function CalculatorsPage() {
  // Prepare items for JSON-LD
  const allCalculators = CALCULATORS.map((item) => ({
    name: item.title,
    description: item.tagline,
    url: `${SITE_URL}${item.href}`,
  }));

  return (
    <MarketingLayout>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "All Calculators", url: `${SITE_URL}/calculators` },
        ]}
      />
      <CollectionPageJsonLd
        name="All Malta Calculators"
        description="Comprehensive financial calculation tools for Malta residents and workers. Salary, tax, mortgage, loan, vehicle, and more."
        url={`${SITE_URL}/calculators`}
        items={allCalculators}
      />
      <section className="flex w-full flex-col gap-2 pt-2 md:gap-2.5 md:pt-6 lg:gap-3 lg:pt-8">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-[13px] text-muted-foreground">
            <li>
              <Link href="/" className="hover:text-foreground hover:underline">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="font-medium text-foreground">
              All Calculators
            </li>
          </ol>
        </nav>
        <h1 className="mt-1 font-cal text-[34px] leading-[1.1] tracking-[-0.02em] md:mt-1.5 md:text-[40px] lg:mt-2 lg:text-5xl">
          All Malta Calculators
        </h1>
        <p className="max-w-[640px] text-base leading-normal text-muted-foreground md:text-[17px] md:leading-[1.55] lg:text-lg">
          <span className="md:hidden">
            Free financial tools for Malta residents and workers, updated for
            2026.
          </span>
          <span className="hidden md:inline">
            Comprehensive financial calculation tools for Malta residents and
            workers. Free, and updated for 2026.
          </span>
        </p>
      </section>

      <CalculatorDirectory groups={groups} />

      {/* İstatistik bandı: tasarımda yok, onaya kadar korunuyor */}
      <section
        aria-label="Calculator statistics"
        className="mt-12 grid w-full grid-cols-2 gap-6 rounded-2xl border bg-card p-6 text-center md:grid-cols-4 md:p-8 lg:mt-16"
      >
        {[
          [String(CALCULATORS.length), "Active Calculators"],
          [String(CALCULATOR_CATEGORIES.length), "Categories"],
          ["100%", "Malta 2026"],
          ["Free", "Forever"],
        ].map(([value, label]) => (
          <div key={label}>
            <div className="text-[28px] font-bold tabular-nums text-primary-ink md:text-3xl">
              {value}
            </div>
            <div className="text-sm text-muted-foreground">{label}</div>
          </div>
        ))}
      </section>
    </MarketingLayout>
  );
}

export const revalidate = false; // tamamen statik (build-time)
export const dynamic = "force-static"; // bu segmenti statik olmaya zorla
