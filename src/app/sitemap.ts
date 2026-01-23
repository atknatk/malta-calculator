import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = "https://maltacalculator.com";

    // Main pages
    const mainPages = [
        { url: baseUrl, priority: 1, changeFrequency: "monthly" as const },
        { url: `${baseUrl}/salary`, priority: 0.9, changeFrequency: "yearly" as const },
        { url: `${baseUrl}/calculators`, priority: 0.9, changeFrequency: "monthly" as const },
    ];

    // Blog pages (SEO-rich content)
    const blogPages = [
        { url: `${baseUrl}/blog`, priority: 0.8, changeFrequency: "weekly" as const },
        { url: `${baseUrl}/blog/malta-tax-rates-2026-complete-guide`, priority: 0.9, changeFrequency: "yearly" as const },
        { url: `${baseUrl}/blog/malta-ssc-contributions-2026-explained`, priority: 0.9, changeFrequency: "yearly" as const },
        { url: `${baseUrl}/blog/understanding-cola-malta-2026`, priority: 0.9, changeFrequency: "yearly" as const },
        { url: `${baseUrl}/blog/malta-expat-tax-hqp-scheme-guide`, priority: 0.9, changeFrequency: "yearly" as const },
    ];

    // Company pages
    const companyPages = [
        { url: `${baseUrl}/about`, priority: 0.5, changeFrequency: "yearly" as const },
        { url: `${baseUrl}/changelog`, priority: 0.6, changeFrequency: "monthly" as const },
        { url: `${baseUrl}/terms`, priority: 0.3, changeFrequency: "yearly" as const },
        { url: `${baseUrl}/privacy`, priority: 0.3, changeFrequency: "yearly" as const },
    ];

    // Calculator pages (coming soon)
    const calculatorPages = [
        // Employment & Salary
        "notice-period",
        "overtime",
        "bonus-tax",
        "part-time",
        "expatriate-tax",
        // Family & Children
        "childcare",
        "maternity",
        "children-allowance",
        "in-work-benefit",
        // Property & Housing
        "stamp-duty",
        "rental-tax",
        "first-time-buyer",
        // Retirement & Savings
        "pension",
        "retirement-age",
        // Self-Employment
        "self-employed-tax",
        "self-employed-ssc",
        // Leave & Time Off
        "vacation",
        "sick-leave",
    ].map((slug) => ({
        url: `${baseUrl}/calculators/${slug}`,
        priority: 0.6,
        changeFrequency: "monthly" as const,
    }));

    return [
        ...mainPages,
        ...blogPages,
        ...companyPages,
        ...calculatorPages,
    ].map((page) => ({
        ...page,
        lastModified: new Date(),
    }));
}
