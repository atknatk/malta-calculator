import { MarketingLayout } from "@/components/layout/marketing-layout";
import type { Metadata } from "next";
import {
    defaultMetadata,
    ogMetadata,
    twitterMetadata,
    SITE_URL,
} from "../shared-metadata";
import { Shell } from "@/components/dashboard/shell";
import { CheckCircle, Trash2 } from "lucide-react";

export const metadata: Metadata = {
    ...defaultMetadata,
    title: "Data Deletion Status | Malta Calculator",
    description:
        "Check the status of your data deletion request for Malta Calculator. Facebook OAuth data deletion confirmation.",
    alternates: {
        canonical: `${SITE_URL}/data-deletion-status`,
    },
    openGraph: {
        ...ogMetadata,
        title: "Data Deletion Status | Malta Calculator",
        url: `${SITE_URL}/data-deletion-status`,
    },
    twitter: {
        ...twitterMetadata,
        title: "Data Deletion Status | Malta Calculator",
    },
    robots: {
        index: false,
        follow: false,
    },
};

// Performance: Static page
export const dynamic = 'force-static';
export const revalidate = false;

export default function DataDeletionStatusPage() {
    return (
        <MarketingLayout>
            <main role="main" aria-label="Data Deletion Status">
                <Shell className="max-w-2xl py-12">
                    <article className="prose prose-neutral dark:prose-invert max-w-none">
                        {/* Header */}
                        <div className="text-center mb-12">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-medium rounded-full mb-4">
                                <Trash2 className="w-4 h-4" />
                                <span>Data Deletion</span>
                            </div>
                            <h1 className="font-cal text-3xl md:text-4xl font-bold mb-4">Data Deletion Status</h1>
                            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                                Your data deletion request has been processed.
                            </p>
                        </div>

                        {/* Status Card */}
                        <div className="p-6 bg-gradient-to-br from-emerald-500/10 via-background to-blue-500/10 rounded-2xl border border-emerald-500/20 text-center">
                            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-emerald-500" />
                            <h2 className="text-xl font-semibold mb-2 !mt-0">Deletion Complete</h2>
                            <p className="text-muted-foreground mb-4">
                                Any data associated with your Facebook account has been deleted from our systems.
                            </p>
                            <div className="p-4 bg-muted/50 rounded-lg text-left">
                                <h3 className="text-sm font-semibold mb-2 !mt-0">What was deleted:</h3>
                                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                                    <li>Facebook User ID association</li>
                                    <li>Authentication session data</li>
                                </ul>
                            </div>
                        </div>

                        {/* Info Section */}
                        <div className="mt-8 p-4 bg-muted/30 rounded-lg">
                            <h3 className="text-base font-semibold mb-2 !mt-0">About Data Deletion</h3>
                            <p className="text-sm text-muted-foreground">
                                Malta Calculator uses Clerk for authentication. When you request data deletion through Facebook,
                                we remove any Facebook-specific identifiers from our system. Your calculator usage data is never
                                stored and requires no deletion.
                            </p>
                        </div>

                        {/* Contact */}
                        <div className="mt-6 text-center">
                            <p className="text-sm text-muted-foreground">
                                Questions? <a href="/contact" className="text-primary hover:underline">Contact us</a>
                            </p>
                        </div>
                    </article>
                </Shell>
            </main>
        </MarketingLayout>
    );
}
