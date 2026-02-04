import { MarketingLayout } from "@/components/layout/marketing-layout";
import { Shell } from "@/components/dashboard/shell";
import type { Metadata } from "next";
import {
  defaultMetadata,
  ogMetadata,
  twitterMetadata,
  SITE_URL,
  SITE_NAME,
} from "@/app/shared-metadata";
import { TimerCreator } from "./_components/timer-creator";

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Countdown Timer | Create & Share Timers",
  description:
    "Create shareable countdown timers for meetings, events, and deadlines. Free online timer with sound notifications and beautiful design.",
  keywords: [
    "countdown timer",
    "online timer",
    "shareable timer",
    "meeting timer",
    "event countdown",
    "free timer",
    "countdown clock",
    "timer with alarm",
  ],
  alternates: { canonical: `${SITE_URL}/timer` },
  openGraph: {
    ...ogMetadata,
    title: "Countdown Timer | Create & Share Timers",
    description:
      "Create shareable countdown timers for meetings, events, and deadlines. Free online timer.",
    url: `${SITE_URL}/timer`,
  },
  twitter: {
    ...twitterMetadata,
    title: "Countdown Timer | Create & Share Timers",
    description:
      "Create shareable countdown timers for meetings, events, and deadlines. Free online timer.",
  },
};

function TimerJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Countdown Timer",
    description:
      "Create shareable countdown timers for meetings, events, and deadlines. Share timer links with anyone.",
    url: `${SITE_URL}/timer`,
    applicationCategory: "UtilityApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
    },
    featureList: [
      "Create countdown timers up to 30 days",
      "Shareable timer links",
      "Sound notifications",
      "Custom timer titles",
      "Real-time countdown",
      "Mobile responsive design",
    ],
    creator: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    isAccessibleForFree: true,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default function TimerPage() {
  return (
    <MarketingLayout>
      <TimerJsonLd />
      <main role="main" aria-label="Countdown Timer Creator">
        <Shell className="max-w-2xl py-8">
          <TimerCreator />
        </Shell>
      </main>
    </MarketingLayout>
  );
}

export const revalidate = false;
export const dynamic = "force-static";
