import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface RelatedGuideProps {
  href: string;
  title: string;
  description?: string;
}

export function RelatedGuide({ href, title, description }: RelatedGuideProps) {
  return (
    <div className="mt-8 pt-6 border-t border-border/50">
      <Link
        href={href}
        className={cn(
          "group flex items-start gap-4 p-4 rounded-xl",
          "bg-primary/5 border border-primary/10",
          "hover:bg-primary/10 hover:border-primary/20",
          "transition-all duration-300",
        )}
      >
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
          <BookOpen className="h-5 w-5 text-primary group-hover:text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-xs text-primary font-medium mb-1">
            <span>Related Guide</span>
          </div>
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {description}
            </p>
          )}
        </div>
        <div className="flex-shrink-0 self-center">
          <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-all group-hover:translate-x-1" />
        </div>
      </Link>
    </div>
  );
}
