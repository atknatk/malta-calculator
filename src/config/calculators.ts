/**
 * Tek kaynak (single source of truth) — tüm aktif hesaplayıcıların kaydı.
 *
 * Hem /calculators index sayfası hem de "Related Calculators" iç-bağlantı
 * widget'ı buradan beslenir. Saf veri (build-time sabiti) olduğu için statik
 * üretimi (force-static) etkilemez ve hiçbir client JS eklemez.
 */

export interface CalculatorInfo {
  /** URL slug, örn. "stamp-duty" (salary için "salary") */
  slug: string;
  /** Tam yol, örn. "/calculators/stamp-duty" */
  href: string;
  /** Kart başlığı */
  title: string;
  /** Kısa açıklama (kart alt metni) */
  tagline: string;
  /** Kategori başlığı (index sayfasında gruplama için) */
  category: string;
}

/**
 * Kategori sırası ve görsel meta — ikon/gradient JSX olduğu için sayfada
 * (calculators/page.tsx) kategori başlığına göre eşlenir.
 */
export const CALCULATOR_CATEGORIES: readonly string[] = [
  "Employment & Salary",
  "Family & Children",
  "Property & Housing",
  "Banking & Loans",
  "Retirement & Savings",
  "Self-Employment",
  "Leave & Time Off",
  "Transport & Vehicles",
  "Immigration & Visa",
] as const;

export const CALCULATORS: CalculatorInfo[] = [
  // Employment & Salary
  {
    slug: "salary",
    href: "/salary",
    title: "Salary Calculator",
    tagline: "Net salary with tax, SSC & COLA",
    category: "Employment & Salary",
  },
  {
    slug: "notice-period",
    href: "/calculators/notice-period",
    title: "Notice Period",
    tagline: "Required notice based on service years",
    category: "Employment & Salary",
  },
  {
    slug: "overtime",
    href: "/calculators/overtime",
    title: "Overtime Calculator",
    tagline: "Overtime pay at 1.5x and 2x rates",
    category: "Employment & Salary",
  },
  {
    slug: "bonus-tax",
    href: "/calculators/bonus-tax",
    title: "Bonus Tax",
    tagline: "Marginal tax on bonuses & 13th salary",
    category: "Employment & Salary",
  },
  {
    slug: "part-time",
    href: "/calculators/part-time",
    title: "Part-Time Tax",
    tagline: "10% rate (TA22/TA23) vs declaring",
    category: "Employment & Salary",
  },
  {
    slug: "expatriate-tax",
    href: "/calculators/expatriate-tax",
    title: "Highly Skilled Individuals Tax",
    tagline: "15% flat rate (LN 20/2026, ex-HQP)",
    category: "Employment & Salary",
  },

  // Family & Children
  {
    slug: "childcare",
    href: "/calculators/childcare",
    title: "Free Childcare",
    tagline: "Free hours from your working hours",
    category: "Family & Children",
  },
  {
    slug: "maternity",
    href: "/calculators/maternity",
    title: "Maternity/Paternity Leave",
    tagline: "18 weeks pay: employer + €213.54 benefit",
    category: "Family & Children",
  },
  {
    slug: "children-allowance",
    href: "/calculators/children-allowance",
    title: "Children's Allowance",
    tagline: "Weekly allowance for children under 16",
    category: "Family & Children",
  },
  {
    slug: "in-work-benefit",
    href: "/calculators/in-work-benefit",
    title: "In-Work Benefit",
    tagline: "Up to €1,627 per child for workers",
    category: "Family & Children",
  },

  // Property & Housing
  {
    slug: "stamp-duty",
    href: "/calculators/stamp-duty",
    title: "Stamp Duty",
    tagline: "Property purchase stamp duty (5% / 3.5%)",
    category: "Property & Housing",
  },
  {
    slug: "property-transfer-tax",
    href: "/calculators/property-transfer-tax",
    title: "Property Transfer Tax",
    tagline: "Seller's 8% final withholding tax",
    category: "Property & Housing",
  },
  {
    slug: "rental-tax",
    href: "/calculators/rental-tax",
    title: "Rental Tax",
    tagline: "15% flat rate vs progressive comparison",
    category: "Property & Housing",
  },
  {
    slug: "first-time-buyer",
    href: "/calculators/first-time-buyer",
    title: "First-Time Buyer",
    tagline: "Duty exemption + €10k grant + UCA",
    category: "Property & Housing",
  },

  // Banking & Loans
  {
    slug: "mortgage",
    href: "/calculators/mortgage",
    title: "Mortgage Calculator",
    tagline: "Home loan with 10% min deposit",
    category: "Banking & Loans",
  },
  {
    slug: "savings-interest",
    href: "/calculators/savings-interest",
    title: "Savings Interest",
    tagline: "Compound interest with 15% tax",
    category: "Banking & Loans",
  },
  {
    slug: "bank-interest-tax",
    href: "/calculators/bank-interest-tax",
    title: "Bank Interest Tax",
    tagline: "15% withholding vs declaring gross",
    category: "Banking & Loans",
  },
  {
    slug: "personal-loan",
    href: "/calculators/personal-loan",
    title: "Personal Loan",
    tagline: "Personal loan repayment calculator",
    category: "Banking & Loans",
  },
  {
    slug: "vehicle-finance",
    href: "/calculators/vehicle-finance",
    title: "Vehicle Finance",
    tagline: "Car loan & hire purchase with deposit",
    category: "Banking & Loans",
  },
  {
    slug: "malta-mortgage-rates",
    href: "/calculators/malta-mortgage-rates",
    title: "Mortgage Rates Comparison",
    tagline: "Compare home loan rates by Malta bank",
    category: "Banking & Loans",
  },
  {
    slug: "malta-savings-rates",
    href: "/calculators/malta-savings-rates",
    title: "Savings Rates Comparison",
    tagline: "Compare deposit & savings rates in Malta",
    category: "Banking & Loans",
  },
  {
    slug: "malta-personal-loan-rates",
    href: "/calculators/malta-personal-loan-rates",
    title: "Personal Loan Rates Comparison",
    tagline: "Compare personal loan rates by Malta bank",
    category: "Banking & Loans",
  },

  // Retirement & Savings
  {
    slug: "pension",
    href: "/calculators/pension",
    title: "Pension Calculator",
    tagline: "Two-thirds pension & private pension tax credit",
    category: "Retirement & Savings",
  },
  {
    slug: "retirement-age",
    href: "/calculators/retirement-age",
    title: "Retirement Age",
    tagline: "Your retirement age calculation",
    category: "Retirement & Savings",
  },

  // Self-Employment
  {
    slug: "self-employed-tax",
    href: "/calculators/self-employed-tax",
    title: "Self-Employed Tax",
    tagline: "Tax + Class 2 SSC + PT instalments",
    category: "Self-Employment",
  },
  {
    slug: "self-employed-ssc",
    href: "/calculators/self-employed-ssc",
    title: "Self-Employed SSC",
    tagline: "Class 2 SSC: SA/SB/SC rates 2026",
    category: "Self-Employment",
  },

  // Leave & Time Off
  {
    slug: "vacation",
    href: "/calculators/vacation",
    title: "Vacation Days",
    tagline: "Annual leave entitlement (min 192h)",
    category: "Leave & Time Off",
  },
  {
    slug: "sick-leave",
    href: "/calculators/sick-leave",
    title: "Sick Leave",
    tagline: "Employer days + sickness benefit 2026",
    category: "Leave & Time Off",
  },

  // Transport & Vehicles
  {
    slug: "vehicle-registration-fee",
    href: "/calculators/vehicle-registration-fee",
    title: "Vehicle Registration Fee",
    tagline: "All fees for registering a vehicle",
    category: "Transport & Vehicles",
  },
  {
    slug: "vehicle-registration-tax",
    href: "/calculators/vehicle-registration-tax",
    title: "Vehicle Registration Tax",
    tagline: "CO2-based registration tax",
    category: "Transport & Vehicles",
  },
  {
    slug: "road-license",
    href: "/calculators/road-license",
    title: "Road License",
    tagline: "Annual circulation tax by engine",
    category: "Transport & Vehicles",
  },
  {
    slug: "drivers-license",
    href: "/calculators/drivers-license",
    title: "Driver's License Fees",
    tagline: "License, tests & renewal costs",
    category: "Transport & Vehicles",
  },
  {
    slug: "vrt",
    href: "/calculators/vrt",
    title: "VRT (MOT) Fees",
    tagline: "Vehicle roadworthiness test costs",
    category: "Transport & Vehicles",
  },
  {
    slug: "import-vehicle",
    href: "/calculators/import-vehicle",
    title: "Import Vehicle",
    tagline: "Total cost to import a vehicle",
    category: "Transport & Vehicles",
  },

  // Immigration & Visa
  {
    slug: "family-reunification",
    href: "/calculators/family-reunification",
    title: "Family Reunification",
    tagline: "Salary requirements for sponsoring family",
    category: "Immigration & Visa",
  },
];

/** Slug → CalculatorInfo hızlı arama tablosu. */
export const CALCULATOR_BY_SLUG: Record<string, CalculatorInfo> =
  Object.fromEntries(CALCULATORS.map((c) => [c.slug, c]));

/**
 * Her hesaplayıcı için ilgili (related) hesaplayıcı slug'ları.
 * Kullanıcının doğal "bir sonraki adımı" mantığıyla seçildi — hem SEO iç
 * bağlantısı hem dönüşüm için.
 */
export const RELATED_CALCULATORS: Record<string, string[]> = {
  salary: ["bonus-tax", "part-time", "expatriate-tax"],
  "notice-period": ["vacation", "sick-leave", "maternity"],
  overtime: ["salary", "bonus-tax", "part-time"],
  "bonus-tax": ["salary", "part-time", "expatriate-tax"],
  "part-time": ["bonus-tax", "salary", "self-employed-tax"],
  "expatriate-tax": ["salary", "rental-tax", "bank-interest-tax"],
  childcare: ["maternity", "children-allowance", "in-work-benefit"],
  maternity: ["sick-leave", "children-allowance", "in-work-benefit"],
  "children-allowance": ["in-work-benefit", "childcare", "maternity"],
  "in-work-benefit": ["children-allowance", "childcare", "salary"],
  "stamp-duty": ["first-time-buyer", "property-transfer-tax", "mortgage"],
  "property-transfer-tax": ["stamp-duty", "rental-tax", "first-time-buyer"],
  "rental-tax": ["property-transfer-tax", "bank-interest-tax", "stamp-duty"],
  "first-time-buyer": ["stamp-duty", "mortgage", "malta-mortgage-rates"],
  mortgage: ["malta-mortgage-rates", "first-time-buyer", "stamp-duty"],
  "savings-interest": ["malta-savings-rates", "bank-interest-tax", "pension"],
  "bank-interest-tax": [
    "malta-savings-rates",
    "savings-interest",
    "rental-tax",
  ],
  "malta-mortgage-rates": [
    "mortgage",
    "first-time-buyer",
    "malta-savings-rates",
  ],
  "malta-savings-rates": [
    "savings-interest",
    "bank-interest-tax",
    "malta-mortgage-rates",
  ],
  "personal-loan": ["malta-personal-loan-rates", "vehicle-finance", "mortgage"],
  "malta-personal-loan-rates": [
    "personal-loan",
    "vehicle-finance",
    "malta-mortgage-rates",
  ],
  "vehicle-finance": ["personal-loan", "import-vehicle", "road-license"],
  pension: ["retirement-age", "savings-interest", "salary"],
  "retirement-age": ["pension", "salary", "savings-interest"],
  "self-employed-tax": ["self-employed-ssc", "part-time", "salary"],
  "self-employed-ssc": ["self-employed-tax", "pension", "salary"],
  vacation: ["sick-leave", "notice-period", "maternity"],
  "sick-leave": ["vacation", "maternity", "notice-period"],
  "vehicle-registration-fee": [
    "vehicle-registration-tax",
    "vrt",
    "road-license",
  ],
  "vehicle-registration-tax": [
    "vehicle-registration-fee",
    "import-vehicle",
    "road-license",
  ],
  "road-license": ["vehicle-registration-tax", "vrt", "vehicle-finance"],
  "drivers-license": ["vrt", "road-license", "vehicle-registration-fee"],
  vrt: ["vehicle-registration-fee", "road-license", "drivers-license"],
  "import-vehicle": ["vehicle-registration-tax", "vehicle-finance", "vrt"],
  "family-reunification": ["expatriate-tax", "salary", "children-allowance"],
};

/** Bir hesaplayıcının ilgili hesaplayıcılarını (var olanları) döndürür. */
export function getRelatedCalculators(slug: string): CalculatorInfo[] {
  return (RELATED_CALCULATORS[slug] ?? [])
    .map((s) => CALCULATOR_BY_SLUG[s])
    .filter((c): c is CalculatorInfo => Boolean(c));
}
