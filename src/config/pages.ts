import { ValidIcon } from "@/components/icons";

export type Page = {
  title: string;
  description: string;
  href: string;
  icon: ValidIcon;
  disabled?: boolean;
  segment: string;
  children?: Page[];
};

export const settingsPagesConfig: Page[] = [
  {
    title: "Salary",
    description: "Malta Salary & Tax Calculator",
    href: "/settings/general",
    icon: "cog",
    segment: "general",
  },
  {
    title: "Team",
    description: "Team settings for the workspace.",
    href: "/settings/team",
    icon: "users",
    segment: "team",
  },
  {
    title: "API Token",
    description: "API token settings for the workspace.",
    href: "/settings/api-token",
    icon: "key",
    segment: "api-token",
  },
  {
    title: "Billing",
    description: "Billing settings for the workspace.",
    href: "/settings/billing",
    icon: "credit-card",
    segment: "billing",
  },
  {
    title: "Appearance",
    description: "Appearance settings for the workspace.",
    href: "/settings/appearance",
    icon: "sun",
    segment: "appearance",
  },
  {
    title: "User",
    description: "Profile settings for the user.",
    href: "/settings/user",
    icon: "user",
    segment: "user",
  },
];

export const monitorPagesConfig: Page[] = [
  {
    title: "Overview",
    description: "Dashboard with all the metrics and charts.",
    href: "/monitors/[id]/overview",
    icon: "line-chart",
    segment: "overview",
  },
  {
    title: "Response logs",
    description: "Data table with all response details.",
    href: "/monitors/[id]/data",
    icon: "table",
    segment: "data",
  },
  {
    title: "Settings",
    description: "Edit section for the monitor.",
    href: "/monitors/[id]/edit",
    icon: "cog",
    segment: "edit",
  },
];

export const statusPagesPagesConfig: Page[] = [
  {
    title: "Settings",
    description: "Edit section for the status page.",
    href: "/status-pages/[id]/edit",
    icon: "cog",
    segment: "edit",
  },
  {
    title: "Domain",
    description: "Where you can see the domain settings.",
    href: "/status-pages/[id]/domain",
    icon: "globe",
    segment: "domain",
  },
  {
    title: "Subscribers",
    description: "Where you can see all the subscribers.",
    href: "/status-pages/[id]/subscribers",
    icon: "users",
    segment: "subscribers",
  },
];

const incidentPagesConfig: Page[] = [
  {
    title: "Overview",
    description: "Timeline with all the actions.",
    href: "/incidents/[id]/overview",
    icon: "file-clock",
    segment: "overview",
  },
];

export const statusReportsPagesConfig: Page[] = [
  {
    title: "Overview",
    description: "Overview of the status report.",
    href: "/status-reports/[id]/overview",
    icon: "megaphone",
    segment: "overview",
  },
  {
    title: "Settings",
    description: "Edit section for the status report.",
    href: "/status-reports/[id]/edit",
    icon: "cog",
    segment: "edit",
  },
];

export const notificationsPagesConfig: Page[] = [
  {
    title: "Settings",
    description: "Edit section for the notifications.",
    href: "/notifications/[id]/edit",
    icon: "cog",
    segment: "edit",
  },
];

export type PageId = (typeof pagesConfig)[number]["segment"];

export const pagesConfig = [
  {
    title: "Monitors",
    description: "Check all the responses in one place.",
    href: "/monitors",
    icon: "activity",
    segment: "monitors",
    children: monitorPagesConfig,
  },
  {
    title: "Incidents",
    description: "All your incidents.",
    href: "/incidents",
    icon: "siren",
    segment: "incidents",
    children: incidentPagesConfig,
  },
  {
    title: "Status Pages",
    description: "Where you can see all the pages.",
    href: "/status-pages",
    icon: "panel-top",
    segment: "status-pages",
    children: statusPagesPagesConfig,
  },
  {
    title: "Status Reports",
    description: "War room where you handle the incidents.",
    href: "/status-reports",
    icon: "megaphone",
    segment: "status-reports",
    children: statusReportsPagesConfig,
  },
  {
    title: "Notifications",
    description: "Where you can see all the notifications.",
    href: "/notifications",
    icon: "bell",
    segment: "notifications",
    children: notificationsPagesConfig,
  },
  {
    title: "Real User Monitoring",
    description: "Get speed insights for your application.",
    href: "/rum",
    icon: "ratio",
    segment: "rum",
  },
  {
    title: "Settings",
    description: "Your workspace settings",
    href: "/settings/general",
    icon: "cog",
    segment: "settings",
    children: settingsPagesConfig,
  },
] as const satisfies readonly Page[];

export const marketingPagesConfig = [
  {
    href: "/salary",
    title: "Salary Calculator",
    description: "Calculate net salary with tax, SSC & COLA",
    segment: "salary",
    icon: "candlestick-chart",
  },
  {
    href: "/calculators",
    title: "All Calculators",
    description: "Browse all 9+ Malta financial calculators",
    segment: "calculators",
    icon: "layout-dashboard",
  },
  {
    href: "/blog",
    title: "Blog",
    description: "Guides, tips, and Malta financial information",
    segment: "blog",
    icon: "book",
  },
  {
    href: "/pricing",
    title: "Pricing",
    description: "Simple, transparent pricing for payslip generation",
    segment: "pricing",
    icon: "credit-card",
  },
  {
    href: "/about",
    title: "About",
    description: "About Malta Calculator",
    segment: "about",
    icon: "users",
  },
] as const satisfies readonly Page[];

export function getPageBySegment(
  segment: string | string[],
  currentPage: readonly Page[] = pagesConfig,
): Page | undefined {
  if (typeof segment === "string") {
    const page = currentPage.find((page) => page.segment === segment);
    return page;
  }
  if (Array.isArray(segment) && segment.length > 0) {
    const [firstSegment, ...restSegments] = segment;
    const childPage = currentPage.find((page) => page.segment === firstSegment);
    if (childPage?.children) {
      return getPageBySegment(restSegments, childPage.children);
    }
    return childPage;
  }
  return undefined;
}
