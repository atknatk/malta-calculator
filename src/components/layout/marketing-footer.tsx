import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { socialsConfig } from "@/config/socials";
import { cn } from "@/lib/utils";
import { BrandName } from "./brand-name";
import { SocialIconButton } from "./social-icon-button";
import { ThemeToggle } from "../theme-toggle";
import { Shell } from "../dashboard/shell";

interface Props {
  className?: string;
}

export function MarketingFooter({ className }: Props) {
  return (
    <footer className={cn("w-full", className)}>
      <Shell className="grid gap-6">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-5">
          <div className="col-span-2 flex flex-col gap-3">
            <div>
              <BrandName />
              <p className="mt-2 font-light text-muted-foreground text-sm">
              A comprehensive calculation app that supports you at every stage of your professional life, ensuring accurate calculations and simplifying your work processes for greater efficiency and peace of mind!
                <br />
                <span className="underline decoration-dotted underline-offset-2">
                  Salary Calculator
                </span>
              </p>
            </div>
          </div>
          <div className="order-1 flex flex-col gap-3 text-sm">
            <p className="font-semibold text-foreground"></p>
            {/* <FooterLink href="/play/checker" label="Speed Checker" />
            <FooterLink href="https://maltacalculator.com" label="All Status Codes" /> */}
          </div>
          <div className="order-2 flex flex-col gap-3 text-sm">
            <p className="font-semibold text-foreground">Company</p>
            <FooterLink href="/" label="About" />
            <FooterLink href="/" label="Changelog" />
            <FooterLink href="/" label="Terms" />
            <FooterLink href="/" label="Privacy" />
          </div>
          
           <div className="order-3 flex flex-col gap-3 text-sm">
            <p className="font-semibold text-foreground">Resources</p>
            <FooterLink href="/salary" label="Salary Calculator" />
            <FooterLink href="/pension" label="Pension Calculator" />
            <FooterLink href="/childcare" label="Childcare Calculator" />
            <FooterLink href="/vocation" label="Vocation Calculator" />
          </div>
       
     
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {socialsConfig.map(({ title, href, icon }) => (
              <SocialIconButton key={title} {...{ href, icon, title }} />
            ))}
          </div>
          <div className="text-right md:text-left">
            <ThemeToggle />
          </div>
        </div>
      </Shell>
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
      className="inline-flex w-fit items-center text-muted-foreground underline underline-offset-4 hover:text-foreground hover:no-underline"
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
