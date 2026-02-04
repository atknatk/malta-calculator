import type { Metadata, Viewport } from "next";

export const SITE_NAME = "Malta Calculator";
export const SITE_URL = "https://maltacalculator.com";

// Primary OG Image - optimized for social sharing
export const OG_IMAGE = {
  url: `${SITE_URL}/og-image.png`,
  secureUrl: `${SITE_URL}/og-image.png`,
  width: 1200,
  height: 630,
  alt: "Malta Salary Calculator - Calculate your net salary instantly with accurate 2024-2026 tax rates",
  type: "image/png",
};

export const TITLE =
  "Malta Salary Calculator 2026 | Free Tax, SSC & Net Pay Calculator";
export const TITLE_SHORT = "Malta Salary Calculator";
export const DESCRIPTION =
  "Calculate your Malta net salary with accurate 2024-2026 tax brackets, SSC contributions, and COLA. Free instant results for single, married, and parent taxpayers. The #1 Malta salary calculator.";
export const DESCRIPTION_SHORT =
  "Free Malta salary calculator with 2024-2026 tax rates, SSC contributions & COLA. Calculate your net pay instantly.";

export const KEYWORDS = [
  "Malta salary calculator",
  "Malta salary calculator 2026",
  "Malta tax calculator",
  "Malta net salary",
  "Malta gross to net",
  "salary calculator Malta",
  "Malta SSC calculator",
  "Malta social security contributions",
  "Malta COLA",
  "Malta income tax",
  "Malta payroll calculator",
  "Malta 2026 tax rates",
  "Malta 2025 tax rates",
  "Malta 2024 tax rates",
  "net salary Malta",
  "Malta salary",
  "Malta take home pay",
  "Malta net pay calculator",
  "Malta employment tax",
  "Malta tax brackets",
];

export const defaultMetadata: Metadata = {
  title: {
    template: `%s | ${SITE_NAME}`,
    default: TITLE,
  },
  description: DESCRIPTION,
  keywords: KEYWORDS,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  category: "finance",
  classification: "Calculator Tool",
  alternates: {
    canonical: "/",
    languages: {
      "en-MT": "/",
      en: "/",
    },
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your verification codes here when available
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // bing: "your-bing-verification-code",
  },
  other: {
    "msapplication-TileColor": "#f59e0b",
    "theme-color": "#1a1a2e",
  },
};

export const twitterMetadata: Metadata["twitter"] = {
  title: TITLE,
  description: DESCRIPTION_SHORT,
  card: "summary_large_image",
  site: "@maltacalculator",
  creator: "@maltacalculator",
  images: [OG_IMAGE],
};

export const ogMetadata: Metadata["openGraph"] = {
  title: TITLE,
  description: DESCRIPTION,
  type: "website",
  locale: "en_MT",
  alternateLocale: ["en_GB", "en_US"],
  url: SITE_URL,
  siteName: SITE_NAME,
  countryName: "Malta",
  images: [OG_IMAGE],
};

// Viewport configuration to prevent iOS Safari zoom on input focus
export const viewportConfig: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#1a1a2e" },
  ],
  colorScheme: "light dark",
};

// Helper function to generate page-specific metadata
export function generatePageMetadata({
  title,
  description,
  path,
  image,
}: {
  title: string;
  description: string;
  path: string;
  image?: typeof OG_IMAGE;
}): Metadata {
  const pageUrl = `${SITE_URL}${path}`;
  const pageImage = image || OG_IMAGE;

  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: SITE_NAME,
      locale: "en_MT",
      type: "website",
      images: [pageImage],
    },
    twitter: {
      title,
      description,
      card: "summary_large_image",
      site: "@maltacalculator",
      creator: "@maltacalculator",
      images: [pageImage],
    },
  };
}
