import { notFound } from "next/navigation";
import { MarketingLayout } from "@/components/layout/marketing-layout";
import { Shell } from "@/components/dashboard/shell";
import type { Metadata } from "next";
import {
  SITE_URL,
  SITE_NAME,
} from "@/app/shared-metadata";
import { CountdownDisplay } from "../_components/countdown-display";
import {
  decodeTimer,
  getTimeRemaining,
  formatDurationHuman,
  formatTimeDisplay,
  isTimerExpired,
} from "@/lib/timer-encoding";

interface PageProps {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ title?: string }>;
}

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const { token } = await params;
  const { title: customTitle } = await searchParams;

  const timerData = decodeTimer(token);

  if (!timerData) {
    return {
      title: "Timer Not Found | Malta Calculator",
      robots: { index: false },
    };
  }

  const remaining = getTimeRemaining(timerData);
  const expired = isTimerExpired(timerData);
  const durationStr = formatDurationHuman(timerData.duration);
  const timeDisplay = formatTimeDisplay(remaining);

  const remainingStr = expired
    ? "Finished"
    : `${String(timeDisplay.hours + timeDisplay.days * 24).padStart(2, "0")}:${String(timeDisplay.minutes).padStart(2, "0")}:${String(timeDisplay.seconds).padStart(2, "0")}`;

  const titlePrefix = customTitle ? `${customTitle} - ` : "";
  const title = expired
    ? `${titlePrefix}Timer Finished | ${durationStr} Countdown`
    : `${titlePrefix}${remainingStr} Remaining | Countdown Timer`;

  const description = expired
    ? `This ${durationStr} countdown timer has finished. Create your own shareable countdown timer for free.`
    : `Watch this ${durationStr} countdown timer. ${formatDurationHuman(remaining)} remaining. Create and share your own timers for free.`;

  const titleParam = customTitle ? `&title=${encodeURIComponent(customTitle)}` : "";
  const ogImageUrl = `${SITE_URL}/api/og/timer?token=${token}${titleParam}`;

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/timer/${token}`,
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/timer/${token}`,
      siteName: SITE_NAME,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: customTitle || `Countdown Timer - ${durationStr}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

function TimerJsonLd({
  token,
  duration,
  createdAt,
  title,
}: {
  token: string;
  duration: number;
  createdAt: number;
  title?: string;
}) {
  const endTime = new Date((createdAt + duration) * 1000).toISOString();
  const startTime = new Date(createdAt * 1000).toISOString();
  const timerName = title || `Countdown Timer - ${formatDurationHuman(duration)}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: timerName,
    description: `A shareable countdown timer set for ${formatDurationHuman(duration)}.`,
    url: `${SITE_URL}/timer/${token}`,
    applicationCategory: "UtilityApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
    },
    dateCreated: startTime,
    expires: endTime,
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

export default async function TimerDisplayPage({
  params,
  searchParams,
}: PageProps) {
  const { token } = await params;
  const { title } = await searchParams;

  const timerData = decodeTimer(token);

  if (!timerData) {
    notFound();
  }

  const titleParam = title ? `?title=${encodeURIComponent(title)}` : "";
  const fullUrl = `${SITE_URL}/timer/${token}${titleParam}`;

  return (
    <MarketingLayout>
      <TimerJsonLd
        token={token}
        duration={timerData.duration}
        createdAt={timerData.createdAt}
        title={title}
      />
      <main role="main" aria-label="Countdown Timer">
        <Shell className="max-w-2xl py-8">
          <CountdownDisplay
            timerData={timerData}
            title={title}
            url={fullUrl}
          />
        </Shell>
      </main>
    </MarketingLayout>
  );
}
