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
import { Budget2027Update } from "@/app/blog/_shared/budget-2027-update";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Family Reunification Calculator | Malta 2026",
  description:
    "Malta family reunification calculator: salary needed under S.L. 217.06 (€30,876 for one) and the Family Member Policy, plus KEI/SEI and waiting period checks.",
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
    "Malta family reunification waiting period",
    "Malta SEI family members",
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
        description="Calculate minimum salary requirements for sponsoring family members to Malta under Family Reunification (S.L. 217.06) or the Family Member Policy, check waiting periods by permit type (Single Permit, KEI, SEI, Blue Card) and test your salary against each route."
        slug="family-reunification"
        category="Immigration Calculator"
        features={[
          "Family Reunification (S.L. 217.06) salary calculation",
          "Family Member Policy salary calculation",
          "KEI / Specialist Employee Initiative enhanced threshold",
          "Waiting period check by permit type (Single Permit, KEI, SEI, Blue Card)",
          "Salary eligibility test with net income estimate",
          "NSO 2025 median projection for the Family Member Policy",
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
              "Under S.L. 217.06 (Family Reunification) you need the NSO Labour Force Survey average gross basic wage (€25,730 for 2025) plus 20% for each family member — €30,876 for one family member. Under the Family Member Policy your net income must reach Identità's median wage figure (€18,940) plus 20% of it for each family member — €22,728 net for one. Net means gross income minus income tax and social security contributions.",
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
              "Under S.L. 217.06 you need approximately €36,022 gross/year (€3,002/month). Under the Family Member Policy you need approximately €26,516 net/year (€2,210/month), which is roughly €33,200 gross for a sponsor on married tax rates.",
          },
          {
            question:
              "How long do I have to wait before bringing my family to Malta?",
            answer:
              "Under the Family Member Policy you must wait 12 months from the date your first residence permit was issued. Under S.L. 217.06 Identità requires 2 years of lawful residence. Key Employee Initiative (KEI) and Specialist Employee Initiative (SEI) holders with an Approval in Principle can bring their spouse and children immediately if they earn at least €50,000 gross (+€6,000 per extra dependant). EU Blue Card holders have no waiting period.",
          },
          {
            question:
              "Can SEI permit holders bring their children to Malta straight away?",
            answer:
              "Only if they meet the family fast-track income of €50,000 gross for the sponsor plus one dependant (+€6,000 for each additional dependant), hold an Approval in Principle, have €100,000 health cover per dependant and have applied for a private school place for school-age children. The SEI permit itself only requires €30,000 gross, so many SEI holders must wait the standard 12 months and use the Family Member Policy.",
          },
          {
            question: "Will the Family Member Policy threshold go up?",
            answer:
              "Probably. Identità still quotes a median wage of €18,940, but NSO has since published a 2025 median annual basic salary of €22,266. Identità says the figure is reviewed when NSO publishes a new median. If it adopts the 2025 figure, the net requirement for one family member would rise from €22,728 to about €26,719.",
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
              "Key Employee Initiative and Specialist Employee Initiative holders with an approval-in-principle letter may apply under the Family Member Policy without serving the 12-month sponsor tenure if their gross annual income meets the enhanced threshold: €50,000 for the sponsor plus one dependent, and €6,000 for each additional dependent. Each dependant also needs €100,000 health insurance, and school-age children need a private school application.",
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
          <Budget2027Update
            title="Budget 2027: new costs for TCN families"
            href="/blog/malta-budget-2027-third-country-nationals"
            linkLabel="Read the Budget 2027 TCN guide"
            items={[
              "From 2027: €400 yearly infrastructure contribution per adult permit holder, no free public transport and no free childcare for new registrations",
            ]}
          />
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
