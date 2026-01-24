import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = "https://maltacalculator.com";

    // Main pages
    const mainPages = [
        { url: baseUrl, priority: 1, changeFrequency: "monthly" as const },
        { url: `${baseUrl}/salary`, priority: 0.9, changeFrequency: "yearly" as const },
        { url: `${baseUrl}/calculators`, priority: 0.9, changeFrequency: "monthly" as const },
    ];

    // Blog pages (SEO-rich content) - 18 articles
    const blogPages = [
        { url: `${baseUrl}/blog`, priority: 0.8, changeFrequency: "weekly" as const },
        { url: `${baseUrl}/blog/malta-tax-rates-2026-complete-guide`, priority: 0.9, changeFrequency: "yearly" as const },
        { url: `${baseUrl}/blog/malta-ssc-contributions-2026-explained`, priority: 0.9, changeFrequency: "yearly" as const },
        { url: `${baseUrl}/blog/understanding-cola-malta-2026`, priority: 0.9, changeFrequency: "yearly" as const },
        { url: `${baseUrl}/blog/malta-expat-tax-hqp-scheme-guide`, priority: 0.9, changeFrequency: "yearly" as const },
        { url: `${baseUrl}/blog/malta-minimum-wage-2026-guide`, priority: 0.9, changeFrequency: "yearly" as const },
        { url: `${baseUrl}/blog/malta-part-time-employment-rights`, priority: 0.8, changeFrequency: "yearly" as const },
        { url: `${baseUrl}/blog/malta-maternity-leave-2026-guide`, priority: 0.8, changeFrequency: "yearly" as const },
        { url: `${baseUrl}/blog/malta-13th-month-salary-bonus-explained`, priority: 0.8, changeFrequency: "yearly" as const },
        { url: `${baseUrl}/blog/malta-tax-refund-guide-2026`, priority: 0.8, changeFrequency: "yearly" as const },
        { url: `${baseUrl}/blog/malta-self-employment-tax-guide-2026`, priority: 0.8, changeFrequency: "yearly" as const },
        { url: `${baseUrl}/blog/malta-rental-income-tax-15-percent-guide`, priority: 0.8, changeFrequency: "yearly" as const },
        { url: `${baseUrl}/blog/malta-first-time-buyer-scheme-2026`, priority: 0.8, changeFrequency: "yearly" as const },
        { url: `${baseUrl}/blog/malta-stamp-duty-complete-guide-2026`, priority: 0.8, changeFrequency: "yearly" as const },
        { url: `${baseUrl}/blog/malta-pension-system-2026-guide`, priority: 0.8, changeFrequency: "yearly" as const },
        // New blog pages for calculators
        { url: `${baseUrl}/blog/malta-notice-period-employment-guide-2026`, priority: 0.8, changeFrequency: "yearly" as const },
        { url: `${baseUrl}/blog/malta-retirement-age-guide-2026`, priority: 0.8, changeFrequency: "yearly" as const },
        { url: `${baseUrl}/blog/malta-vacation-leave-entitlement-2026`, priority: 0.8, changeFrequency: "yearly" as const },
        { url: `${baseUrl}/blog/malta-overtime-pay-rates-2026`, priority: 0.8, changeFrequency: "yearly" as const },
        // New banking blog pages
        { url: `${baseUrl}/blog/malta-mortgage-guide-2026`, priority: 0.8, changeFrequency: "yearly" as const },
        { url: `${baseUrl}/blog/malta-savings-interest-guide-2026`, priority: 0.8, changeFrequency: "yearly" as const },
        { url: `${baseUrl}/blog/malta-personal-loan-guide-2026`, priority: 0.8, changeFrequency: "yearly" as const },
        { url: `${baseUrl}/blog/malta-expat-mortgage-guide-2026`, priority: 0.8, changeFrequency: "yearly" as const },
    ];

    // Company pages
    const companyPages = [
        { url: `${baseUrl}/about`, priority: 0.5, changeFrequency: "yearly" as const },
        { url: `${baseUrl}/changelog`, priority: 0.6, changeFrequency: "monthly" as const },
        { url: `${baseUrl}/terms`, priority: 0.3, changeFrequency: "yearly" as const },
        { url: `${baseUrl}/privacy`, priority: 0.3, changeFrequency: "yearly" as const },
    ];

    // Calculator pages - active calculators with higher priority
    const activeCalculators = [
        "notice-period", "overtime", "stamp-duty", "retirement-age", "vacation",
        "mortgage", "savings-interest", "personal-loan",
    ].map((slug) => ({
        url: `${baseUrl}/calculators/${slug}`,
        priority: 0.8,
        changeFrequency: "monthly" as const,
    }));

    // Coming soon calculators
    const comingSoonCalculators = [
        "bonus-tax", "part-time", "expatriate-tax",
        "childcare", "maternity", "children-allowance", "in-work-benefit",
        "rental-tax", "first-time-buyer",
        "pension", "self-employed-tax", "self-employed-ssc", "sick-leave",
    ].map((slug) => ({
        url: `${baseUrl}/calculators/${slug}`,
        priority: 0.5,
        changeFrequency: "monthly" as const,
    }));

    return [
        ...mainPages,
        ...blogPages,
        ...companyPages,
        ...activeCalculators,
        ...comingSoonCalculators,
    ].map((page) => ({
        ...page,
        lastModified: new Date(),
    }));
}
