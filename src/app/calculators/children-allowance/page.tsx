import { MarketingLayout } from "@/components/layout/marketing-layout";
import type { Metadata } from "next";
import {
    defaultMetadata,
    ogMetadata,
    twitterMetadata,
    SITE_URL,
} from "@/app/shared-metadata";
import { Shell } from "@/components/dashboard/shell";
import { BackButton } from "@/components/layout/back-button";
import { RelatedGuide } from "@/components/marketing/related-guide";
import { ChildrenAllowanceCalculator } from "./_components/children-allowance-calculator";
import { BreadcrumbJsonLd, CalculatorJsonLd, CustomFAQJsonLd } from "@/components/json-ld";

export const metadata: Metadata = {
    ...defaultMetadata,
    title: "Children's Allowance Calculator Malta 2026 | Family Benefits",
    description:
        "Calculate your Malta Children's Allowance based on household income. Free calculator for families with children under 16. Includes birth bonus calculation.",
    keywords: [
        "Malta children's allowance",
        "Malta children's allowance calculator",
        "Malta family benefits",
        "children's allowance Malta 2026",
        "Malta child benefit",
        "children allowance calculator",
        "Malta social security children",
        "child birth bonus Malta",
        "Malta family allowance",
        "children under 16 Malta",
    ],
    alternates: {
        canonical: `${SITE_URL}/calculators/children-allowance`,
    },
    openGraph: {
        ...ogMetadata,
        title: "Children's Allowance Calculator Malta 2026",
        description:
            "Calculate your Malta Children's Allowance based on household income. Free calculator for families with children under 16.",
        url: `${SITE_URL}/calculators/children-allowance`,
    },
    twitter: {
        ...twitterMetadata,
        title: "Children's Allowance Calculator Malta 2026",
        description:
            "Calculate your Malta Children's Allowance based on household income. Free calculator for families with children under 16.",
    },
};

export default function ChildrenAllowancePage() {
    return (
        <MarketingLayout>
            <BreadcrumbJsonLd
                items={[
                    { name: "Home", url: SITE_URL },
                    { name: "Calculators", url: `${SITE_URL}/calculators` },
                    { name: "Children's Allowance", url: `${SITE_URL}/calculators/children-allowance` },
                ]}
            />
            <CalculatorJsonLd
                name="Children's Allowance Calculator Malta"
                description="Calculate your Malta Children's Allowance based on household income for children under 16 years of age."
                slug="children-allowance"
                category="Family Benefits Calculator"
                features={[
                    "Income-based allowance calculation",
                    "Multiple income source support",
                    "Child birth/adoption bonus calculator",
                    "Weekly, yearly, and quarterly payment breakdown",
                    "2026 rates and thresholds",
                    "SSC and tax deduction (2025 rules)",
                ]}
            />
            <CustomFAQJsonLd
                questions={[
                    {
                        question: "Who is eligible for Children's Allowance in Malta?",
                        answer: "Children's Allowance is awarded to married couples, civil union couples, cohabiting couples, single parents, or separated parents having care and custody of children under 16 years of age and whose household income meets the eligibility criteria.",
                    },
                    {
                        question: "What is the maximum Children's Allowance rate in Malta?",
                        answer: "The maximum weekly rate per child is €27.29, which applies when household net income is below €8,170. The minimum guaranteed rate is €8.66 per week per child.",
                    },
                    {
                        question: "How is Children's Allowance calculated in Malta?",
                        answer: "The rate is calculated based on the difference between €30,000 (maximum income threshold) and your actual net income. A 6.50% rate is applied to this difference, divided by 52 weeks. SSC and income tax are deducted from total income.",
                    },
                    {
                        question: "How often is Children's Allowance paid in Malta?",
                        answer: "Children's Allowance is paid every 13 weeks (quarterly) in advance.",
                    },
                    {
                        question: "What is the Child Birth Bonus in Malta?",
                        answer: "Malta provides a one-time birth/adoption bonus: €1,000 for the first child, €1,500 for the second child, and €2,000 for the third child and beyond.",
                    },
                ]}
            />
            <main role="main" aria-label="Children's Allowance Calculator">
                <BackButton href="/calculators" />
                <Shell className="max-w-4xl py-8">
                    <ChildrenAllowanceCalculator />
                    <RelatedGuide
                        href="/blog/malta-childrens-allowance-guide-2026"
                        title="Malta Children's Allowance Guide 2026"
                        description="Complete guide to children's allowance eligibility, rates, and application process."
                    />
                </Shell>
            </main>
        </MarketingLayout>
    );
}

export const revalidate = false;
export const dynamic = "force-static";
