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
  pageAlternates,
  getDynamicOgImage,
} from "@/app/shared-metadata";
import { SickLeaveCalculator } from "./_components/sick-leave-calculator";
import {
  BreadcrumbJsonLd,
  CalculatorJsonLd,
  CustomFAQJsonLd,
} from "@/components/json-ld";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Sick Leave Calculator Malta 2026 | Malta Calculator",
  description:
    "Calculate sick pay in Malta: employer full-pay days plus the 2026 sickness benefit (€25.81 or €17.21 daily) from the 4th day, capped at 156 days a year.",
  keywords: [
    "malta sick leave calculator",
    "sickness benefit malta 2026",
    "sick pay malta",
    "sick leave entitlement malta",
    "sickness benefit daily rate malta",
    "156 days sickness benefit",
    "wage regulation order sick leave",
    "blue form malta sick",
  ],
  alternates: pageAlternates("/calculators/sick-leave"),
  openGraph: {
    ...ogMetadata,
    title: "Sick Leave Calculator Malta 2026 | Malta Calculator",
    url: `${SITE_URL}/calculators/sick-leave`,
    images: [getDynamicOgImage("Sick Leave Calculator Malta 2026")],
  },
  twitter: {
    ...twitterMetadata,
    title: "Sick Leave Calculator Malta 2026 | Malta Calculator",
    images: [getDynamicOgImage("Sick Leave Calculator Malta 2026")],
  },
};

export default function SickLeavePage() {
  return (
    <MarketingLayout>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Calculators", url: `${SITE_URL}/calculators` },
          {
            name: "Sick Leave Calculator",
            url: `${SITE_URL}/calculators/sick-leave`,
          },
        ]}
      />
      <CalculatorJsonLd
        name="Sick Leave Calculator Malta"
        description="Estimate income while off sick in Malta: employer-paid sick days at full wage plus the social security sickness benefit at 2026 daily rates."
        slug="sick-leave"
        category="Employment Calculator"
        features={[
          "Employer full-pay sick days (WRO adjustable)",
          "2026 sickness benefit rates (€25.81 / €17.21 daily)",
          "3 waiting days and 156-day annual cap",
          "Income loss vs full salary",
          "Increased benefit after 156 continuous days",
        ]}
      />
      <CustomFAQJsonLd
        questions={[
          {
            question: "How many paid sick days do I get in Malta?",
            answer:
              "The statutory minimum for most employees is 2 working weeks (10 days) of sick leave on full pay per year. However, many sector Wage Regulation Orders grant considerably more — some sectors get additional weeks at full or half pay. Check your WRO or employment contract for your exact entitlement.",
          },
          {
            question: "How much is the sickness benefit in Malta in 2026?",
            answer:
              "The 2026 sickness benefit is €25.81 per day for a married person maintaining a spouse not in full-time employment, and €17.21 per day for single persons or those whose spouse works full-time. After 156 continuous benefit days, the claim converts to the Increased Sickness Benefit of €34.42/€25.81 per day.",
          },
          {
            question:
              "When does the sickness benefit start being paid in Malta?",
            answer:
              "Sickness benefit is paid from the 4th day of sickness — the first 3 days are waiting days with no benefit. You need a medical certificate (the blue form) from the first day, submitted to the Department of Social Security within 10 days, normally via mysocialsecurity.gov.mt.",
          },
          {
            question: "How long can I receive sickness benefit in Malta?",
            answer:
              "Sickness benefit is payable for a maximum of 156 days in a calendar year. Longer continuous claims convert to the Increased Sickness Benefit, and extended incapacity may qualify for invalidity pension instead.",
          },
          {
            question:
              "Does my employer pay full salary while I am sick in Malta?",
            answer:
              "During your sick leave entitlement, yes — your employer pays your full wage (often less the sickness benefit amount, which the employer may recover). Once your employer-paid entitlement is exhausted, your income drops to the social security sickness benefit only, which this calculator shows.",
          },
        ]}
      />
      <main role="main" aria-label="Sick Leave Calculator">
        <BackButton href="/calculators" />
        <Shell className="max-w-4xl py-8">
          <SickLeaveCalculator />
          <RelatedGuide
            href="/blog/malta-mysocialsecurity-app-guide-2026"
            title="mySocialSecurity Malta App 2026: Complete Guide"
            description="How to submit sickness benefit claims, medical certificates and track payments online."
          />
        </Shell>
      </main>
    </MarketingLayout>
  );
}

export const revalidate = false; // tamamen statik (build-time)
export const dynamic = "force-static"; // bu segmenti statik olmaya zorla
