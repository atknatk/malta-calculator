import { MarketingLayout } from "@/components/layout/marketing-layout";
import { Shell } from "@/components/dashboard/shell";
import { BackButton } from "@/components/layout/back-button";
import { RelatedGuide } from "@/components/marketing/related-guide";
import { RelatedCalculators } from "@/components/marketing/related-calculators";
import { AffiliateCard } from "@/components/affiliate/affiliate-card";
import type { Metadata } from "next";
import {
  defaultMetadata,
  ogMetadata,
  twitterMetadata,
  SITE_URL,
  pageAlternates,
} from "@/app/shared-metadata";
import { FamilyReunificationCalculator } from "./_components/family-reunification-calculator";
import {
  BreadcrumbJsonLd,
  CalculatorJsonLd,
  CustomFAQJsonLd,
} from "@/components/json-ld";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Family Reunification Calculator | Malta 2026",
  description:
    "Malta family reunification calculator: minimum salary for S.L. 217.06 (gross average wage + 20%) and the Family Member Policy (€18,940 net + 20%). Includes the KEI/Specialist enhanced threshold (€50,000 + €6,000 per dependent).",
  keywords: [
    "Malta family reunification",
    "Malta family visa",
    "Malta family member policy",
    "Malta sponsor family",
    "Malta immigration salary",
    "Malta family permit",
    "Malta residence permit family",
    "Identità family reunification",
    "Malta KEI family threshold",
    "Malta dependent adult sponsor",
    "Malta median wage 2024",
  ],
  alternates: pageAlternates("/calculators/family-reunification"),
  openGraph: {
    ...ogMetadata,
    title: "Family Reunification Calculator Malta 2026",
    description:
      "Calculate minimum salary requirements for sponsoring family members in Malta",
    url: `${SITE_URL}/calculators/family-reunification`,
  },
  twitter: {
    ...twitterMetadata,
    title: "Family Reunification Calculator Malta 2026",
  },
};

export default function FamilyReunificationPage() {
  return (
    <MarketingLayout>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Calculators", url: `${SITE_URL}/calculators` },
          {
            name: "Family Reunification",
            url: `${SITE_URL}/calculators/family-reunification`,
          },
        ]}
      />
      <CalculatorJsonLd
        name="Family Reunification Calculator Malta"
        description="Calculate minimum salary requirements for sponsoring family members to Malta under Family Reunification (S.L. 217.06) or the Family Member Policy, including the KEI/Specialist Employee Initiative enhanced threshold."
        slug="family-reunification"
        category="Immigration Calculator"
        features={[
          "Family Reunification (S.L. 217.06) salary calculation",
          "Family Member Policy salary calculation",
          "KEI / Specialist Employee Initiative enhanced threshold",
          "Gross and net income requirements explained",
          "Monthly and weekly breakdown",
          "Scheme comparison tool",
          "Support for up to 10 family members",
        ]}
      />
      <CustomFAQJsonLd
        questions={[
          {
            question:
              "What is the minimum salary for family reunification in Malta?",
            answer:
              "Under S.L. 217.06 (Family Reunification) you need the NSO average gross wage (€24,976 in 2025) plus 20% for each family member sponsored. Under the Family Member Policy you need €18,940 net (Identità reference, June 2024) plus 20% of the median wage for each family member. Net here means gross income minus income tax and social security contributions.",
          },
          {
            question:
              "What is the difference between Family Reunification (S.L. 217.06) and the Family Member Policy?",
            answer:
              "S.L. 217.06 is the statutory pathway implementing EU Directive 2003/86/EC and only covers your spouse (21+) and unmarried minor children. The Family Member Policy is an ex-gratia route managed by Identità that additionally covers dependent unmarried adult relatives (e.g. an elderly parent) where dependency is documented. The income basis also differs — gross average wage versus net median wage.",
          },
          {
            question:
              "How much salary do I need to sponsor 2 family members in Malta?",
            answer:
              "Under S.L. 217.06 you need approximately €34,966 gross/year (€2,914/month). Under the Family Member Policy you need approximately €26,516 net/year (€2,210/month).",
          },
          {
            question: "Who can I sponsor for family reunification in Malta?",
            answer:
              "Under S.L. 217.06 (Reg. 4) only your spouse (21+, monogamous marriage) and unmarried minor children — adult children and parents are not eligible. Under the Family Member Policy, Identità additionally recognises dependent unmarried adult family members where you can document financial or physical dependency.",
          },
          {
            question:
              "What is the KEI threshold for sponsoring family members in Malta?",
            answer:
              "Key Employee Initiative and Specialist Employee Initiative holders with an approval-in-principle letter may apply under the Family Member Policy without serving the 12-month sponsor tenure if their gross annual income meets the enhanced threshold: €50,000 for the sponsor plus one dependent, and €6,000 for each additional dependent.",
          },
          {
            question:
              "What income counts toward the Family Member Policy threshold?",
            answer:
              "Identità accepts employment income, social benefits (old-age pension, sickness, disability, family allowances), property rental income, unemployment and housing benefits, and regular cash transfers, provided the income is declared with the Commissioner of Revenue. The figure used is net — gross income minus income tax and social security contributions.",
          },
          {
            question:
              "Does a Family Member Policy permit grant the right to work in Malta?",
            answer:
              "No. A Family Member Policy residence permit does not by itself confer employment rights — the family member must apply separately for a Single Permit if they wish to work in Malta.",
          },
          {
            question: "Who is excluded from the Family Member Policy?",
            answer:
              "EU/EEA/Swiss citizens, refugees and beneficiaries of subsidiary protection, holders of Specific Residence Authorisation (SRA) status, and holders of certain other residence documents issued under Maltese law fall outside the Family Member Policy and are covered by separate legal frameworks.",
          },
        ]}
      />
      <main role="main" aria-label="Family Reunification Calculator">
        <BackButton href="/calculators" />
        <Shell className="max-w-4xl py-8">
          <FamilyReunificationCalculator />
          <RelatedGuide
            href="/blog/malta-family-reunification-guide-2026"
            title="Malta Family Reunification Guide 2026"
            description="Complete guide to sponsoring family members in Malta with salary requirements and procedures."
          />
          <AffiliateCard slug="family-reunification" />
          <RelatedCalculators slug="family-reunification" />
        </Shell>
      </main>
    </MarketingLayout>
  );
}

export const revalidate = false;
export const dynamic = "force-static";
