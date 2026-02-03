import { MarketingLayout } from "@/components/layout/marketing-layout";
import type { Metadata } from "next";
import {
    defaultMetadata,
    ogMetadata,
    twitterMetadata,
    SITE_URL,
} from "../shared-metadata";
import { Shell } from "@/components/dashboard/shell";
import { ContactForm } from "./_components/contact-form";
import {
    Mail,
    Clock,
    Shield,
    MessageCircle,
    HelpCircle,
    Flag,
    Lightbulb
} from "lucide-react";

export const metadata: Metadata = {
    ...defaultMetadata,
    title: "Contact Us | Malta Calculator",
    description:
        "Get in touch with Malta Calculator team. Ask questions about salary calculations, tax rates, SSC contributions, or provide feedback on our tools.",
    alternates: {
        canonical: `${SITE_URL}/contact`,
    },
    openGraph: {
        ...ogMetadata,
        title: "Contact Us | Malta Calculator",
        url: `${SITE_URL}/contact`,
    },
    twitter: {
        ...twitterMetadata,
        title: "Contact Us | Malta Calculator",
    },
};

const contactReasons = [
    {
        icon: HelpCircle,
        title: "Questions",
        description: "Need help understanding your salary calculation or tax breakdown?",
    },
    {
        icon: Flag,
        title: "Report Issues",
        description: "Found a bug or calculation error? Let us know!",
    },
    {
        icon: Lightbulb,
        title: "Feature Requests",
        description: "Have ideas for new calculators or improvements?",
    },
    {
        icon: MessageCircle,
        title: "General Feedback",
        description: "Share your thoughts about Malta Calculator",
    },
];

// Performance: Static page - no revalidation needed
export const dynamic = 'force-static';
export const revalidate = false;

export default function ContactPage() {
    return (
        <MarketingLayout>
            <main role="main" aria-label="Contact Malta Calculator">
                <Shell className="max-w-6xl py-12">
                    {/* Hero Section */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 mb-6">
                            <Mail className="w-8 h-8 text-primary" />
                        </div>
                        <h1 className="font-cal text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                            Get in Touch
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Have a question, suggestion, or feedback? We&apos;d love to hear from you.
                            Our team typically responds within 24-48 hours.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
                        {/* Left Column - Info Cards */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Contact Reasons */}
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold text-foreground">How can we help?</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                                    {contactReasons.map((reason) => (
                                        <div
                                            key={reason.title}
                                            className="flex items-start gap-3 p-4 rounded-xl bg-background/50 border border-border/50 hover:border-primary/30 transition-colors"
                                        >
                                            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                                <reason.icon className="w-5 h-5 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-foreground">{reason.title}</h3>
                                                <p className="text-sm text-muted-foreground">{reason.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Response Time Info */}
                            <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/20">
                                <div className="flex items-center gap-3 mb-2">
                                    <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                    <h3 className="font-medium text-emerald-700 dark:text-emerald-300">Quick Response</h3>
                                </div>
                                <p className="text-sm text-emerald-600/80 dark:text-emerald-400/80">
                                    We aim to respond to all inquiries within 24-48 hours during business days.
                                </p>
                            </div>

                            {/* Privacy Note */}
                            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20">
                                <div className="flex items-center gap-3 mb-2">
                                    <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    <h3 className="font-medium text-blue-700 dark:text-blue-300">Your Privacy</h3>
                                </div>
                                <p className="text-sm text-blue-600/80 dark:text-blue-400/80">
                                    Your information is secure. We never share your data with third parties.
                                    Read our <a href="/privacy" className="underline hover:no-underline">Privacy Policy</a>.
                                </p>
                            </div>
                        </div>

                        {/* Right Column - Contact Form */}
                        <div className="lg:col-span-3">
                            <ContactForm />
                        </div>
                    </div>
                </Shell>
            </main>
        </MarketingLayout>
    );
}
