import { MarketingLayout } from "@/components/layout/marketing-layout";
import { Shell } from "@/components/dashboard/shell";
import { BackButton } from "@/components/layout/back-button";
import { RelatedGuide } from "@/components/marketing/related-guide";
import { RelatedCalculators } from "@/components/marketing/related-calculators";
import type { Metadata } from "next";
import {
  defaultMetadata,
  ogMetadata,
  twitterMetadata,
  SITE_URL,
  pageAlternates,
  getDynamicOgImage,
} from "@/app/shared-metadata";
import { TcnBudget2027Calculator } from "./_components/tcn-budget-2027-calculator";
import {
  BreadcrumbJsonLd,
  CalculatorJsonLd,
  CustomFAQJsonLd,
} from "@/components/json-ld";

const TITLE = "TCN Budget 2027 Cost Calculator Malta | Malta Calculator";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: TITLE,
  description:
    "Work out what Malta's Budget 2027 costs you as a non-EU worker: €800 permit fee, €400 yearly infrastructure contribution, €83/month licence fee, transport.",
  keywords: [
    "malta budget 2027 tcn",
    "malta work permit fee 2027",
    "malta infrastructure contribution €400",
    "malta third country nationals 2027",
    "malta €83 driving licence fee",
    "malta free public transport tcn",
    "malta free childcare tcn 2027",
    "single permit cost malta 2027",
  ],
  alternates: pageAlternates("/calculators/tcn-budget-2027"),
  openGraph: {
    ...ogMetadata,
    title: TITLE,
    url: `${SITE_URL}/calculators/tcn-budget-2027`,
    images: [getDynamicOgImage("TCN Budget 2027 Cost Calculator")],
  },
  twitter: {
    ...twitterMetadata,
    title: TITLE,
    images: [getDynamicOgImage("TCN Budget 2027 Cost Calculator")],
  },
};

export default function TcnBudget2027Page() {
  return (
    <MarketingLayout>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Calculators", url: `${SITE_URL}/calculators` },
          {
            name: "TCN Budget 2027 Cost Calculator",
            url: `${SITE_URL}/calculators/tcn-budget-2027`,
          },
        ]}
      />
      <CalculatorJsonLd
        name="TCN Budget 2027 Cost Calculator Malta"
        description="Estimate the extra yearly cost of Malta's Budget 2027 measures for third-country nationals: permit fees, infrastructure contribution, driving licence fee, transport and childcare."
        slug="tcn-budget-2027"
        category="Immigration Calculator"
        features={[
          "€600 → €800 work permit application fee",
          "€400 yearly infrastructure contribution per adult",
          "€83/month Category B/B1 driving licence fee with exemptions",
          "Loss of free public transport and atypical hours cheque",
          "Childcare cost for new registrations",
        ]}
      />
      <CustomFAQJsonLd
        questions={[
          {
            question: "How much does a Malta work permit cost from 2027?",
            answer:
              "Budget 2027 raises the fee for a new single permit (work permit) application from €600 to €800 and adds a new €400 annual infrastructure contribution on both new applications and renewals. The renewal fee itself is €150. Under-18s are exempt from the €400 contribution.",
          },
          {
            question: "Who has to pay the €83 monthly driving licence fee?",
            answer:
              "Third-country nationals holding a Category B or B1 Maltese licence issued or renewed from 2027. EU/EEA citizens, long-term residents and their spouses, UK, Australian and UAE citizens, and people whose permit is for a driving job are reported as exempt. €83 a month equals €996 a year.",
          },
          {
            question:
              "Do third-country nationals still get free public transport in Malta?",
            answer:
              "From 1 January 2027 free public transport with a personalised Tallinja card is limited to Maltese and Gozitan citizens, resident EU citizens and long-term residents. Other third-country nationals pay standard fares.",
          },
          {
            question: "Will my child lose free childcare in 2027?",
            answer:
              "Children already in the Free Childcare Scheme keep their place while they remain eligible. From 2027 new registrations are limited to Maltese, EU citizens and long-term residents, so other third-country national families registering a new child will pay the centre's fee.",
          },
          {
            question: "Are these Budget 2027 measures already law?",
            answer:
              "Not yet. They were announced in the Budget speech on 26 October 2026 and take effect from 1 January 2027 once the implementing legal notices are published. Amounts and exemptions can still be adjusted.",
          },
        ]}
      />
      <main role="main" aria-label="TCN Budget 2027 Cost Calculator">
        <BackButton href="/calculators" />
        <Shell className="max-w-4xl py-8">
          <TcnBudget2027Calculator />
          <RelatedGuide
            href="/blog/malta-budget-2027-third-country-nationals"
            title="Budget 2027 for Third-Country Nationals: What Changes"
            description="Every new fee and lost benefit for non-EU workers in Malta, with dates, exemptions and examples."
          />
          <RelatedCalculators slug="tcn-budget-2027" />
        </Shell>
      </main>
    </MarketingLayout>
  );
}

export const revalidate = false; // tamamen statik (build-time)
export const dynamic = "force-static"; // bu segmenti statik olmaya zorla
