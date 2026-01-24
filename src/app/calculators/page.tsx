import { MarketingLayout } from "@/components/layout/marketing-layout";
import type { Metadata } from "next";
import {
    defaultMetadata,
    ogMetadata,
    twitterMetadata,
    SITE_URL,
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
} from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
    ...defaultMetadata,
    title: "All Calculators | Malta Calculator",
    description:
        "Malta için tüm finansal hesaplayıcılar. Maaş, vergi, SSC, emeklilik, çocuk yardımı, kira vergisi ve daha fazlası. All financial calculators for Malta - salary, tax, SSC, pension, childcare, rental tax and more.",
    alternates: {
        canonical: `${SITE_URL}/calculators`,
    },
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
    titleTr: string;
    description: string;
    available: boolean;
}

interface CalculatorCategory {
    title: string;
    titleTr: string;
    icon: React.ReactNode;
    gradient: string;
    items: CalculatorItem[];
}

const categories: CalculatorCategory[] = [
    {
        title: "Employment & Salary",
        titleTr: "İstihdam & Maaş",
        icon: <Briefcase className="h-6 w-6 text-white" />,
        gradient: "from-amber-500 to-orange-600",
        items: [
            {
                href: "/salary",
                title: "Salary Calculator",
                titleTr: "Maaş Hesaplayıcı",
                description: "Net salary with tax, SSC & COLA",
                available: true,
            },
            {
                href: "/calculators/notice-period",
                title: "Notice Period",
                titleTr: "İhbar Süresi",
                description: "Required notice based on service years",
                available: true,
            },
            {
                href: "/calculators/overtime",
                title: "Overtime Calculator",
                titleTr: "Fazla Mesai",
                description: "Overtime pay at 1.5x and 2x rates",
                available: true,
            },
            {
                href: "/calculators/bonus-tax",
                title: "Bonus Tax",
                titleTr: "Bonus Vergisi",
                description: "Tax on one-time bonuses",
                available: false,
            },
            {
                href: "/calculators/part-time",
                title: "Part-Time Salary",
                titleTr: "Yarı Zamanlı Maaş",
                description: "Pro-rata calculations for part-time",
                available: false,
            },
            {
                href: "/calculators/expatriate-tax",
                title: "Expatriate Tax (HQP)",
                titleTr: "Yabancı Vergi (HQP)",
                description: "15% flat tax for highly qualified persons",
                available: false,
            },
        ],
    },
    {
        title: "Family & Children",
        titleTr: "Aile & Çocuk",
        icon: <Baby className="h-6 w-6 text-white" />,
        gradient: "from-pink-500 to-rose-600",
        items: [
            {
                href: "/calculators/childcare",
                title: "Childcare Subsidy",
                titleTr: "Kreş Yardımı",
                description: "Childcare support based on income",
                available: false,
            },
            {
                href: "/calculators/maternity",
                title: "Maternity/Paternity Leave",
                titleTr: "Doğum İzni",
                description: "Leave duration and pay calculation",
                available: false,
            },
            {
                href: "/calculators/children-allowance",
                title: "Children&apos;s Allowance",
                titleTr: "Çocuk Yardımı",
                description: "Monthly allowance per child",
                available: false,
            },
            {
                href: "/calculators/in-work-benefit",
                title: "In-Work Benefit",
                titleTr: "Çalışma Desteği",
                description: "Support for low-income working families",
                available: false,
            },
        ],
    },
    {
        title: "Property & Housing",
        titleTr: "Gayrimenkul & Konut",
        icon: <Home className="h-6 w-6 text-white" />,
        gradient: "from-emerald-500 to-green-600",
        items: [
            {
                href: "/calculators/stamp-duty",
                title: "Stamp Duty",
                titleTr: "Damga Vergisi",
                description: "Property purchase stamp duty (5% / 3.5%)",
                available: true,
            },
            {
                href: "/calculators/rental-tax",
                title: "Rental Tax",
                titleTr: "Kira Vergisi",
                description: "15% flat rate rental income tax",
                available: false,
            },
            {
                href: "/calculators/first-time-buyer",
                title: "First-Time Buyer",
                titleTr: "İlk Ev Alımı",
                description: "First-time buyer scheme benefits",
                available: false,
            },
        ],
    },
    {
        title: "Banking & Loans",
        titleTr: "Bankacılık & Krediler",
        icon: <Landmark className="h-6 w-6 text-white" />,
        gradient: "from-sky-500 to-blue-600",
        items: [
            {
                href: "/calculators/mortgage",
                title: "Mortgage Calculator",
                titleTr: "Konut Kredisi",
                description: "Home loan with 10% min deposit",
                available: true,
            },
            {
                href: "/calculators/savings-interest",
                title: "Savings Interest",
                titleTr: "Mevduat Faizi",
                description: "Compound interest with 15% tax",
                available: true,
            },
            {
                href: "/calculators/personal-loan",
                title: "Personal Loan",
                titleTr: "Bireysel Kredi",
                description: "Personal loan repayment calculator",
                available: true,
            },
        ],
    },
    {
        title: "Retirement & Savings",
        titleTr: "Emeklilik & Tasarruf",
        icon: <Palmtree className="h-6 w-6 text-white" />,
        gradient: "from-blue-500 to-cyan-600",
        items: [
            {
                href: "/calculators/pension",
                title: "Pension Estimator",
                titleTr: "Emekli Maaşı Tahmini",
                description: "Estimated state pension amount",
                available: false,
            },
            {
                href: "/calculators/retirement-age",
                title: "Retirement Age",
                titleTr: "Emeklilik Yaşı",
                description: "Your retirement age calculation",
                available: true,
            },
        ],
    },
    {
        title: "Self-Employment",
        titleTr: "Serbest Meslek",
        icon: <Calculator className="h-6 w-6 text-white" />,
        gradient: "from-violet-500 to-purple-600",
        items: [
            {
                href: "/calculators/self-employed-tax",
                title: "Self-Employed Tax",
                titleTr: "Serbest Meslek Vergisi",
                description: "Income tax for self-employed",
                available: false,
            },
            {
                href: "/calculators/self-employed-ssc",
                title: "Self-Employed SSC",
                titleTr: "Serbest Meslek SSC",
                description: "Class 2 SSC contributions",
                available: false,
            },
        ],
    },
    {
        title: "Leave & Time Off",
        titleTr: "İzin & Tatil",
        icon: <Calendar className="h-6 w-6 text-white" />,
        gradient: "from-teal-500 to-emerald-600",
        items: [
            {
                href: "/calculators/vacation",
                title: "Vacation Days",
                titleTr: "Yıllık İzin",
                description: "Annual leave entitlement (min 192h)",
                available: true,
            },
            {
                href: "/calculators/sick-leave",
                title: "Sick Leave",
                titleTr: "Hastalık İzni",
                description: "Sick leave duration and pay",
                available: false,
            },
        ],
    },
    {
        title: "Transport & Vehicles",
        titleTr: "Ulaşım & Araçlar",
        icon: <Car className="h-6 w-6 text-white" />,
        gradient: "from-slate-500 to-zinc-600",
        items: [
            {
                href: "/calculators/vehicle-registration-tax",
                title: "Vehicle Registration Tax",
                titleTr: "Araç Kayıt Vergisi",
                description: "CO2-based registration tax",
                available: true,
            },
            {
                href: "/calculators/road-license",
                title: "Road License",
                titleTr: "Yıllık Araç Vergisi",
                description: "Annual circulation tax by engine",
                available: true,
            },
            {
                href: "/calculators/drivers-license",
                title: "Driver's License Fees",
                titleTr: "Ehliyet Ücretleri",
                description: "License, tests & renewal costs",
                available: true,
            },
            {
                href: "/calculators/vrt",
                title: "VRT (MOT) Fees",
                titleTr: "Muayene Ücreti",
                description: "Vehicle roadworthiness test costs",
                available: true,
            },
            {
                href: "/calculators/import-vehicle",
                title: "Import Vehicle",
                titleTr: "Araç İthalatı",
                description: "Total cost to import a vehicle",
                available: true,
            },
        ],
    },
];

export default function CalculatorsPage() {
    return (
        <MarketingLayout>
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
                            Malta&apos;da yaşayan ve çalışanlar için kapsamlı finansal hesaplama araçları.
                            <br />
                            Comprehensive financial calculation tools for Malta residents.
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
                                            category.gradient
                                        )}
                                    >
                                        {category.icon}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-cal font-bold">
                                            {category.title}
                                        </h2>
                                        <p className="text-muted-foreground">{category.titleTr}</p>
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
                                                    : "bg-muted/30 hover:bg-muted/50"
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
                                            <p className="text-sm text-muted-foreground mb-1">
                                                {item.titleTr}
                                            </p>
                                            <p className="text-sm text-muted-foreground/70">
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
                                <div className="text-3xl font-bold text-gradient">14</div>
                                <div className="text-sm text-muted-foreground">Active Calculators</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-gradient-secondary">14</div>
                                <div className="text-sm text-muted-foreground">Coming Soon</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-gradient">8</div>
                                <div className="text-sm text-muted-foreground">Categories</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-gradient-secondary">Free</div>
                                <div className="text-sm text-muted-foreground">Forever</div>
                            </div>
                        </div>
                    </div>
                </Shell>
            </main>
        </MarketingLayout>
    );
}

export const revalidate = false;          // tamamen statik (build-time)
export const dynamic = 'force-static';    // bu segmenti statik olmaya zorla
