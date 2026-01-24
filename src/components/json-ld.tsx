import { SITE_NAME, SITE_URL } from "@/app/shared-metadata";

interface JsonLdProps {
    type: "WebApplication" | "FAQPage" | "Organization";
}

export function WebApplicationJsonLd() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Malta Salary Calculator",
        description:
            "Calculate your Malta net salary with accurate 2024-2026 tax brackets, SSC contributions, and COLA. Free, instant results for single and married taxpayers.",
        url: SITE_URL,
        applicationCategory: "FinanceApplication",
        operatingSystem: "Web Browser",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "EUR",
        },
        featureList: [
            "Malta tax calculation for 2024-2026",
            "Social Security Contribution (SSC) calculator",
            "COLA (Cost of Living Adjustment) inclusion",
            "Single and married taxpayer support",
            "Monthly and annual salary breakdown",
            "Instant net salary results",
        ],
        creator: {
            "@type": "Organization",
            name: SITE_NAME,
            url: SITE_URL,
        },
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}

export function FAQPageJsonLd() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
            {
                "@type": "Question",
                name: "How is net salary calculated in Malta?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Net salary in Malta is calculated by deducting Income Tax and Social Security Contributions (SSC) from your gross salary, then adding the COLA (Cost of Living Adjustment). Tax rates depend on your marital status (single, married, or parent) and income bracket.",
                },
            },
            {
                "@type": "Question",
                name: "What are the Malta tax brackets for 2026?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Malta has progressive tax brackets. For single taxpayers in 2026: 0% on the first €9,100, 15% on €9,101-€14,500, 25% on €14,501-€19,500, and 35% above €60,000. Married taxpayers have higher thresholds.",
                },
            },
            {
                "@type": "Question",
                name: "What is SSC (Social Security Contribution) in Malta?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "SSC in Malta is a mandatory social security contribution paid by both employees and employers. For 2026, the employee contribution is 10% of basic weekly wage, with weekly caps varying by category (€54.06-€57.32 for Category A).",
                },
            },
            {
                "@type": "Question",
                name: "What is COLA in Malta?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "COLA (Cost of Living Adjustment) is an annual allowance added to all salaries in Malta to compensate for inflation. For 2026, COLA is €10.36 per week (€538.72 annually), and it's not subject to income tax.",
                },
            },
            {
                "@type": "Question",
                name: "Is the Malta Salary Calculator free to use?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, the Malta Salary Calculator is completely free to use. It provides instant, accurate calculations for 2024, 2025, and 2026 tax years with no registration required.",
                },
            },
        ],
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}

export function OrganizationJsonLd() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/logo.png`,
        sameAs: [],
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}

export function SiteNavigationJsonLd() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        itemListElement: [
            {
                "@type": "SiteNavigationElement",
                position: 1,
                name: "Salary Calculator",
                description: "Calculate your Malta net salary with accurate tax, SSC, and COLA",
                url: `${SITE_URL}/salary`,
            },
            {
                "@type": "SiteNavigationElement",
                position: 2,
                name: "All Calculators",
                description: "Browse all Malta financial calculators",
                url: `${SITE_URL}/calculators`,
            },
            {
                "@type": "SiteNavigationElement",
                position: 3,
                name: "Blog",
                description: "Malta tax and salary guides",
                url: `${SITE_URL}/blog`,
            },
            {
                "@type": "SiteNavigationElement",
                position: 4,
                name: "Tax Rates 2026",
                description: "Complete guide to Malta income tax brackets 2026",
                url: `${SITE_URL}/blog/malta-tax-rates-2026-complete-guide`,
            },
            {
                "@type": "SiteNavigationElement",
                position: 5,
                name: "SSC Guide",
                description: "Malta SSC contributions explained",
                url: `${SITE_URL}/blog/malta-ssc-contributions-2026-explained`,
            },
            {
                "@type": "SiteNavigationElement",
                position: 6,
                name: "About",
                description: "About Malta Calculator",
                url: `${SITE_URL}/about`,
            },
        ],
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}

interface BreadcrumbItem {
    name: string;
    url: string;
}

interface BreadcrumbJsonLdProps {
    items: BreadcrumbItem[];
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}

export function WebsiteJsonLd() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: SITE_NAME,
        url: SITE_URL,
        description: "Free Malta salary calculator with accurate 2024-2026 tax rates, SSC contributions, and COLA calculations.",
        potentialAction: {
            "@type": "SearchAction",
            target: {
                "@type": "EntryPoint",
                urlTemplate: `${SITE_URL}/salary?salary={salary}`,
            },
            "query-input": "required name=salary",
        },
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}
