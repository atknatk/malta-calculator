import { MarketingLayout } from "@/components/layout/marketing-layout";
import type { Metadata } from "next";
import {
  defaultMetadata,
  ogMetadata,
  twitterMetadata,
  SITE_URL,
  pageAlternates,
} from "../shared-metadata";
import { Shell } from "@/components/dashboard/shell";
import Link from "next/link";
import {
  Calculator,
  Baby,
  Palmtree,
  Home,
  Briefcase,
  Calendar,
  ArrowRight,
  Sparkles,
  Landmark,
  Car,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BreadcrumbJsonLd, CollectionPageJsonLd } from "@/components/json-ld";
import { CALCULATORS, CALCULATOR_CATEGORIES } from "@/config/calculators";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "All Calculators | Malta Calculator",
  description:
    "All free financial calculators for Malta — salary, income tax, SSC, pension, mortgage, stamp duty, rental tax and more. Tools for residents and expats.",
  alternates: pageAlternates("/calculators"),
  openGraph: {
    ...ogMetadata,
    title: "All Calculators | Malta Calculator",
    url: `${SITE_URL}/calculators`,
  },
  twitter: {
    ...twitterMetadata,
    title: "All Calculators | Malta Calculator",
  },
};

/**
 * Kategori görsel meta — ikon/gradient JSX olduğu için sayfada tutulur.
 * Hesaplayıcı verisi (isim/href/açıklama) tek kaynaktan: @/config/calculators
 */
const CATEGORY_META: Record<
  string,
  { icon: React.ReactNode; gradient: string }
> = {
  "Employment & Salary": {
    icon: <Briefcase className="h-6 w-6 text-white" />,
    gradient: "from-amber-500 to-orange-600",
  },
  "Family & Children": {
    icon: <Baby className="h-6 w-6 text-white" />,
    gradient: "from-pink-500 to-rose-600",
  },
  "Property & Housing": {
    icon: <Home className="h-6 w-6 text-white" />,
    gradient: "from-emerald-500 to-green-600",
  },
  "Banking & Loans": {
    icon: <Landmark className="h-6 w-6 text-white" />,
    gradient: "from-sky-500 to-blue-600",
  },
  "Retirement & Savings": {
    icon: <Palmtree className="h-6 w-6 text-white" />,
    gradient: "from-blue-500 to-cyan-600",
  },
  "Self-Employment": {
    icon: <Calculator className="h-6 w-6 text-white" />,
    gradient: "from-violet-500 to-purple-600",
  },
  "Leave & Time Off": {
    icon: <Calendar className="h-6 w-6 text-white" />,
    gradient: "from-teal-500 to-emerald-600",
  },
  "Transport & Vehicles": {
    icon: <Car className="h-6 w-6 text-white" />,
    gradient: "from-slate-500 to-zinc-600",
  },
  "Immigration & Visa": {
    icon: <Users className="h-6 w-6 text-white" />,
    gradient: "from-indigo-500 to-violet-600",
  },
};

const categories = CALCULATOR_CATEGORIES.map((title) => ({
  title,
  icon: CATEGORY_META[title]?.icon,
  gradient: CATEGORY_META[title]?.gradient ?? "from-slate-500 to-zinc-600",
  items: CALCULATORS.filter((c) => c.category === title),
}));

export default function CalculatorsPage() {
  // Prepare items for JSON-LD
  const allCalculators = CALCULATORS.map((item) => ({
    name: item.title,
    description: item.tagline,
    url: `${SITE_URL}${item.href}`,
  }));

  return (
    <MarketingLayout>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "All Calculators", url: `${SITE_URL}/calculators` },
        ]}
      />
      <CollectionPageJsonLd
        name="All Malta Calculators"
        description="Comprehensive financial calculation tools for Malta residents and workers. Salary, tax, mortgage, loan, vehicle, and more."
        url={`${SITE_URL}/calculators`}
        items={allCalculators}
      />
      <main role="main" aria-label="All Malta Calculators">
        <Shell className="py-12">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/20 text-sm font-medium text-primary mb-6">
              <Sparkles className="h-4 w-4" />
              <span>20+ Financial Tools</span>
            </div>
            <h1 className="font-cal text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              All Malta Calculators
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive financial calculation tools for Malta residents and
              workers.
            </p>
          </div>

          {/* Categories */}
          <div className="space-y-16">
            {categories.map((category) => (
              <section key={category.title} className="space-y-6">
                {/* Category Header */}
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br",
                      category.gradient,
                    )}
                  >
                    {category.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-cal font-bold">
                      {category.title}
                    </h2>
                  </div>
                </div>

                {/* Calculator Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "group relative p-6 rounded-2xl border transition-all duration-300",
                        "bg-card hover:border-primary hover:shadow-lg",
                      )}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {item.title}
                        </h3>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {item.tagline}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-20 p-8 rounded-3xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-border/50">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-gradient">
                  {CALCULATORS.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Active Calculators
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gradient-secondary">
                  {CALCULATOR_CATEGORIES.length}
                </div>
                <div className="text-sm text-muted-foreground">Categories</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gradient">100%</div>
                <div className="text-sm text-muted-foreground">Malta 2026</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gradient-secondary">
                  Free
                </div>
                <div className="text-sm text-muted-foreground">Forever</div>
              </div>
            </div>
          </div>
        </Shell>
      </main>
    </MarketingLayout>
  );
}

export const revalidate = false; // tamamen statik (build-time)
export const dynamic = "force-static"; // bu segmenti statik olmaya zorla
