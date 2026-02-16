"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calculator, Home, Sparkles, BookOpen, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { MarketingLayout } from "@/components/layout/marketing-layout";

export default function NotFound() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <MarketingLayout>
      {/* Floating Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="orb orb-gold w-[350px] h-[350px] -top-20 -right-20 animate-orb" />
        <div className="orb orb-blue w-[300px] h-[300px] top-1/3 -left-20 animate-orb-delayed" />
        <div className="orb orb-coral w-[200px] h-[200px] bottom-10 right-1/4 animate-orb-slow" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center py-12 md:py-20 text-center">
        {/* Badge */}
        <div
          className={cn(
            "inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-primary/20 text-xs md:text-sm font-medium text-primary transition-all duration-500",
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4",
          )}
        >
          <Sparkles className="h-3 w-3 md:h-4 md:w-4" />
          <span>Page Not Found</span>
        </div>

        {/* 404 Number */}
        <h1
          className={cn(
            "font-cal text-[8rem] md:text-[12rem] lg:text-[14rem] font-bold leading-none text-gradient animate-float transition-all duration-700 delay-100 select-none",
            isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-90",
          )}
        >
          404
        </h1>

        {/* Calculator Icon */}
        <div
          className={cn(
            "relative -mt-6 md:-mt-10 mb-6 transition-all duration-500 delay-200",
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
          )}
        >
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg animate-glow">
            <Calculator className="h-8 w-8 md:h-10 md:w-10 text-white" />
          </div>
          {/* Error indicator */}
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive flex items-center justify-center text-white text-[10px] font-bold shadow-md">
            !
          </div>
        </div>

        {/* Title */}
        <h2
          className={cn(
            "font-cal text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight mb-3 transition-all duration-500 delay-300",
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
          )}
        >
          Lost in the{" "}
          <span className="text-gradient-secondary">Mediterranean</span>
        </h2>

        {/* Description */}
        <p
          className={cn(
            "text-muted-foreground text-sm md:text-base max-w-md mb-8 transition-all duration-500 delay-[400ms]",
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
          )}
        >
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Don&apos;t worry — our calculators are still here to help.
        </p>

        {/* CTA Buttons */}
        <div
          className={cn(
            "grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-lg transition-all duration-500 delay-500",
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
          )}
        >
          <Link
            href="/"
            className="btn-glow inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-white font-semibold text-sm"
          >
            <Home className="h-4 w-4" />
            Calculator
          </Link>
          <Link
            href="/calculators"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl glass border border-primary/20 hover:border-primary/40 font-semibold text-sm transition-colors"
          >
            <Calculator className="h-4 w-4" />
            All Tools
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl glass border border-primary/20 hover:border-primary/40 font-semibold text-sm transition-colors"
          >
            <BookOpen className="h-4 w-4" />
            Guides
          </Link>
        </div>

        {/* Back Link */}
        <button
          onClick={() => window.history.back()}
          className={cn(
            "inline-flex items-center gap-1.5 mt-6 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer",
            "delay-[600ms]",
            isLoaded ? "opacity-100" : "opacity-0",
          )}
        >
          <ArrowLeft className="h-3 w-3" />
          Go back to the previous page
        </button>
      </div>
    </MarketingLayout>
  );
}
