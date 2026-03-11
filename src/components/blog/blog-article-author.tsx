import { Shield, ExternalLink } from "lucide-react";
import { SITE_URL } from "@/app/shared-metadata";

interface BlogArticleAuthorProps {
  datePublished: string;
  dateModified?: string;
  sources?: Array<{ name: string; url: string }>;
}

export function BlogArticleAuthor({
  datePublished,
  dateModified,
  sources,
}: BlogArticleAuthorProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="mt-12 space-y-6 not-prose">
      {/* Author Box - E-E-A-T */}
      <div className="p-6 bg-muted/30 rounded-2xl border border-border/50">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold mb-1">
              Malta Calculator Editorial Team
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              Financial Content Specialists | Malta Tax & Employment Experts
            </p>
            <p className="text-sm text-muted-foreground">
              Our team specializes in Maltese tax law, social security
              contributions, and employment regulations. All content is reviewed
              against official sources from the{" "}
              <a
                href="https://cfr.gov.mt"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Malta Commissioner for Revenue
              </a>{" "}
              and the{" "}
              <a
                href="https://socialsecurity.gov.mt"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Department of Social Security
              </a>
              .
            </p>
            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
              <span>Published: {formatDate(datePublished)}</span>
              {dateModified && dateModified !== datePublished && (
                <span>Updated: {formatDate(dateModified)}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sources - Citation Optimization */}
      {sources && sources.length > 0 && (
        <div className="p-6 bg-muted/20 rounded-2xl border border-border/30">
          <h4 className="text-sm font-semibold mb-3 uppercase tracking-wide text-muted-foreground">
            Official Sources
          </h4>
          <ul className="space-y-2">
            {sources.map((source, index) => (
              <li key={index}>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                >
                  {source.name}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            ))}
          </ul>
          <p className="text-xs text-muted-foreground mt-3">
            Data verified as of {formatDate(dateModified || datePublished)}.
            Rates and thresholds are subject to change based on Malta government
            budget announcements.
          </p>
        </div>
      )}
    </div>
  );
}
