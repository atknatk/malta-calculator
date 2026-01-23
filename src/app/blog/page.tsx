import { MarketingLayout } from "@/components/layout/marketing-layout";
import type { Metadata } from "next";
import {
    defaultMetadata,
    ogMetadata,
    twitterMetadata,
    SITE_URL,
} from "../shared-metadata";
import { Shell } from "@/components/dashboard/shell";
import Link from "next/link";
import { ArrowRight, BookOpen, Calendar, Clock, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
    ...defaultMetadata,
    title: "Blog | Malta Tax & Salary Guides | Malta Calculator",
    description:
        "Expert guides on Malta tax rates, SSC contributions, COLA, and salary calculations. Stay updated with the latest Malta employment and tax regulations for 2024-2026.",
    alternates: {
        canonical: `${SITE_URL}/blog`,
    },
    openGraph: {
        ...ogMetadata,
        title: "Blog | Malta Tax & Salary Guides",
        url: `${SITE_URL}/blog`,
    },
    twitter: {
        ...twitterMetadata,
        title: "Blog | Malta Tax & Salary Guides",
    },
};

interface BlogPost {
    slug: string;
    title: string;
    description: string;
    date: string;
    readTime: string;
    category: string;
    featured?: boolean;
}

const blogPosts: BlogPost[] = [
    {
        slug: "malta-tax-rates-2026-complete-guide",
        title: "Malta Tax Rates 2026: Complete Guide to Income Tax Brackets",
        description:
            "Everything you need to know about Malta's 2026 income tax rates. Comprehensive breakdown of tax brackets for single, married, and parent taxpayers with examples.",
        date: "January 2026",
        readTime: "8 min read",
        category: "Tax Guide",
        featured: true,
    },
    {
        slug: "malta-ssc-contributions-2026-explained",
        title: "Malta SSC Contributions 2026: Rates, Caps & Categories Explained",
        description:
            "Complete guide to Social Security Contributions in Malta for 2026. Learn about Class 1 employee rates, weekly caps, Category A/B/C, and the 1962 age threshold.",
        date: "January 2026",
        readTime: "6 min read",
        category: "SSC Guide",
    },
    {
        slug: "understanding-cola-malta-2026",
        title: "Understanding COLA in Malta 2026: Cost of Living Adjustment Guide",
        description:
            "What is COLA and how does it affect your salary in Malta? Complete explanation of the Cost of Living Adjustment, its history, calculation, and 2026 rates.",
        date: "January 2026",
        readTime: "5 min read",
        category: "Salary Guide",
    },
    {
        slug: "malta-expat-tax-hqp-scheme-guide",
        title: "Malta Expat Tax: Highly Qualified Persons (HQP) 15% Flat Rate Guide",
        description:
            "Guide to Malta's Highly Qualified Persons tax scheme. Learn about the 15% flat tax rate for expats, eligibility requirements, qualifying sectors, and application process.",
        date: "January 2026",
        readTime: "7 min read",
        category: "Expat Guide",
    },
];

export default function BlogPage() {
    const featuredPost = blogPosts.find((post) => post.featured);
    const regularPosts = blogPosts.filter((post) => !post.featured);

    return (
        <MarketingLayout>
            <main role="main" aria-label="Malta Calculator Blog">
                <Shell className="py-12">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20 text-sm font-medium text-primary mb-6">
                            <BookOpen className="h-4 w-4" />
                            <span>Expert Guides</span>
                        </div>
                        <h1 className="font-cal text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                            Malta Tax & Salary Blog
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            In-depth guides on Malta&apos;s tax system, SSC contributions, COLA adjustments,
                            and everything you need to understand your salary.
                        </p>
                    </div>

                    {/* Featured Post */}
                    {featuredPost && (
                        <Link
                            href={`/blog/${featuredPost.slug}`}
                            className="group block mb-12"
                        >
                            <article className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-secondary/5 to-transparent border border-border/50 p-8 md:p-12 transition-all duration-300 hover:border-primary/50 hover:shadow-lg">
                                <div className="flex flex-col md:flex-row md:items-center gap-6">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="px-3 py-1 bg-primary text-white text-xs font-semibold rounded-full">
                                                Featured
                                            </span>
                                            <span className="text-sm text-muted-foreground">
                                                {featuredPost.category}
                                            </span>
                                        </div>
                                        <h2 className="text-2xl md:text-3xl font-cal font-bold mb-4 group-hover:text-primary transition-colors">
                                            {featuredPost.title}
                                        </h2>
                                        <p className="text-muted-foreground leading-relaxed mb-6">
                                            {featuredPost.description}
                                        </p>
                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-4 w-4" />
                                                {featuredPost.date}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-4 w-4" />
                                                {featuredPost.readTime}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex-shrink-0">
                                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                            <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
                                        </div>
                                    </div>
                                </div>
                            </article>
                        </Link>
                    )}

                    {/* Regular Posts Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {regularPosts.map((post) => (
                            <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
                                <article className="h-full p-6 rounded-2xl border border-border/50 bg-card hover:border-primary/50 hover:shadow-lg transition-all duration-300">
                                    <div className="flex flex-col h-full">
                                        <span className="text-xs font-semibold text-primary mb-3">
                                            {post.category}
                                        </span>
                                        <h2 className="text-lg font-semibold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                            {post.title}
                                        </h2>
                                        <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1 line-clamp-3">
                                            {post.description}
                                        </p>
                                        <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border/50">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {post.date}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                {post.readTime}
                                            </span>
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>

                    {/* CTA Section */}
                    <div className="mt-16 text-center p-8 rounded-3xl bg-muted/30 border border-border/50">
                        <h2 className="text-2xl font-cal font-bold mb-4">
                            Ready to Calculate Your Salary?
                        </h2>
                        <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                            Use our free Malta Salary Calculator to get accurate net salary calculations
                            with all the tax rates and SSC contributions explained in our guides.
                        </p>
                        <Link
                            href="/salary"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors"
                        >
                            Try Salary Calculator
                            <ArrowRight className="h-5 w-5" />
                        </Link>
                    </div>
                </Shell>
            </main>
        </MarketingLayout>
    );
}
