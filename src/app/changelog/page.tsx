import { MarketingLayout } from "@/components/layout/marketing-layout";
import type { Metadata } from "next";
import {
    defaultMetadata,
    ogMetadata,
    twitterMetadata,
    SITE_URL,
} from "../shared-metadata";
import { Shell } from "@/components/dashboard/shell";
import {
    Rocket,
    Calculator,
    Car,
    Briefcase,
    Building2,
    Baby,
    PiggyBank,
    FileText,
    Sparkles,
    Zap,
    Globe,
    Clock,
    Shield,
    TrendingUp
} from "lucide-react";

export const metadata: Metadata = {
    ...defaultMetadata,
    title: "Changelog | Malta Calculator - Updates & New Features",
    description:
        "Changelog for Malta Calculator - new features, improvements, and updates. Track all changes to our Malta salary, tax, vehicle, and financial calculators.",
    alternates: {
        canonical: `${SITE_URL}/changelog`,
    },
    openGraph: {
        ...ogMetadata,
        title: "Changelog | Malta Calculator - Updates & New Features",
        url: `${SITE_URL}/changelog`,
    },
    twitter: {
        ...twitterMetadata,
        title: "Changelog | Malta Calculator - Updates & New Features",
    },
};

interface ChangelogEntry {
    version: string;
    date: string;
    title: string;
    description?: string;
    type: "major" | "feature" | "update" | "initial";
    icon: React.ReactNode;
    features: string[];
}

const changelogEntries: ChangelogEntry[] = [
    {
        version: "v3.1.0",
        date: "February 2, 2026",
        title: "Immigration & Family Reunification",
        type: "feature",
        icon: <Globe className="w-5 h-5" />,
        description: "New immigration calculators and comprehensive blog content.",
        features: [
            "👨‍👩‍👧‍👦 Family Reunification Calculator with two schemes",
            "📋 Family Reunification (S.L. 217.6) gross salary calculation",
            "🏠 Family Member Policy net salary calculation",
            "📊 Scheme comparison tool for side-by-side analysis",
            "📝 Comprehensive Family Reunification Guide blog post",
            "📱 New blog posts: SSN Guide, Work Permit Guide, mySocialSecurity App",
            "🔧 Enhanced JSON-LD with CalculatorJsonLd and CustomFAQJsonLd",
            "📂 New workflows for creating calculators and blog posts",
        ],
    },
    {
        version: "v3.0.0",
        date: "January 24, 2026",
        title: "Transport Malta Integration & Vehicle Calculators",
        type: "major",
        icon: <Car className="w-5 h-5" />,
        description: "Complete Transport Malta vehicle-related calculators and 2026 regulations.",
        features: [
            "🚗 Vehicle Registration Tax (VRT) Calculator with CO₂ emission-based rates",
            "🛣️ Road License Fee Calculator with 2026 annual rates",
            "📋 Driver's License Renewal Calculator with age-based pricing",
            "🚢 Vehicle Import Calculator for EU and non-EU imports",
            "📱 Mobile-optimized vehicle selection interface",
            "🎨 Premium glassmorphism design for all vehicle calculators",
            "📊 Detailed breakdown of all Transport Malta fees",
            "🔗 Direct links to official Transport Malta resources",
        ],
    },
    {
        version: "v2.5.0",
        date: "January 24, 2026",
        title: "Banking & Loan Calculators",
        type: "feature",
        icon: <Building2 className="w-5 h-5" />,
        description: "Comprehensive Malta banking and loan calculators with local regulations.",
        features: [
            "🏠 Mortgage Calculator with minimum 10% deposit requirement",
            "💳 Personal Loan Calculator with standard amortization",
            "💰 Savings Interest Calculator with 15% Malta withholding tax",
            "📈 Amortization schedule generation with monthly breakdown",
            "🏦 Integration with Malta banking regulations",
            "📊 Interactive loan comparison charts",
        ],
    },
    {
        version: "v2.4.0",
        date: "January 24, 2026",
        title: "Employment Law Calculators",
        type: "feature",
        icon: <Briefcase className="w-5 h-5" />,
        description: "Malta employment law calculators based on official DIER regulations.",
        features: [
            "📅 Notice Period Calculator (WOER regulations)",
            "🏖️ Vacation Leave Calculator with EU Working Time Directive compliance",
            "⏰ Overtime Calculator (1.5x weekday, 2x Sundays/holidays)",
            "🛏️ Sick Leave Calculator with service-based entitlements",
            "👶 Maternity Leave Calculator with 14-week entitlement",
            "🎂 Retirement Age Calculator (1952-1969 cohorts)",
        ],
    },
    {
        version: "v2.3.0",
        date: "January 24, 2026",
        title: "Property & Real Estate Calculators",
        type: "feature",
        icon: <FileText className="w-5 h-5" />,
        description: "Malta property transaction and real estate calculators.",
        features: [
            "📄 Stamp Duty Calculator with 5% standard rate",
            "🏠 First-Time Buyer Stamp Duty Exemption Calculator (€200k threshold)",
            "🏢 Rental Income Tax Calculator (15% flat rate option)",
            "📊 Property value and transfer duty estimates",
        ],
    },
    {
        version: "v2.2.0",
        date: "January 24, 2026",
        title: "Social Benefits Calculators",
        type: "feature",
        icon: <Baby className="w-5 h-5" />,
        description: "Malta social welfare and benefits calculators.",
        features: [
            "👨‍👩‍👧‍👦 Children's Allowance Calculator (means-tested rates)",
            "💼 In-Work Benefit Calculator for low-income families",
            "👶 Childcare Subsidy Calculator with income thresholds",
            "📊 Automatic means-testing based on household income",
        ],
    },
    {
        version: "v2.1.0",
        date: "January 24, 2026",
        title: "Tax Optimization Calculators",
        type: "feature",
        icon: <PiggyBank className="w-5 h-5" />,
        description: "Specialized tax calculators for various income types.",
        features: [
            "🌍 Expatriate Tax Calculator with QPIP/HQP schemes",
            "💵 Bonus Tax Calculator (flat rate vs marginal comparison)",
            "🏢 Self-Employed Tax Calculator with provisional tax",
            "📋 Self-Employed SSC Calculator with Class 2 contributions",
            "⏱️ Part-Time Income Calculator with pro-rata tax",
        ],
    },
    {
        version: "v2.0.0",
        date: "January 2026",
        title: "Major UI Redesign & SSR Migration",
        type: "major",
        icon: <Sparkles className="w-5 h-5" />,
        description: "Complete redesign with premium aesthetics and server-side rendering.",
        features: [
            "✨ Premium 'Malta Heritage' UI with limestone gold and mediterranean blue theme",
            "🚀 Full Server-Side Rendering (SSR) for improved SEO and performance",
            "🔗 URL-based state management with nuqs for shareable calculation links",
            "💎 Glassmorphism design elements and smooth animations",
            "📱 Mobile-first responsive design with segmented controls",
            "🏷️ JSON-LD structured data for rich search results",
            "🗺️ Dynamic sitemap and robots.txt generation",
            "🎨 Dark mode with premium color palette",
        ],
    },
    {
        version: "v1.5.0",
        date: "January 2026",
        title: "2026 Tax Year Support",
        type: "update",
        icon: <TrendingUp className="w-5 h-5" />,
        description: "Updated rates and regulations for Malta tax year 2026.",
        features: [
            "📊 Updated tax brackets for 2026",
            "💰 New SSC rates and caps for 2026 (€525.77/week max)",
            "📈 2026 COLA adjustment (€10.36/week)",
            "🎂 Automatic age-based SSC regime detection (1962 threshold)",
            "📋 Updated minimum wage calculations",
        ],
    },
    {
        version: "v1.0.0",
        date: "January 2024",
        title: "Initial Release",
        type: "initial",
        icon: <Rocket className="w-5 h-5" />,
        description: "The first public release of Malta Calculator.",
        features: [
            "💼 Malta Salary Calculator with 2024-2025 tax rates",
            "👥 Support for Single, Married, and Parent tax types",
            "📊 SSC Category A, B, and C calculations",
            "📅 Monthly and annual salary breakdown",
            "🌙 Dark mode support",
            "📱 Responsive mobile design",
        ],
    },
];

function getTypeStyles(type: ChangelogEntry["type"]) {
    switch (type) {
        case "major":
            return {
                border: "border-l-primary",
                badge: "bg-primary/10 text-primary",
                iconBg: "bg-primary/10 text-primary",
            };
        case "feature":
            return {
                border: "border-l-emerald-500",
                badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
            };
        case "update":
            return {
                border: "border-l-blue-500",
                badge: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
                iconBg: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
            };
        case "initial":
        default:
            return {
                border: "border-l-muted-foreground",
                badge: "bg-muted text-muted-foreground",
                iconBg: "bg-muted text-muted-foreground",
            };
    }
}

// Performance: Static page - no revalidation needed
export const dynamic = 'force-static';
export const revalidate = false;

export default function ChangelogPage() {
    return (
        <MarketingLayout>
            <main role="main" aria-label="Changelog">
                <Shell className="max-w-4xl py-12">
                    <article className="prose prose-neutral dark:prose-invert max-w-none">
                        {/* Header Section */}
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
                                <Clock className="w-4 h-4" />
                                <span>Version History</span>
                            </div>
                            <h1 className="font-cal text-4xl md:text-5xl font-bold mb-4">
                                Changelog
                            </h1>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                Track all updates, new features, and improvements to Malta Calculator.
                                We&apos;re constantly adding new calculators and enhancing the user experience.
                            </p>
                        </div>

                        {/* Stats Section */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                            <div className="glass-panel p-4 text-center rounded-xl">
                                <div className="text-2xl font-bold text-primary">15+</div>
                                <div className="text-sm text-muted-foreground">Calculators</div>
                            </div>
                            <div className="glass-panel p-4 text-center rounded-xl">
                                <div className="text-2xl font-bold text-emerald-500">2026</div>
                                <div className="text-sm text-muted-foreground">Tax Year</div>
                            </div>
                            <div className="glass-panel p-4 text-center rounded-xl">
                                <div className="text-2xl font-bold text-blue-500">5</div>
                                <div className="text-sm text-muted-foreground">Categories</div>
                            </div>
                            <div className="glass-panel p-4 text-center rounded-xl">
                                <div className="text-2xl font-bold text-orange-500">100%</div>
                                <div className="text-sm text-muted-foreground">Free</div>
                            </div>
                        </div>

                        {/* Changelog Entries */}
                        <div className="space-y-8">
                            {changelogEntries.map((entry, index) => {
                                const styles = getTypeStyles(entry.type);
                                return (
                                    <section
                                        key={entry.version}
                                        className={`border-l-4 ${styles.border} pl-6 py-2 transition-all hover:pl-8`}
                                    >
                                        <div className="flex flex-wrap items-center gap-3 mb-4">
                                            <div className={`p-2 rounded-lg ${styles.iconBg}`}>
                                                {entry.icon}
                                            </div>
                                            <span className={`px-3 py-1 ${styles.badge} text-sm font-semibold rounded-full`}>
                                                {entry.version}
                                            </span>
                                            <time className="text-sm text-muted-foreground">
                                                {entry.date}
                                            </time>
                                            {index === 0 && (
                                                <span className="px-2 py-0.5 bg-green-500/10 text-green-600 dark:text-green-400 text-xs font-medium rounded-full animate-pulse">
                                                    Latest
                                                </span>
                                            )}
                                        </div>
                                        <h2 className="text-xl font-semibold mb-2 !mt-0">
                                            {entry.title}
                                        </h2>
                                        {entry.description && (
                                            <p className="text-muted-foreground mb-4 !mt-0">
                                                {entry.description}
                                            </p>
                                        )}
                                        <ul className="list-none !pl-0 text-muted-foreground space-y-2">
                                            {entry.features.map((feature, featureIndex) => (
                                                <li key={featureIndex} className="!pl-0 !my-1">
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </section>
                                );
                            })}
                        </div>

                        {/* Coming Soon Section */}
                        <section className="mt-12 p-8 bg-gradient-to-br from-primary/5 via-background to-secondary/5 rounded-2xl border border-primary/10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                    <Zap className="w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-semibold !my-0">Coming Soon</h2>
                            </div>
                            <p className="text-muted-foreground mb-4">
                                We&apos;re actively working on new calculators and features based on user feedback.
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg border border-border/50">
                                    <PiggyBank className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">Enhanced Pension Calculator</span>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg border border-border/50">
                                    <Globe className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">Multi-language Support (MT, EN)</span>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg border border-border/50">
                                    <Calculator className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">Crypto Tax Calculator</span>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-background/50 rounded-lg border border-border/50">
                                    <Shield className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">Insurance Premium Calculator</span>
                                </div>
                            </div>
                        </section>

                        {/* Feedback Section */}
                        <section className="mt-8 p-6 bg-muted/30 rounded-xl text-center">
                            <p className="text-muted-foreground mb-2">
                                Have a suggestion for a new calculator?
                            </p>
                            <p className="text-sm text-muted-foreground">
                                We&apos;d love to hear from you!{" "}
                                <a
                                    href="/contact"
                                    className="text-primary hover:underline font-medium"
                                >
                                    Send us your feedback →
                                </a>
                            </p>
                        </section>
                    </article>
                </Shell>
            </main>
        </MarketingLayout>
    );
}
