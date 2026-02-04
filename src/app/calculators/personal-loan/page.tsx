import { MarketingLayout } from "@/components/layout/marketing-layout";
import { Shell } from "@/components/dashboard/shell";
import { BackButton } from "@/components/layout/back-button";
import { RelatedGuide } from "@/components/marketing/related-guide";
import type { Metadata } from "next";
import {
  defaultMetadata,
  ogMetadata,
  twitterMetadata,
  SITE_URL,
} from "@/app/shared-metadata";
import { LoanCalculator } from "./_components/loan-calculator";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Personal Loan Calculator | Malta Calculator",
  description:
    "Calculate personal loan payments in Malta. Monthly payments, total interest, and repayment schedule. Free loan calculator.",
  keywords: [
    "Malta personal loan calculator",
    "Malta loan calculator",
    "personal loan Malta",
    "bank loan calculator Malta",
  ],
  alternates: { canonical: `${SITE_URL}/calculators/personal-loan` },
  openGraph: {
    ...ogMetadata,
    title: "Personal Loan Calculator | Malta Calculator",
    url: `${SITE_URL}/calculators/personal-loan`,
  },
  twitter: {
    ...twitterMetadata,
    title: "Personal Loan Calculator | Malta Calculator",
  },
};

export default function PersonalLoanPage() {
  return (
    <MarketingLayout>
      <main role="main" aria-label="Personal Loan Calculator">
        <BackButton href="/calculators" />
        <Shell className="max-w-5xl py-8">
          <LoanCalculator />
          <RelatedGuide
            href="/blog/malta-personal-loan-guide-2026"
            title="Malta Personal Loan Guide 2026"
            description="Everything about personal loans in Malta: rates, requirements, and bank comparisons."
          />
        </Shell>
      </main>
    </MarketingLayout>
  );
}

export const revalidate = false; // tamamen statik (build-time)
export const dynamic = "force-static"; // bu segmenti statik olmaya zorla
