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
import { FirstTimeBuyerCalculator } from "./_components/first-time-buyer-calculator";
import {
  BreadcrumbJsonLd,
  CalculatorJsonLd,
  CustomFAQJsonLd,
} from "@/components/json-ld";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "First-Time Buyer Calculator Malta 2026 | Malta Calculator",
  description:
    "Add up Malta's first-time buyer benefits for 2026: stamp duty exemption on €200,000, the €10,000 grant, and UCA incentives up to €30,000. Free tool.",
  keywords: [
    "malta first time buyer calculator",
    "first time buyer scheme malta 2026",
    "stamp duty exemption €200000 malta",
    "€10000 grant first time buyer malta",
    "UCA property grant malta",
    "deposit assistance scheme malta",
    "first home malta benefits",
    "gozo first time buyer grant",
  ],
  alternates: pageAlternates("/calculators/first-time-buyer"),
  openGraph: {
    ...ogMetadata,
    title: "First-Time Buyer Calculator Malta 2026 | Malta Calculator",
    url: `${SITE_URL}/calculators/first-time-buyer`,
    images: [getDynamicOgImage("First-Time Buyer Calculator Malta 2026")],
  },
  twitter: {
    ...twitterMetadata,
    title: "First-Time Buyer Calculator Malta 2026 | Malta Calculator",
    images: [getDynamicOgImage("First-Time Buyer Calculator Malta 2026")],
  },
};

export default function FirstTimeBuyerPage() {
  return (
    <MarketingLayout>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Calculators", url: `${SITE_URL}/calculators` },
          {
            name: "First-Time Buyer Calculator",
            url: `${SITE_URL}/calculators/first-time-buyer`,
          },
        ]}
      />
      <CalculatorJsonLd
        name="First-Time Buyer Calculator Malta"
        description="Calculate the combined value of Malta's first-time buyer incentives: stamp duty exemption, the €10,000 grant, and UCA/vacant property benefits."
        slug="first-time-buyer"
        category="Property Calculator"
        features={[
          "Stamp duty exemption on first €200,000 (permanent)",
          "€10,000 grant over 10 years",
          "UCA/vacant property exemption to €750,000",
          "€15,000 / €30,000 (Gozo) UCA cash grants",
          "Deposit Assistance Scheme eligibility check",
        ]}
      />
      <CustomFAQJsonLd
        questions={[
          {
            question:
              "What benefits do first-time buyers get in Malta in 2026?",
            answer:
              "First-time buyers in Malta get a stamp duty exemption on the first €200,000 of the property value (made permanent in Budget 2026), a €10,000 cash grant paid as €1,000 per year for 10 years for properties bought with a bank loan, and — for UCA or long-vacant properties — a duty exemption up to €750,000 plus cash grants of €15,000 in Malta or €30,000 in Gozo.",
          },
          {
            question:
              "How much stamp duty does a first-time buyer save in Malta?",
            answer:
              "The exemption on the first €200,000 saves up to €10,000 (5% × €200,000). For a €300,000 property, a first-time buyer pays duty only on €100,000 — €5,000 instead of €15,000. For qualifying UCA or vacant properties the exemption extends to the first €750,000.",
          },
          {
            question: "Who qualifies for the €10,000 first-time buyer grant?",
            answer:
              "Buyers acquiring their first primary residence in Malta or Gozo with a bank loan, for purchases made between 1 January 2024 and 31 December 2026. The grant is paid in ten yearly instalments of €1,000 by the Commissioner for Tax and Customs.",
          },
          {
            question: "What is the Deposit Assistance Scheme in Malta?",
            answer:
              "A Housing Authority scheme helping buyers under 40 who can afford a loan but lack the 10% deposit: the government guarantees and finances the deposit through participating banks. From Budget 2026 it applies to properties valued up to €250,000.",
          },
          {
            question: "What counts as a UCA property in Malta?",
            answer:
              "Properties within an Urban Conservation Area, properties vacant for more than 7 years (commonly cited as long-vacant older stock), or new properties built in traditional Maltese style. These qualify for the extended duty exemption, the €15,000/€30,000 grant for first-time buyers, and a VAT refund of up to €54,000 on restoration costs.",
          },
        ]}
      />
      <main role="main" aria-label="First-Time Buyer Calculator">
        <BackButton href="/calculators" />
        <Shell className="max-w-4xl py-8">
          <FirstTimeBuyerCalculator />
          <RelatedGuide
            href="/blog/malta-first-time-buyer-scheme-2026"
            title="Malta First-Time Buyer Scheme 2026"
            description="Full eligibility rules, application steps and deadlines for every first-time buyer incentive."
          />
        </Shell>
      </main>
    </MarketingLayout>
  );
}

export const revalidate = false; // tamamen statik (build-time)
export const dynamic = "force-static"; // bu segmenti statik olmaya zorla
