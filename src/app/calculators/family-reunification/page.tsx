import { MarketingLayout } from "@/components/layout/marketing-layout";
import { Shell } from "@/components/dashboard/shell";
import { BackButton } from "@/components/layout/back-button";
import type { Metadata } from "next";
import { defaultMetadata, ogMetadata, twitterMetadata, SITE_URL } from "@/app/shared-metadata";
import { FamilyReunificationCalculator } from "./_components/family-reunification-calculator";
import { BreadcrumbJsonLd, CalculatorJsonLd, CustomFAQJsonLd } from "@/components/json-ld";

export const metadata: Metadata = {
    ...defaultMetadata,
    title: "Family Reunification Calculator Malta 2026 | Malta Calculator",
    description: "Calculate minimum salary requirements for family reunification in Malta. Two schemes explained: Family Reunification (S.L. 217.6) and Family Member Policy with salary thresholds.",
    keywords: [
        "Malta family reunification",
        "Malta family visa",
        "Malta family member policy",
        "Malta sponsor family",
        "Malta immigration salary",
        "Malta family permit",
        "Malta residence permit family",
        "Identità family reunification",
    ],
    alternates: { canonical: `${SITE_URL}/calculators/family-reunification` },
    openGraph: {
        ...ogMetadata,
        title: "Family Reunification Calculator Malta 2026",
        description: "Calculate minimum salary requirements for sponsoring family members in Malta",
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
                    { name: "Family Reunification", url: `${SITE_URL}/calculators/family-reunification` },
                ]}
            />
            <CalculatorJsonLd
                name="Family Reunification Calculator Malta"
                description="Calculate minimum salary requirements for sponsoring family members to Malta under Family Reunification (S.L. 217.6) or Family Member Policy."
                slug="family-reunification"
                category="Immigration Calculator"
                features={[
                    "Family Reunification (S.L. 217.6) salary calculation",
                    "Family Member Policy salary calculation",
                    "Gross and net income requirements",
                    "Monthly and weekly breakdown",
                    "Scheme comparison tool",
                    "Support for up to 10 family members",
                ]}
            />
            <CustomFAQJsonLd
                questions={[
                    {
                        question: "What is the minimum salary for family reunification in Malta?",
                        answer: "For Family Reunification (S.L. 217.6), you need the average gross wage (€24,976/year in 2025) plus 20% for each family member. For Family Member Policy, you need €18,940 net plus 20% of median wage per family member.",
                    },
                    {
                        question: "What is the difference between Family Reunification and Family Member Policy?",
                        answer: "Family Reunification (S.L. 217.6) requires gross income based on average wage, while Family Member Policy requires net income. Family Reunification is the main legal pathway, while Family Member Policy is for specific cases.",
                    },
                    {
                        question: "How much salary do I need to sponsor 2 family members in Malta?",
                        answer: "For 2 family members under Family Reunification, you need approximately €34,966 gross per year (€2,914/month). Under Family Member Policy, you need €26,516 net per year (€2,210/month).",
                    },
                    {
                        question: "Who can I sponsor for family reunification in Malta?",
                        answer: "You can sponsor your spouse or registered partner, minor children (under 18), adult dependent children, and in some cases, dependent parents.",
                    },
                ]}
            />
            <main role="main" aria-label="Family Reunification Calculator">
                <BackButton href="/calculators" />
                <Shell className="max-w-4xl py-8">
                    <FamilyReunificationCalculator />
                </Shell>
            </main>
        </MarketingLayout>
    );
}

export const revalidate = false;
export const dynamic = 'force-static';
