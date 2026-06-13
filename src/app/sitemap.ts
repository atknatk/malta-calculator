import type { MetadataRoute } from "next";

/**
 * Per-page lastModified overrides. Entries here take precedence over the
 * global `defaultLastUpdated` fallback below — touch this when a specific
 * page has had a substantive content refresh. URLs are absolute (with
 * baseUrl) so they're exact-match against the sitemap entries.
 */
const PAGE_LAST_UPDATED: Record<string, string> = {
  "/calculators/bank-interest-tax": "2026-06-13",
  "/blog/malta-bank-interest-tax-guide-2026": "2026-06-13",
  "/calculators/property-transfer-tax": "2026-06-12",
  "/calculators/rental-tax": "2026-06-12",
  "/calculators/bonus-tax": "2026-06-12",
  "/calculators/part-time": "2026-06-12",
  "/calculators/self-employed-ssc": "2026-06-12",
  "/calculators/in-work-benefit": "2026-06-12",
  "/calculators/maternity": "2026-06-12",
  "/calculators/sick-leave": "2026-06-12",
  "/calculators/self-employed-tax": "2026-06-12",
  "/calculators/expatriate-tax": "2026-06-12",
  "/calculators/first-time-buyer": "2026-06-12",
  "/calculators/childcare": "2026-06-12",
  "/blog/malta-pay-transparency-rules-2026": "2026-06-12",
  "/calculators/import-vehicle": "2026-05-18",
  "/blog/malta-import-vehicle-guide-2026": "2026-05-18",
  "/calculators/vehicle-finance": "2026-04-15",
  "/blog/malta-vehicle-finance-guide-2026": "2026-04-15",
  "/blog/malta-work-permit-health-screening-2026": "2026-05-01",
  "/blog/malta-family-reunification-guide-2026": "2026-04-28",
};

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://maltacalculator.com";
  const defaultLastUpdated = new Date("2026-02-04");

  // Main pages
  const mainPages = [
    { url: baseUrl, priority: 1, changeFrequency: "monthly" as const },
    {
      url: `${baseUrl}/salary`,
      priority: 0.9,
      changeFrequency: "yearly" as const,
    },
    {
      url: `${baseUrl}/net-to-gross`,
      priority: 0.9,
      changeFrequency: "yearly" as const,
    },
    {
      url: `${baseUrl}/calculators`,
      priority: 0.9,
      changeFrequency: "monthly" as const,
    },
    {
      url: `${baseUrl}/timer`,
      priority: 0.7,
      changeFrequency: "monthly" as const,
    },
  ];

  // Blog pages (SEO-rich content) - 36 articles
  const blogPages = [
    {
      url: `${baseUrl}/blog`,
      priority: 0.8,
      changeFrequency: "weekly" as const,
    },
    {
      url: `${baseUrl}/blog/malta-pay-transparency-rules-2026`,
      priority: 0.9,
      changeFrequency: "yearly" as const,
    },
    {
      url: `${baseUrl}/blog/malta-crypto-digital-asset-tax-guide-2026`,
      priority: 0.9,
      changeFrequency: "yearly" as const,
    },
    {
      url: `${baseUrl}/blog/malta-tax-rates-2026-complete-guide`,
      priority: 0.9,
      changeFrequency: "yearly" as const,
    },
    {
      url: `${baseUrl}/blog/malta-ssc-contributions-2026-explained`,
      priority: 0.9,
      changeFrequency: "yearly" as const,
    },
    {
      url: `${baseUrl}/blog/understanding-cola-malta-2026`,
      priority: 0.9,
      changeFrequency: "yearly" as const,
    },
    {
      url: `${baseUrl}/blog/malta-expat-tax-hqp-scheme-guide`,
      priority: 0.9,
      changeFrequency: "yearly" as const,
    },
    {
      url: `${baseUrl}/blog/malta-minimum-wage-2026-guide`,
      priority: 0.9,
      changeFrequency: "yearly" as const,
    },
    {
      url: `${baseUrl}/blog/malta-part-time-employment-rights`,
      priority: 0.8,
      changeFrequency: "yearly" as const,
    },
    {
      url: `${baseUrl}/blog/malta-maternity-leave-2026-guide`,
      priority: 0.8,
      changeFrequency: "yearly" as const,
    },
    {
      url: `${baseUrl}/blog/malta-13th-month-salary-bonus-explained`,
      priority: 0.8,
      changeFrequency: "yearly" as const,
    },
    {
      url: `${baseUrl}/blog/malta-tax-refund-guide-2026`,
      priority: 0.8,
      changeFrequency: "yearly" as const,
    },
    {
      url: `${baseUrl}/blog/malta-self-employment-tax-guide-2026`,
      priority: 0.8,
      changeFrequency: "yearly" as const,
    },
    {
      url: `${baseUrl}/blog/malta-rental-income-tax-15-percent-guide`,
      priority: 0.8,
      changeFrequency: "yearly" as const,
    },
    {
      url: `${baseUrl}/blog/malta-first-time-buyer-scheme-2026`,
      priority: 0.8,
      changeFrequency: "yearly" as const,
    },
    {
      url: `${baseUrl}/blog/malta-stamp-duty-complete-guide-2026`,
      priority: 0.8,
      changeFrequency: "yearly" as const,
    },
    {
      url: `${baseUrl}/blog/malta-pension-system-2026-guide`,
      priority: 0.8,
      changeFrequency: "yearly" as const,
    },
    // New blog pages for calculators
    {
      url: `${baseUrl}/blog/malta-notice-period-employment-guide-2026`,
      priority: 0.8,
      changeFrequency: "yearly" as const,
    },
    {
      url: `${baseUrl}/blog/malta-retirement-age-guide-2026`,
      priority: 0.8,
      changeFrequency: "yearly" as const,
    },
    {
      url: `${baseUrl}/blog/malta-vacation-leave-entitlement-2026`,
      priority: 0.8,
      changeFrequency: "yearly" as const,
    },
    {
      url: `${baseUrl}/blog/malta-overtime-pay-rates-2026`,
      priority: 0.8,
      changeFrequency: "yearly" as const,
    },
    // New banking blog pages
    {
      url: `${baseUrl}/blog/malta-bank-interest-tax-guide-2026`,
      priority: 0.9,
      changeFrequency: "yearly" as const,
    },
    {
      url: `${baseUrl}/blog/malta-mortgage-guide-2026`,
      priority: 0.8,
      changeFrequency: "yearly" as const,
    },
    {
      url: `${baseUrl}/blog/malta-savings-interest-guide-2026`,
      priority: 0.8,
      changeFrequency: "yearly" as const,
    },
    {
      url: `${baseUrl}/blog/malta-personal-loan-guide-2026`,
      priority: 0.8,
      changeFrequency: "yearly" as const,
    },
    {
      url: `${baseUrl}/blog/malta-vehicle-finance-guide-2026`,
      priority: 0.8,
      changeFrequency: "yearly" as const,
    },
    {
      url: `${baseUrl}/blog/malta-expat-mortgage-guide-2026`,
      priority: 0.8,
      changeFrequency: "yearly" as const,
    },
    // Transport blog pages
    {
      url: `${baseUrl}/blog/malta-vehicle-registration-tax-guide-2026`,
      priority: 0.8,
      changeFrequency: "yearly" as const,
    },
    {
      url: `${baseUrl}/blog/malta-road-license-guide-2026`,
      priority: 0.8,
      changeFrequency: "yearly" as const,
    },
    {
      url: `${baseUrl}/blog/malta-drivers-license-guide-2026`,
      priority: 0.8,
      changeFrequency: "yearly" as const,
    },
    {
      url: `${baseUrl}/blog/malta-vrt-guide-2026`,
      priority: 0.8,
      changeFrequency: "yearly" as const,
    },
    {
      url: `${baseUrl}/blog/malta-import-vehicle-guide-2026`,
      priority: 0.8,
      changeFrequency: "yearly" as const,
    },
    // Employment & Social Security blog pages
    {
      url: `${baseUrl}/blog/malta-social-security-number-guide-2026`,
      priority: 0.9,
      changeFrequency: "yearly" as const,
    },
    {
      url: `${baseUrl}/blog/malta-work-permit-employment-guide-2026`,
      priority: 0.9,
      changeFrequency: "yearly" as const,
    },
    {
      url: `${baseUrl}/blog/malta-work-permit-health-screening-2026`,
      priority: 0.9,
      changeFrequency: "monthly" as const,
    },
    {
      url: `${baseUrl}/blog/malta-mysocialsecurity-app-guide-2026`,
      priority: 0.8,
      changeFrequency: "yearly" as const,
    },
    // Immigration blog pages
    {
      url: `${baseUrl}/blog/malta-family-reunification-guide-2026`,
      priority: 0.9,
      changeFrequency: "yearly" as const,
    },
    {
      url: `${baseUrl}/blog/malta-single-permit-guide-2026`,
      priority: 0.9,
      changeFrequency: "yearly" as const,
    },
    {
      url: `${baseUrl}/blog/malta-single-permit-employer-compliance-2026`,
      priority: 0.9,
      changeFrequency: "yearly" as const,
    },
    // Family benefits blog pages
    {
      url: `${baseUrl}/blog/malta-childrens-allowance-guide-2026`,
      priority: 0.8,
      changeFrequency: "yearly" as const,
    },
    // Budget 2026 blog page
    {
      url: `${baseUrl}/blog/malta-budget-2026-family-tax-savings-guide`,
      priority: 0.9,
      changeFrequency: "yearly" as const,
    },
    // Public Holidays blog pages
    {
      url: `${baseUrl}/blog/malta-public-holidays-2026-complete-guide`,
      priority: 0.9,
      changeFrequency: "yearly" as const,
    },
    // Property Transfer Tax blog page
    {
      url: `${baseUrl}/blog/malta-property-transfer-tax-guide-2026`,
      priority: 0.8,
      changeFrequency: "yearly" as const,
    },
    // Net Salary Calculation guide
    {
      url: `${baseUrl}/blog/how-to-calculate-net-salary-malta-2026`,
      priority: 0.9,
      changeFrequency: "yearly" as const,
    },
    // Double Taxation Treaty guide
    {
      url: `${baseUrl}/blog/malta-double-taxation-treaty-guide-2026`,
      priority: 0.8,
      changeFrequency: "yearly" as const,
    },
  ];

  // Company pages
  const companyPages = [
    {
      url: `${baseUrl}/about`,
      priority: 0.5,
      changeFrequency: "yearly" as const,
    },
    {
      url: `${baseUrl}/contact`,
      priority: 0.6,
      changeFrequency: "yearly" as const,
    },
    {
      url: `${baseUrl}/changelog`,
      priority: 0.6,
      changeFrequency: "monthly" as const,
    },
    {
      url: `${baseUrl}/terms`,
      priority: 0.3,
      changeFrequency: "yearly" as const,
    },
    {
      url: `${baseUrl}/privacy`,
      priority: 0.3,
      changeFrequency: "yearly" as const,
    },
  ];

  // Calculator pages - active calculators with higher priority
  const activeCalculators = [
    "notice-period",
    "overtime",
    "stamp-duty",
    "property-transfer-tax",
    "rental-tax",
    "bonus-tax",
    "part-time",
    "self-employed-ssc",
    "in-work-benefit",
    "maternity",
    "sick-leave",
    "self-employed-tax",
    "expatriate-tax",
    "first-time-buyer",
    "childcare",
    "retirement-age",
    "pension",
    "vacation",
    "mortgage",
    "savings-interest",
    "bank-interest-tax",
    "personal-loan",
    "vehicle-finance",
    "family-reunification",
    "children-allowance",
    // Transport calculators
    "vehicle-registration-tax",
    "vehicle-registration-fee",
    "road-license",
    "drivers-license",
    "import-vehicle",
    "vrt",
  ].map((slug) => ({
    url: `${baseUrl}/calculators/${slug}`,
    priority: 0.8,
    changeFrequency: "monthly" as const,
  }));

  // Note: Coming soon calculators are excluded from sitemap (they have noindex)

  return [
    ...mainPages,
    ...blogPages,
    ...companyPages,
    ...activeCalculators,
  ].map((page) => {
    const path = page.url.replace(baseUrl, "") || "/";
    const override = PAGE_LAST_UPDATED[path];
    return {
      ...page,
      lastModified: override ? new Date(override) : defaultLastUpdated,
    };
  });
}
