import { MarketingLayout } from "@/components/layout/marketing-layout";
import type { Metadata } from "next";
import {
    defaultMetadata,
    ogMetadata,
    twitterMetadata,
    SITE_URL,
} from "../shared-metadata";
import { Shell } from "@/components/dashboard/shell";

export const metadata: Metadata = {
    ...defaultMetadata,
    title: "Changelog | Malta Calculator",
    description:
        "Changelog for Malta Calculator - new features, improvements, and updates. Track all changes to our Malta salary and tax calculators.",
    alternates: {
        canonical: `${SITE_URL}/changelog`,
    },
    openGraph: {
        ...ogMetadata,
        title: "Changelog | Malta Calculator",
        url: `${SITE_URL}/changelog`,
    },
    twitter: {
        ...twitterMetadata,
        title: "Changelog | Malta Calculator",
    },
};

export default function ChangelogPage() {
    return (
        <MarketingLayout>
            <main role="main" aria-label="Changelog">
                <Shell className="max-w-4xl py-12">
                    <article className="prose prose-neutral dark:prose-invert max-w-none">
                        <h1 className="font-cal text-4xl md:text-5xl font-bold mb-8">
                            Changelog
                        </h1>
                        <p className="text-muted-foreground mb-8">
                            Malta Calculator&apos;daki tüm güncellemeler ve yeni özellikler.
                            All updates and new features in Malta Calculator.
                        </p>

                        <section className="mb-10 border-l-4 border-primary pl-6">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full">
                                    v2.0.0
                                </span>
                                <time className="text-sm text-muted-foreground">January 2026</time>
                            </div>
                            <h2 className="text-xl font-semibold mb-3">Major UI Redesign & SSR Migration</h2>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2">
                                <li>Premium &quot;Malta Heritage&quot; UI with limestone gold and mediterranean blue theme</li>
                                <li>Full Server-Side Rendering (SSR) for improved SEO and performance</li>
                                <li>URL-based state management with nuqs for shareable calculation links</li>
                                <li>Glassmorphism design elements and smooth animations</li>
                                <li>Mobile-first responsive design with segmented controls</li>
                                <li>JSON-LD structured data for rich search results</li>
                                <li>Dynamic sitemap and robots.txt generation</li>
                            </ul>
                        </section>

                        <section className="mb-10 border-l-4 border-secondary pl-6">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="px-3 py-1 bg-secondary/10 text-secondary text-sm font-semibold rounded-full">
                                    v1.5.0
                                </span>
                                <time className="text-sm text-muted-foreground">January 2026</time>
                            </div>
                            <h2 className="text-xl font-semibold mb-3">2026 Tax Year Support</h2>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2">
                                <li>Updated tax brackets for 2026</li>
                                <li>New SSC rates and caps for 2026</li>
                                <li>2026 COLA adjustment (€10.36/week)</li>
                                <li>Automatic age-based SSC regime detection (1962 threshold)</li>
                            </ul>
                        </section>

                        <section className="mb-10 border-l-4 border-muted pl-6">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="px-3 py-1 bg-muted text-muted-foreground text-sm font-semibold rounded-full">
                                    v1.0.0
                                </span>
                                <time className="text-sm text-muted-foreground">January 2024</time>
                            </div>
                            <h2 className="text-xl font-semibold mb-3">Initial Release</h2>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2">
                                <li>Malta Salary Calculator with 2024-2025 tax rates</li>
                                <li>Support for Single, Married, and Parent tax types</li>
                                <li>SSC Category A, B, and C calculations</li>
                                <li>Monthly and annual salary breakdown</li>
                                <li>Dark mode support</li>
                            </ul>
                        </section>

                        <section className="mt-12 p-6 bg-muted/50 rounded-2xl">
                            <h2 className="text-xl font-semibold mb-3">Coming Soon</h2>
                            <ul className="list-disc list-inside text-muted-foreground space-y-2">
                                <li>Pension Calculator</li>
                                <li>Childcare Subsidy Calculator</li>
                                <li>Notice Period Calculator</li>
                                <li>Vacation Days Calculator</li>
                            </ul>
                        </section>
                    </article>
                </Shell>
            </main>
        </MarketingLayout>
    );
}
