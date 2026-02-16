import Link from "next/link";
import { ArrowRight, Calculator, Share2 } from "lucide-react";
import { SITE_URL } from "@/app/shared-metadata";
import { BlogShareButtons } from "./blog-share-buttons";

interface BlogArticleFooterProps {
  slug: string;
  title: string;
  ctaTitle?: string;
  ctaDescription?: string;
  ctaLink?: string;
  ctaLinkText?: string;
}

export function BlogArticleFooter({
  slug,
  title,
  ctaTitle = "Calculate Your Exact Tax",
  ctaDescription = "Use our free Malta Salary Calculator to get your exact tax amount, SSC contributions, and net salary for 2026.",
  ctaLink = "/salary",
  ctaLinkText = "Calculate Now",
}: BlogArticleFooterProps) {
  const articleUrl = `${SITE_URL}/blog/${slug}`;

  return (
    <div className="mt-16 space-y-8 not-prose">
      {/* Share Section */}
      <div className="p-6 bg-muted/30 rounded-2xl border border-border/50">
        <div className="flex items-center gap-2 mb-4">
          <Share2 className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold">Share this article</h3>
        </div>
        <BlogShareButtons url={articleUrl} title={title} />
      </div>

      {/* CTA Section */}
      <div className="p-8 bg-gradient-to-br from-primary/10 to-secondary/5 rounded-3xl border border-border/50 text-center">
        <Calculator className="h-12 w-12 mx-auto mb-4 text-primary" />
        <h2 className="text-2xl font-cal font-bold mb-4">{ctaTitle}</h2>
        <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
          {ctaDescription}
        </p>
        <Link
          href={ctaLink}
          className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors"
        >
          {ctaLinkText}
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
}
