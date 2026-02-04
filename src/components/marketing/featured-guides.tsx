import Link from "next/link";
import { BookOpen, ArrowRight, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface GuideCard {
    href: string;
    title: string;
    description: string;
    category: string;
    readTime: string;
}

const featuredGuides: GuideCard[] = [
    {
        href: "/blog/malta-tax-rates-2026-complete-guide",
        title: "Malta Tax Rates 2026",
        description: "Complete guide to income tax brackets for single, married, and parent taxpayers.",
        category: "Tax Guide",
        readTime: "8 min",
    },
    {
        href: "/blog/malta-ssc-contributions-2026-explained",
        title: "SSC Contributions 2026",
        description: "Social Security rates, weekly caps, and the 1962 age threshold explained.",
        category: "SSC Guide",
        readTime: "6 min",
    },
    {
        href: "/blog/malta-minimum-wage-2026-guide",
        title: "Minimum Wage 2026",
        description: "Current rates at €213.54/week and National Minimum Wage regulations.",
        category: "Salary",
        readTime: "5 min",
    },
    {
        href: "/blog/understanding-cola-malta-2026",
        title: "COLA Explained",
        description: "Cost of Living Adjustment and how it affects your Malta salary.",
        category: "Salary",
        readTime: "5 min",
    },
    {
        href: "/blog/malta-public-holidays-2026-complete-guide",
        title: "Public Holidays 2026",
        description: "All 14 official holidays with dates and employment rights.",
        category: "Holidays",
        readTime: "8 min",
    },
    {
        href: "/blog/malta-expat-tax-hqp-scheme-guide",
        title: "Expat Tax (HQP)",
        description: "15% flat tax rate scheme for highly qualified persons.",
        category: "Expat",
        readTime: "7 min",
    },
];

function GuideCardComponent({ guide }: { guide: GuideCard }) {
    return (
        <Link
            href={guide.href}
            className={cn(
                "group relative overflow-hidden rounded-2xl",
                "bg-card border border-border/50",
                "p-5 transition-all duration-300",
                "hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5",
                "hover:-translate-y-1",
                "h-full flex flex-col"
            )}
        >
            {/* Category & Read Time */}
            <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                    {guide.category}
                </span>
                <span className="text-xs text-muted-foreground">
                    {guide.readTime}
                </span>
            </div>

            {/* Title */}
            <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-1">
                {guide.title}
            </h3>

            {/* Description - fixed height with 2 lines */}
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3 min-h-[2.5rem]">
                {guide.description}
            </p>

            {/* Read More - always at bottom */}
            <div className="flex items-center gap-1 mt-auto text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Read guide</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </div>
        </Link>
    );
}

export function FeaturedGuides() {
    return (
        <section
            className="w-full py-8"
            aria-label="Malta Tax and Salary Guides"
        >
            {/* Section Header */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20 text-sm font-medium text-primary mb-4">
                    <BookOpen className="h-4 w-4" />
                    <span>Expert Guides</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-cal font-bold text-foreground mb-3">
                    Malta Tax & Salary Guides
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto text-sm">
                    In-depth guides on Malta&apos;s tax system, employment regulations, and financial planning.
                </p>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
                {featuredGuides.map((guide) => (
                    <GuideCardComponent key={guide.href} guide={guide} />
                ))}
            </div>

            {/* View All Link */}
            <div className="text-center mt-6">
                <Link
                    href="/blog"
                    className={cn(
                        "inline-flex items-center gap-2 px-6 py-3 rounded-full",
                        "bg-primary/10 text-primary font-medium",
                        "hover:bg-primary hover:text-primary-foreground",
                        "transition-all duration-300"
                    )}
                >
                    <TrendingUp className="h-4 w-4" />
                    <span>View All 30+ Guides</span>
                    <ArrowRight className="h-4 w-4" />
                </Link>
            </div>
        </section>
    );
}
