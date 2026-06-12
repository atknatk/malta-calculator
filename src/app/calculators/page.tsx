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
  Clock,
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

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "All Calculators | Malta Calculator",
  description:
    "All financial calculators for Malta - salary, tax, SSC, pension, childcare, rental tax and more. Comprehensive tools for residents and workers.",
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

interface CalculatorItem {
  href: string;
  title: string;
  description: string;
  available: boolean;
}

interface CalculatorCategory {
  title: string;
  icon: React.ReactNode;
  gradient: string;
  items: CalculatorItem[];
}

const categories: CalculatorCategory[] = [
  {
    title: "Employment & Salary",
    icon: <Briefcase className="h-6 w-6 text-white" />,
    gradient: "from-amber-500 to-orange-600",
    items: [
      {
        href: "/salary",
        title: "Salary Calculator",
        description: "Net salary with tax, SSC & COLA",
        available: true,
      },
      {
        href: "/calculators/notice-period",
        title: "Notice Period",
        description: "Required notice based on service years",
        available: true,
      },
      {
        href: "/calculators/overtime",
        title: "Overtime Calculator",
        description: "Overtime pay at 1.5x and 2x rates",
        available: true,
      },
      {
        href: "/calculators/bonus-tax",
        title: "Bonus Tax",
        description: "Marginal tax on bonuses & 13th salary",
        available: true,
      },
      {
        href: "/calculators/part-time",
        title: "Part-Time Tax",
        description: "10% rate (TA22/TA23) vs declaring",
        available: true,
      },
      {
        href: "/calculators/expatriate-tax",
        title: "Expatriate Tax (HQP)",
        description: "15% flat tax for highly qualified persons",
        available: false,
      },
    ],
  },
  {
    title: "Family & Children",
    icon: <Baby className="h-6 w-6 text-white" />,
    gradient: "from-pink-500 to-rose-600",
    items: [
      {
        href: "/calculators/childcare",
        title: "Childcare Subsidy",
        description: "Childcare support based on income",
        available: false,
      },
      {
        href: "/calculators/maternity",
        title: "Maternity/Paternity Leave",
        description: "18 weeks pay: employer + €213.54 benefit",
        available: true,
      },
      {
        href: "/calculators/children-allowance",
        title: "Children&apos;s Allowance",
        description: "Weekly allowance for children under 16",
        available: true,
      },
      {
        href: "/calculators/in-work-benefit",
        title: "In-Work Benefit",
        description: "Up to €1,627 per child for workers",
        available: true,
      },
    ],
  },
  {
    title: "Property & Housing",
    icon: <Home className="h-6 w-6 text-white" />,
    gradient: "from-emerald-500 to-green-600",
    items: [
      {
        href: "/calculators/stamp-duty",
        title: "Stamp Duty",
        description: "Property purchase stamp duty (5% / 3.5%)",
        available: true,
      },
      {
        href: "/calculators/property-transfer-tax",
        title: "Property Transfer Tax",
        description: "Seller's 8% final withholding tax",
        available: true,
      },
      {
        href: "/calculators/rental-tax",
        title: "Rental Tax",
        description: "15% flat rate vs progressive comparison",
        available: true,
      },
      {
        href: "/calculators/first-time-buyer",
        title: "First-Time Buyer",
        description: "First-time buyer scheme benefits",
        available: false,
      },
    ],
  },
  {
    title: "Banking & Loans",
    icon: <Landmark className="h-6 w-6 text-white" />,
    gradient: "from-sky-500 to-blue-600",
    items: [
      {
        href: "/calculators/mortgage",
        title: "Mortgage Calculator",
        description: "Home loan with 10% min deposit",
        available: true,
      },
      {
        href: "/calculators/savings-interest",
        title: "Savings Interest",
        description: "Compound interest with 15% tax",
        available: true,
      },
      {
        href: "/calculators/personal-loan",
        title: "Personal Loan",
        description: "Personal loan repayment calculator",
        available: true,
      },
      {
        href: "/calculators/vehicle-finance",
        title: "Vehicle Finance",
        description: "Car loan & hire purchase with deposit",
        available: true,
      },
    ],
  },
  {
    title: "Retirement & Savings",
    icon: <Palmtree className="h-6 w-6 text-white" />,
    gradient: "from-blue-500 to-cyan-600",
    items: [
      {
        href: "/calculators/pension",
        title: "Pension Calculator",
        description: "Two-thirds pension & private pension tax credit",
        available: true,
      },
      {
        href: "/calculators/retirement-age",
        title: "Retirement Age",
        description: "Your retirement age calculation",
        available: true,
      },
    ],
  },
  {
    title: "Self-Employment",
    icon: <Calculator className="h-6 w-6 text-white" />,
    gradient: "from-violet-500 to-purple-600",
    items: [
      {
        href: "/calculators/self-employed-tax",
        title: "Self-Employed Tax",
        description: "Income tax for self-employed",
        available: false,
      },
      {
        href: "/calculators/self-employed-ssc",
        title: "Self-Employed SSC",
        description: "Class 2 SSC: SA/SB/SC rates 2026",
        available: true,
      },
    ],
  },
  {
    title: "Leave & Time Off",
    icon: <Calendar className="h-6 w-6 text-white" />,
    gradient: "from-teal-500 to-emerald-600",
    items: [
      {
        href: "/calculators/vacation",
        title: "Vacation Days",
        description: "Annual leave entitlement (min 192h)",
        available: true,
      },
      {
        href: "/calculators/sick-leave",
        title: "Sick Leave",
        description: "Employer days + sickness benefit 2026",
        available: true,
      },
    ],
  },
  {
    title: "Transport & Vehicles",
    icon: <Car className="h-6 w-6 text-white" />,
    gradient: "from-slate-500 to-zinc-600",
    items: [
      {
        href: "/calculators/vehicle-registration-fee",
        title: "Vehicle Registration Fee",
        description: "All fees for registering a vehicle",
        available: true,
      },
      {
        href: "/calculators/vehicle-registration-tax",
        title: "Vehicle Registration Tax",
        description: "CO2-based registration tax",
        available: true,
      },
      {
        href: "/calculators/road-license",
        title: "Road License",
        description: "Annual circulation tax by engine",
        available: true,
      },
      {
        href: "/calculators/drivers-license",
        title: "Driver's License Fees",
        description: "License, tests & renewal costs",
        available: true,
      },
      {
        href: "/calculators/vrt",
        title: "VRT (MOT) Fees",
        description: "Vehicle roadworthiness test costs",
        available: true,
      },
      {
        href: "/calculators/import-vehicle",
        title: "Import Vehicle",
        description: "Total cost to import a vehicle",
        available: true,
      },
    ],
  },
  {
    title: "Immigration & Visa",
    icon: <Users className="h-6 w-6 text-white" />,
    gradient: "from-indigo-500 to-violet-600",
    items: [
      {
        href: "/calculators/family-reunification",
        title: "Family Reunification",
        description: "Salary requirements for sponsoring family",
        available: true,
      },
    ],
  },
];

export default function CalculatorsPage() {
  // Prepare items for JSON-LD
  const allCalculators = categories.flatMap((cat) =>
    cat.items.map((item) => ({
      name: item.title,
      description: item.description,
      url: `${SITE_URL}${item.href}`,
    })),
  );

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
                        item.available
                          ? "bg-card hover:border-primary hover:shadow-lg"
                          : "bg-muted/30 hover:bg-muted/50",
                      )}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {item.title}
                        </h3>
                        {item.available ? (
                          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        ) : (
                          <span className="px-2 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-medium rounded-full">
                            Soon
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
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
                <div className="text-3xl font-bold text-gradient">18</div>
                <div className="text-sm text-muted-foreground">
                  Active Calculators
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gradient-secondary">
                  11
                </div>
                <div className="text-sm text-muted-foreground">Coming Soon</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gradient">8</div>
                <div className="text-sm text-muted-foreground">Categories</div>
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
