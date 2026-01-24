import { MarketingLayout } from "@/components/layout/marketing-layout";
import { Hero } from "@/components/marketing/hero";
import { MenuBox } from "@/components/marketing/menu-box";
import {
  FAQPageJsonLd,
  OrganizationJsonLd,
  WebApplicationJsonLd,
} from "@/components/json-ld";
import type { Metadata } from "next";
import {
  defaultMetadata,
  ogMetadata,
  twitterMetadata,
  SITE_URL,
} from "./shared-metadata";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Malta Salary Calculator 2026 | Free Tax, SSC & Net Pay Calculator",
  description:
    "Calculate your Malta net salary for free. Accurate 2024-2026 tax brackets, SSC contributions, and COLA. Instant results for single, married, and parent taxpayers. The most trusted Malta salary calculator.",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    ...ogMetadata,
    url: SITE_URL,
  },
  twitter: {
    ...twitterMetadata,
  },
};

export default function Home() {
  return (
    <MarketingLayout>
      {/* Structured Data for SEO */}
      <WebApplicationJsonLd />
      <FAQPageJsonLd />
      <OrganizationJsonLd />

      <main role="main" aria-label="Malta Salary Calculator Homepage">
        <div className="grid gap-8">
          <Hero />
          <MenuBox />
        </div>
      </main>
    </MarketingLayout>
  );
}
