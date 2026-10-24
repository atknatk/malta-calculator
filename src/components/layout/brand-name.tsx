import Link from "next/link";
import * as React from "react";

// Hottake: you don't need a features page if you have a changelog page
// Except for SEO

import { cn } from "@/lib/utils";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../ui/context-menu";

interface Props {
  className?: string;
}

export function BrandName({ className }: Props) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <Link
          href="/"
          className={cn(
            "rounded-md font-cal text-xl tracking-[-0.01em] ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:text-[22px]",
            className,
          )}
        >
          <span className="text-primary">Malta</span>
          <span className="text-foreground">Calculator</span>
        </Link>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem asChild>
          <a href="#" download="maltacalculator.svg">
            Download SVG
          </a>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
