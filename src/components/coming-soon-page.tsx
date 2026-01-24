import { MarketingLayout } from "@/components/layout/marketing-layout";
import { Shell } from "@/components/dashboard/shell";
import { Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ComingSoonPageProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    category: string;
    features: string[];
}

export function ComingSoonPage({
    title,
    description,
    icon,
    category,
    features,
}: ComingSoonPageProps) {
    return (
        <MarketingLayout>
            <main role="main" aria-label={title}>
                <Shell className="max-w-4xl py-12">
                    <div className="text-center">
                        {/* Back Button */}
                        <Link
                            href="/calculators"
                            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            All Calculators
                        </Link>

                        {/* Category Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-6">
                            {category}
                        </div>

                        {/* Icon */}
                        <div className="mx-auto w-24 h-24 rounded-3xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-8">
                            {icon}
                        </div>

                        {/* Title */}
                        <h1 className="font-cal text-4xl md:text-5xl font-bold mb-6">
                            {title}
                        </h1>

                        {/* Coming Soon Badge */}
                        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold mb-8">
                            <Clock className="h-5 w-5" />
                            Coming Soon
                        </div>

                        {/* Description */}
                        <div className="max-w-2xl mx-auto mb-12">
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                {description}
                            </p>
                        </div>

                        {/* Features Preview */}
                        <div className="bg-muted/30 rounded-3xl p-8 mb-12">
                            <h2 className="text-xl font-semibold mb-6">
                                Planned Features
                            </h2>
                            <ul className="grid md:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
                                {features.map((feature, i) => (
                                    <li
                                        key={i}
                                        className="flex items-start gap-2 text-muted-foreground"
                                    >
                                        <span className="text-primary mt-1">✓</span>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* CTA */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/salary"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors"
                            >
                                Try Salary Calculator
                            </Link>
                            <Link
                                href="/calculators"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl glass border border-border/50 font-semibold hover:bg-white/50 dark:hover:bg-white/10 transition-colors"
                            >
                                Browse All Calculators
                            </Link>
                        </div>
                    </div>
                </Shell>
            </main>
        </MarketingLayout>
    );
}
