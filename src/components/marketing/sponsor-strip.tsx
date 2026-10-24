import { ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";

const sponsors = [
  { name: "codeveralabs.com", href: "https://codeveralabs.com" },
  { name: "optiway.ai", href: "https://optiway.ai" },
];

interface Props {
  className?: string;
}

// Yalnızca ana sayfada, footer'ın hemen üstünde
export function SponsorStrip({ className }: Props) {
  return (
    <section
      aria-labelledby="sponsors-heading"
      className={cn(
        "flex w-full flex-col gap-3 md:flex-row md:items-center md:justify-center md:gap-5 lg:gap-6",
        className,
      )}
    >
      <h2
        id="sponsors-heading"
        className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground"
      >
        Sponsored by
      </h2>
      <div className="flex flex-col gap-2 md:flex-row md:gap-3">
        {sponsors.map((sponsor) => (
          <a
            key={sponsor.href}
            href={sponsor.href}
            target="_blank"
            rel="sponsored noopener"
            aria-label={`${sponsor.name}, sponsor (opens in a new tab)`}
            className="inline-flex h-[52px] w-full items-center justify-between gap-2.5 rounded-[14px] border bg-card px-5 text-base font-semibold tracking-[-0.01em] text-foreground ring-offset-background transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:w-auto md:justify-center lg:h-14 lg:text-[17px]"
          >
            {sponsor.name}
            <ArrowUpRight
              className="h-3.5 w-3.5 flex-none text-muted-foreground"
              aria-hidden="true"
            />
          </a>
        ))}
      </div>
    </section>
  );
}
