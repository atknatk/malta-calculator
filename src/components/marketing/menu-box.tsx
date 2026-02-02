"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Calculator,
  Clock,
  Palmtree,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface CalculatorCard {
  href: string;
  title: string;
  description: string;
  icon: typeof Calculator;
  gradient: string;
  iconBg: string;
  available: boolean;
  badge?: string;
}

const calculators: CalculatorCard[] = [
  {
    href: "/calculators/notice-period",
    title: "Notice Period Calculator",
    description:
      "Calculate your required notice period (1-12 weeks) based on years of service under Malta law.",
    icon: Clock,
    gradient: "from-blue-500/20 via-cyan-500/10 to-teal-500/5",
    iconBg: "bg-gradient-to-br from-blue-500 to-cyan-600",
    available: true,
    badge: "Popular",
  },
  {
    href: "/calculators/retirement-age",
    title: "Retirement Age Calculator",
    description:
      "Find your statutory retirement age (61-65) based on your birth year under Malta's Social Security Act.",
    icon: Palmtree,
    gradient: "from-emerald-500/20 via-green-500/10 to-lime-500/5",
    iconBg: "bg-gradient-to-br from-emerald-500 to-green-600",
    available: true,
    badge: "New",
  },
  {
    href: "/calculators/vacation",
    title: "Vacation Days Calculator",
    description:
      "Calculate your annual leave entitlement (192+ hours) with public holiday additions.",
    icon: Palmtree,
    gradient: "from-teal-500/20 via-cyan-500/10 to-blue-500/5",
    iconBg: "bg-gradient-to-br from-teal-500 to-cyan-600",
    available: true,
    badge: "New",
  },
  {
    href: "/calculators/stamp-duty",
    title: "Stamp Duty Calculator",
    description:
      "Calculate property stamp duty at 5% standard rate or first-time buyer exemption.",
    icon: Calculator,
    gradient: "from-indigo-500/20 via-purple-500/10 to-violet-500/5",
    iconBg: "bg-gradient-to-br from-indigo-500 to-purple-600",
    available: true,
    badge: "New",
  },
  {
    href: "/calculators/overtime",
    title: "Overtime Calculator",
    description:
      "Calculate overtime pay at 1.5x (weekdays) and 2x (weekends/holidays) rates.",
    icon: Clock,
    gradient: "from-orange-500/20 via-red-500/10 to-rose-500/5",
    iconBg: "bg-gradient-to-br from-orange-500 to-red-600",
    available: true,
    badge: "New",
  },
];

function CalculatorCardComponent({ card, index }: { card: CalculatorCard; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const isFirst = index === 0;

  useEffect(() => {
    // Simple intersection observer for smooth reveal
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Stagger delay based on index
          setTimeout(() => {
            setIsVisible(true);
          }, index * 100);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [index]);

  const CardContent = (
    <div
      ref={cardRef}
      className={cn(
        "group relative overflow-hidden rounded-3xl transition-all duration-500",
        "premium-card",
        isFirst ? "sm:col-span-2 lg:col-span-3" : "",
        card.available
          ? "cursor-pointer hover:scale-[1.02]"
          : "opacity-70 cursor-not-allowed",
        // Animation states
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-8"
      )}
    >
      {/* Gradient Background */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500",
          card.gradient
        )}
      />

      {/* Content */}
      <div className="relative z-10 p-6 md:p-8">
        <div className={cn(
          "flex gap-6",
          isFirst ? "flex-col md:flex-row md:items-center" : "flex-col"
        )}>
          {/* Icon */}
          <div
            className={cn(
              "flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center",
              "shadow-lg transition-all duration-300",
              "group-hover:scale-110 group-hover:shadow-xl",
              card.iconBg
            )}
          >
            <card.icon className="h-8 w-8 text-white" />
          </div>

          {/* Text Content */}
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3">
              <h2 className="font-cal text-xl md:text-2xl font-bold text-foreground">
                {card.title}
              </h2>
              {card.badge && (
                <span
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-semibold",
                    card.available
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {card.badge}
                </span>
              )}
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {card.description}
            </p>
          </div>

          {/* Arrow */}
          {card.available && (
            <div className="flex-shrink-0 self-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (card.available) {
    return (
      <Link href={card.href} className={cn(isFirst ? "sm:col-span-2 lg:col-span-3" : "")}>
        {CardContent}
      </Link>
    );
  }

  return CardContent;
}

export function MenuBox() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="calculators"
      className="w-full py-8"
      aria-label="Malta Financial Calculators - Professional tools for tax, salary and pension calculations"
    >
      {/* Section Header */}
      <div className={cn(
        "text-center mb-12 transition-all duration-700",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      )}>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20 text-sm font-medium text-primary mb-4">
          <Sparkles className="h-4 w-4" />
          <span>Professional Tools</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-cal font-bold text-foreground mb-4">
          Financial Calculators
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Comprehensive tools designed specifically for Malta&apos;s tax and employment regulations.
        </p>
      </div>

      {/* Cards Grid - 2 cols at sm/md, 3 cols only at lg+ */}
      <div className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {calculators.map((card, index) => (
          <CalculatorCardComponent key={card.href} card={card} index={index} />
        ))}
      </div>
    </section>
  );
}
