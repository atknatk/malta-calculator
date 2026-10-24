import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { socialsConfig } from "@/config/socials";
import { cn } from "@/lib/utils";
import { BrandName } from "./brand-name";
import { FooterLinkGroup } from "./footer-link-group";
import { SocialIconButton } from "./social-icon-button";
import { ColorThemePicker, ThemeModeSegment } from "../theme-toggle";

interface Props {
  className?: string;
}

const footerGroups: { title: string; links: FooterLinkProps[] }[] = [
  {
    title: "Guides",
    links: [
      { href: "/blog", label: "All Articles" },
      {
        href: "/blog/malta-tax-rates-2026-complete-guide",
        label: "Tax Rates 2026",
      },
      {
        href: "/blog/malta-ssc-contributions-2026-explained",
        label: "SSC Guide",
      },
      { href: "/blog/understanding-cola-malta-2026", label: "COLA Explained" },
      { href: "/blog/malta-minimum-wage-2026-guide", label: "Minimum Wage" },
      {
        href: "/blog/malta-public-holidays-2026-complete-guide",
        label: "Public Holidays",
      },
      {
        href: "/blog/malta-expat-tax-hqp-scheme-guide",
        label: "Expat Tax (HQP)",
      },
      {
        href: "/blog/malta-pension-system-2026-guide",
        label: "Pension System",
      },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/pricing", label: "Pricing" },
      { href: "/sign-up", label: "Payslip Generator" },
      { href: "/contact", label: "Contact" },
      { href: "/changelog", label: "Changelog" },
      { href: "/terms", label: "Terms" },
      { href: "/privacy", label: "Privacy" },
    ],
  },
  {
    title: "Calculators",
    links: [
      { href: "/calculators", label: "All Calculators" },
      { href: "/salary", label: "Salary Calculator" },
      { href: "/calculators/pension", label: "Pension Estimator" },
      { href: "/calculators/childcare", label: "Childcare Subsidy" },
      { href: "/calculators/vacation", label: "Vacation Days" },
      { href: "/timer", label: "Countdown Timer" },
    ],
  },
];

export function MarketingFooter({ className }: Props) {
  return (
    <footer
      className={cn("mt-auto w-full border-t bg-[var(--glass-bg)]", className)}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-[18px] px-4 pb-7 pt-6 md:gap-7 md:px-8 md:pt-9 lg:gap-8 lg:pb-8 lg:pt-12">
        <div className="grid gap-[18px] md:gap-7 lg:grid-cols-[2fr_1fr_1fr_1fr] lg:gap-8">
          <div className="flex items-start justify-between gap-3 md:gap-6 lg:max-w-[360px] lg:flex-col lg:justify-start lg:gap-3.5">
            <div className="flex flex-col gap-2 md:max-w-[420px] md:gap-3 lg:gap-3.5">
              <BrandName className="self-start text-lg md:text-xl" />
              <p className="text-sm text-muted-foreground">
                Free salary, tax and social security calculators for people who
                live and work in Malta.
              </p>
            </div>
            <ul className="flex shrink-0 gap-2">
              {socialsConfig.map(({ title, href, icon }) => (
                <li key={title}>
                  <SocialIconButton {...{ href, icon, title }} />
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col md:grid md:grid-cols-3 md:gap-6 lg:contents">
            {footerGroups.map((group) => (
              <FooterLinkGroup key={group.title} title={group.title}>
                {group.links.map((link) => (
                  <FooterLink key={link.href} {...link} />
                ))}
              </FooterLinkGroup>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2.5 border-t pt-4 md:gap-5 md:pt-5 lg:flex-row lg:items-center lg:justify-between lg:gap-6 lg:pt-6">
          <div className="flex flex-col gap-2.5 md:flex-row md:flex-wrap md:items-center md:gap-3 lg:order-2 lg:shrink-0">
            <ThemeModeSegment className="grid grid-cols-3 md:flex" />
            <ColorThemePicker className="grid grid-cols-2 gap-2 md:flex md:gap-1.5" />
          </div>
          <p className="max-w-[560px] text-[13px] text-muted-foreground lg:order-1">
            Figures are estimates based on rates from the Malta Tax and Customs
            Administration (MTCA) and the Department of Social Security. ©{" "}
            {new Date().getFullYear()} Malta Calculator.
          </p>
        </div>
      </div>
    </footer>
  );
}

interface FooterLinkProps {
  href: string;
  label: string;
  external?: boolean;
}

function FooterLink({ href, label, external = false }: FooterLinkProps) {
  const isExternal = external || href.startsWith("http");

  const externalProps = isExternal
    ? {
        target: "_blank",
        rel: "noreferrer",
      }
    : {};

  return (
    <Link
      className="inline-flex min-h-11 w-fit items-center text-[15px] text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:min-h-9 md:text-sm lg:min-h-0"
      href={href}
      {...externalProps}
    >
      {label}
      {isExternal ? (
        <ArrowUpRight className="ml-1 h-4 w-4 flex-shrink-0" />
      ) : null}
    </Link>
  );
}
