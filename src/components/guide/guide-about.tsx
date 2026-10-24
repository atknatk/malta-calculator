import { ArrowUpRight, Shield } from "lucide-react";

interface Props {
  datePublished: string;
  dateModified?: string;
  sources?: Array<{ name: string; url: string }>;
}

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

// BlogArticleAuthor'un metin ve linkleri (E-E-A-T), rehber şablonu görünümüyle
export function GuideAbout({ datePublished, dateModified, sources }: Props) {
  return (
    <section
      aria-label="About this guide"
      className="flex flex-col gap-3 md:gap-4"
    >
      <div className="flex gap-4 rounded-2xl border bg-card p-[18px] md:px-6 md:py-[22px]">
        <span
          aria-hidden="true"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary-ink"
        >
          <Shield className="h-5 w-5" />
        </span>
        <div className="flex flex-col gap-1.5">
          <span className="text-base font-semibold">
            Malta Calculator Editorial Team
          </span>
          <span className="text-sm text-muted-foreground">
            Financial Content Specialists | Malta Tax &amp; Employment Experts
          </span>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Our team specializes in Maltese tax law, social security
            contributions, and employment regulations. All content is reviewed
            against official sources from the{" "}
            <a
              href="https://mtca.gov.mt"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary-ink underline-offset-2 hover:underline"
            >
              Malta Tax and Customs Administration
            </a>{" "}
            and the{" "}
            <a
              href="https://socialsecurity.gov.mt"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary-ink underline-offset-2 hover:underline"
            >
              Department of Social Security
            </a>
            .
          </p>
          <span className="text-[13px] text-muted-foreground">
            Published: {formatDate(datePublished)}
            {dateModified && dateModified !== datePublished
              ? ` · Updated: ${formatDate(dateModified)}`
              : ""}
          </span>
        </div>
      </div>

      {sources && sources.length > 0 ? (
        <div className="flex flex-col gap-2.5 rounded-2xl border px-[18px] py-5 md:px-6">
          <span className="text-xs font-semibold uppercase tracking-[0.06em] text-muted-foreground">
            Official sources
          </span>
          <ul className="flex flex-col gap-2">
            {sources.map((source) => (
              <li key={source.url}>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[15px] font-medium text-primary-ink underline-offset-2 hover:underline"
                >
                  {source.name}
                  <ArrowUpRight
                    className="h-3.5 w-3.5 shrink-0"
                    aria-hidden="true"
                  />
                </a>
              </li>
            ))}
          </ul>
          <p className="text-[13px] text-muted-foreground">
            Data verified as of {formatDate(dateModified || datePublished)}.
            Rates and thresholds are subject to change based on Malta government
            budget announcements.
          </p>
        </div>
      ) : null}
    </section>
  );
}
