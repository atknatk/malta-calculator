"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { marketingPagesConfig } from "@/config/pages";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { BrandName } from "./brand-name";
import { MarketingMenu } from "./marketing-menu";

interface Props {
  className?: string;
}

export function MarketingHeader({ className }: Props) {
  const pathname = usePathname();

  return (
    <header
      className={cn(
        "grid w-full grid-cols-2 gap-2 md:grid-cols-5 py-2",
        className
      )}
    >
      <div className="flex items-center md:col-span-1">
        <BrandName />
      </div>
      <nav className="mx-auto hidden items-center justify-center rounded-full glass border border-primary/10 px-2 md:col-span-3 md:flex md:gap-1 shadow-lg shadow-primary/5">
        {marketingPagesConfig.map(({ href, title, segment }) => {
          const isExternal = href.startsWith("http");
          const externalProps = isExternal ? { target: "_blank" } : {};
          const isActive = pathname.startsWith(href);
          return (
            <Button
              key={segment}
              variant="link"
              className={cn(
                "transition-colors",
                isActive ? "font-semibold text-primary" : "text-muted-foreground hover:text-foreground"
              )}
              asChild
            >
              <Link href={href} {...externalProps}>
                {title}
              </Link>
            </Button>
          );
        })}
      </nav>
      <div className="flex items-center justify-end gap-3 md:col-span-1">
        <div className="block md:hidden">
          <MarketingMenu />
        </div>
      </div>
    </header>
  );
}
