import { MarketingLayout } from "@/components/layout/marketing-layout";
import type { Metadata } from "next";
import {
  defaultMetadata,
  ogMetadata,
  twitterMetadata,
  SITE_URL,
  getBlogOgImage,
} from "@/app/shared-metadata";
import { Shell } from "@/components/dashboard/shell";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  Calculator,
  Sun,
  Church,
  Flag,
  Gift,
  PartyPopper,
} from "lucide-react";
import { ArticleJsonLd, BreadcrumbJsonLd } from "@/components/json-ld";
import { BlogArticleFooter } from "@/components/blog/blog-article-footer";
import { BlogArticleAuthor } from "@/components/blog/blog-article-author";

const ARTICLE_SOURCES = [
  {
    name: "Department of Industrial & Employment Relations (DIER)",
    url: "https://dier.gov.mt",
  },
  {
    name: "Government of Malta - Public Holidays",
    url: "https://www.gov.mt/en/About%20Malta/Pages/Public%20Holidays.aspx",
  },
];

export const metadata: Metadata = {
  ...defaultMetadata,
  title:
    "Malta Public Holidays 2026: Complete List of 14 Official Holidays | Malta Calculator",
  description:
    "Complete guide to Malta's 14 public holidays in 2026. Dates, meanings, long weekends & which holidays fall on weekends. Plan your year!",
  keywords: [
    "Malta public holidays 2026",
    "Malta holidays 2026",
    "Malta bank holidays",
    "Malta national holidays",
    "Malta festa 2026",
    "Malta holiday calendar",
    "Malta public holiday dates",
    "Malta vacation planning 2026",
  ],
  alternates: {
    canonical: `${SITE_URL}/blog/malta-public-holidays-2026-complete-guide`,
  },
  openGraph: {
    ...ogMetadata,
    title: "Malta Public Holidays 2026: All 14 Official Dates",
    url: `${SITE_URL}/blog/malta-public-holidays-2026-complete-guide`,
    type: "article",
    images: [
      getBlogOgImage("Malta Public Holidays 2026: All 14 Official Dates"),
    ],
  },
  twitter: {
    ...twitterMetadata,
    title: "Malta Public Holidays 2026: All 14 Official Dates",
  },
};

const holidays = [
  {
    date: "1 January",
    day: "Thursday",
    name: "New Year's Day",
    maltese: "L-Ewwel tas-Sena",
    type: "public",
    icon: PartyPopper,
  },
  {
    date: "10 February",
    day: "Tuesday",
    name: "Feast of St. Paul's Shipwreck",
    maltese: "In-Nawfraġju ta' San Pawl",
    type: "religious",
    icon: Church,
  },
  {
    date: "19 March",
    day: "Thursday",
    name: "Feast of St. Joseph",
    maltese: "San Ġużepp",
    type: "religious",
    icon: Church,
  },
  {
    date: "31 March",
    day: "Tuesday",
    name: "Freedom Day",
    maltese: "Jum il-Ħelsien",
    type: "national",
    icon: Flag,
  },
  {
    date: "3 April",
    day: "Friday",
    name: "Good Friday",
    maltese: "Il-Ġimgħa l-Kbira",
    type: "religious",
    icon: Church,
  },
  {
    date: "1 May",
    day: "Friday",
    name: "Workers' Day",
    maltese: "Jum il-Ħaddiem",
    type: "public",
    icon: Sun,
  },
  {
    date: "7 June",
    day: "Sunday",
    name: "Sette Giugno",
    maltese: "Sette Giugno",
    type: "national",
    icon: Flag,
    weekend: true,
  },
  {
    date: "29 June",
    day: "Monday",
    name: "Feast of St. Peter & St. Paul",
    maltese: "L-Imnarja",
    type: "religious",
    icon: Church,
  },
  {
    date: "15 August",
    day: "Saturday",
    name: "Feast of the Assumption",
    maltese: "Santa Marija",
    type: "religious",
    icon: Church,
    weekend: true,
  },
  {
    date: "8 September",
    day: "Tuesday",
    name: "Victory Day",
    maltese: "Il-Vitorja",
    type: "national",
    icon: Flag,
  },
  {
    date: "21 September",
    day: "Monday",
    name: "Independence Day",
    maltese: "Jum l-Indipendenza",
    type: "national",
    icon: Flag,
  },
  {
    date: "8 December",
    day: "Tuesday",
    name: "Feast of the Immaculate Conception",
    maltese: "Il-Kunċizzjoni",
    type: "religious",
    icon: Church,
  },
  {
    date: "13 December",
    day: "Sunday",
    name: "Republic Day",
    maltese: "Jum ir-Repubblika",
    type: "national",
    icon: Flag,
    weekend: true,
  },
  {
    date: "25 December",
    day: "Friday",
    name: "Christmas Day",
    maltese: "Il-Milied",
    type: "religious",
    icon: Gift,
  },
];

export default function MaltaPublicHolidays2026GuidePage() {
  return (
    <MarketingLayout>
      <ArticleJsonLd
        title="Malta Public Holidays 2026: Complete List of 14 Official Holidays"
        description="Complete guide to Malta's 14 public holidays in 2026 with dates, meanings, and long weekend opportunities."
        slug="malta-public-holidays-2026-complete-guide"
        datePublished="2026-02-01"
        sources={ARTICLE_SOURCES}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: SITE_URL },
          { name: "Blog", url: `${SITE_URL}/blog` },
          {
            name: "Public Holidays 2026",
            url: `${SITE_URL}/blog/malta-public-holidays-2026-complete-guide`,
          },
        ]}
      />
      <main role="main">
        <Shell className="max-w-4xl py-12">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Blog
          </Link>

          <article className="prose prose-neutral dark:prose-invert max-w-none">
            <header className="mb-12 not-prose">
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <span className="px-3 py-1 bg-red-500/10 text-red-600 text-sm font-semibold rounded-full">
                  Holidays
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" /> February 2026
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" /> 8 min read
                </span>
              </div>
              <h1 className="font-cal text-4xl md:text-5xl font-bold mb-6">
                Malta Public Holidays 2026: Complete Guide
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                All 14 official public holidays in Malta for 2026. Plan your
                holidays, understand the history, and maximize your time off.
              </p>
            </header>

            {/* Quick Summary */}
            <div className="not-prose p-6 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl border border-border/50 mb-10">
              <h2 className="text-lg font-semibold mb-4">2026 Quick Facts</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="p-3 bg-background/50 rounded-xl">
                  <div className="text-2xl font-bold text-primary">14</div>
                  <div className="text-xs text-muted-foreground">
                    Total Holidays
                  </div>
                </div>
                <div className="p-3 bg-background/50 rounded-xl">
                  <div className="text-2xl font-bold text-green-600">5</div>
                  <div className="text-xs text-muted-foreground">
                    National Days
                  </div>
                </div>
                <div className="p-3 bg-background/50 rounded-xl">
                  <div className="text-2xl font-bold text-purple-600">7</div>
                  <div className="text-xs text-muted-foreground">
                    Religious Feasts
                  </div>
                </div>
                <div className="p-3 bg-background/50 rounded-xl">
                  <div className="text-2xl font-bold text-orange-600">3</div>
                  <div className="text-xs text-muted-foreground">
                    On Weekends
                  </div>
                </div>
              </div>
            </div>

            {/* Table of Contents */}
            <nav className="not-prose p-6 bg-muted/30 rounded-2xl mb-10">
              <h2 className="text-lg font-semibold mb-4">Table of Contents</h2>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#complete-list"
                    className="text-primary hover:underline"
                  >
                    Complete Holiday List 2026
                  </a>
                </li>
                <li>
                  <a
                    href="#long-weekends"
                    className="text-primary hover:underline"
                  >
                    Long Weekend Opportunities
                  </a>
                </li>
                <li>
                  <a
                    href="#national-holidays"
                    className="text-primary hover:underline"
                  >
                    National Holidays Explained
                  </a>
                </li>
                <li>
                  <a
                    href="#religious-feasts"
                    className="text-primary hover:underline"
                  >
                    Religious Feasts Explained
                  </a>
                </li>
                <li>
                  <a
                    href="#weekend-holidays"
                    className="text-primary hover:underline"
                  >
                    Holidays Falling on Weekends
                  </a>
                </li>
                <li>
                  <a
                    href="#employment-rights"
                    className="text-primary hover:underline"
                  >
                    Employment Rights
                  </a>
                </li>
              </ul>
            </nav>

            {/* Complete List */}
            <section id="complete-list">
              <h2>Complete Holiday List 2026</h2>
              <p>
                Malta celebrates 14 public holidays annually, consisting of 5
                national holidays, 7 religious feasts, and 2 other public
                holidays. Here is the complete list for 2026:
              </p>

              <div className="overflow-x-auto not-prose my-8">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border border-border p-3 text-left">
                        Date
                      </th>
                      <th className="border border-border p-3 text-left">
                        Day
                      </th>
                      <th className="border border-border p-3 text-left">
                        Holiday
                      </th>
                      <th className="border border-border p-3 text-left hidden md:table-cell">
                        Maltese Name
                      </th>
                      <th className="border border-border p-3 text-left">
                        Type
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {holidays.map((holiday, index) => (
                      <tr
                        key={index}
                        className={
                          holiday.weekend
                            ? "bg-orange-500/10"
                            : index % 2 === 0
                              ? ""
                              : "bg-muted/30"
                        }
                      >
                        <td className="border border-border p-3 font-semibold whitespace-nowrap">
                          {holiday.date}
                        </td>
                        <td className="border border-border p-3">
                          {holiday.day}
                        </td>
                        <td className="border border-border p-3">
                          <span className="flex items-center gap-2">
                            <holiday.icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                            {holiday.name}
                            {holiday.weekend && (
                              <span className="text-xs px-1.5 py-0.5 bg-orange-500/20 text-orange-600 rounded">
                                Weekend
                              </span>
                            )}
                          </span>
                        </td>
                        <td className="border border-border p-3 hidden md:table-cell text-muted-foreground italic">
                          {holiday.maltese}
                        </td>
                        <td className="border border-border p-3">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              holiday.type === "national"
                                ? "bg-green-500/10 text-green-600"
                                : holiday.type === "religious"
                                  ? "bg-purple-500/10 text-purple-600"
                                  : "bg-blue-500/10 text-blue-600"
                            }`}
                          >
                            {holiday.type === "national"
                              ? "National"
                              : holiday.type === "religious"
                                ? "Religious"
                                : "Public"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Long Weekends */}
            <section id="long-weekends" className="mt-12">
              <h2>Long Weekend Opportunities in 2026</h2>
              <p>
                Strategic leave planning can help you maximize your time off.
                Here are the best long weekend opportunities in 2026:
              </p>

              <div className="not-prose grid gap-4 my-6">
                <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-green-600 font-semibold">
                      Good Friday Weekend
                    </span>
                    <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-600 rounded-full">
                      4 days off
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    April 3 (Fri) - April 5 (Sun). Take no extra leave for a
                    4-day weekend!
                  </p>
                </div>

                <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-blue-600 font-semibold">
                      Workers&apos; Day Weekend
                    </span>
                    <span className="text-xs px-2 py-0.5 bg-blue-500/20 text-blue-600 rounded-full">
                      3 days off
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    May 1 (Fri) - May 3 (Sun). Natural 3-day weekend.
                  </p>
                </div>

                <div className="p-4 bg-purple-500/5 border border-purple-500/20 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-purple-600 font-semibold">
                      Mnarja Long Weekend
                    </span>
                    <span className="text-xs px-2 py-0.5 bg-purple-500/20 text-purple-600 rounded-full">
                      4 days off
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    June 27 (Sat) - June 30 (Tue). Take 1 day leave (Tue) for 4
                    days off!
                  </p>
                </div>

                <div className="p-4 bg-orange-500/5 border border-orange-500/20 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-orange-600 font-semibold">
                      Independence Day
                    </span>
                    <span className="text-xs px-2 py-0.5 bg-orange-500/20 text-orange-600 rounded-full">
                      3 days off
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    September 19 (Sat) - September 21 (Mon). Natural 3-day
                    weekend.
                  </p>
                </div>

                <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-red-600 font-semibold">
                      Christmas Weekend
                    </span>
                    <span className="text-xs px-2 py-0.5 bg-red-500/20 text-red-600 rounded-full">
                      3 days off
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    December 25 (Fri) - December 27 (Sun). Natural Christmas
                    weekend.
                  </p>
                </div>
              </div>
            </section>

            {/* National Holidays */}
            <section id="national-holidays" className="mt-12">
              <h2>National Holidays Explained</h2>
              <p>
                Malta&apos;s five national holidays commemorate important events
                in the nation&apos;s history:
              </p>

              <h3>Freedom Day - 31 March</h3>
              <p>
                <strong>Jum il-Ħelsien</strong> commemorates the withdrawal of
                British military forces from Malta in 1979. This marked the end
                of foreign military presence on Maltese soil after centuries of
                foreign rule. The day is celebrated with ceremonies at the
                Freedom Day Monument in Birgu.
              </p>

              <h3>Sette Giugno - 7 June</h3>
              <p>
                <strong>Sette Giugno</strong> (Italian for &quot;Seventh of
                June&quot;) remembers the 1919 uprising against British rule
                when four Maltese men were killed during riots over the cost of
                living. The event was a catalyst for Malta&apos;s journey toward
                self-governance. A monument in Valletta honors the fallen.
              </p>

              <h3>Victory Day - 8 September</h3>
              <p>
                <strong>Il-Vitorja</strong> celebrates three significant
                victories: the Great Siege of 1565 against the Ottoman Empire,
                the French surrender in 1800, and the end of the World War II
                siege in 1943 when Italy surrendered. It coincides with the
                religious feast of Our Lady of Victories.
              </p>

              <h3>Independence Day - 21 September</h3>
              <p>
                <strong>Jum l-Indipendenza</strong> marks Malta&apos;s
                independence from Britain in 1964. While Malta remained in the
                Commonwealth with the Queen as head of state, this day
                represented a major step toward full sovereignty. Celebrations
                include parades in Floriana.
              </p>

              <h3>Republic Day - 13 December</h3>
              <p>
                <strong>Jum ir-Repubblika</strong> commemorates Malta becoming a
                republic in 1974, replacing the Queen with a President as head
                of state. This completed Malta&apos;s transition to full
                self-governance. The day is marked by ceremonies at the
                Presidential Palace in Valletta.
              </p>
            </section>

            {/* Religious Feasts */}
            <section id="religious-feasts" className="mt-12">
              <h2>Religious Feasts Explained</h2>
              <p>
                As a predominantly Catholic country, Malta celebrates seven
                religious public holidays:
              </p>

              <h3>Feast of St. Paul&apos;s Shipwreck - 10 February</h3>
              <p>
                <strong>In-Nawfraġju ta&apos; San Pawl</strong> commemorates the
                shipwreck of Saint Paul on Malta in 60 AD, as described in the
                Acts of the Apostles. This event is credited with bringing
                Christianity to Malta. The celebration is centered in Valletta
                with a procession carrying the statue of St. Paul.
              </p>

              <h3>Feast of St. Joseph - 19 March</h3>
              <p>
                <strong>San Ġużepp</strong> honors Saint Joseph, the husband of
                Mary and foster father of Jesus. Traditional foods include
                &quot;sfineġ&quot; (fried dough) and &quot;zeppoli&quot; (cream
                puffs). Many villages hold processions and band marches.
              </p>

              <h3>Good Friday - 3 April</h3>
              <p>
                <strong>Il-Ġimgħa l-Kbira</strong> is one of Malta&apos;s most
                impressive religious celebrations. Processions featuring
                life-sized statues depicting the Passion of Christ wind through
                streets in various towns. The most famous take place in Żejtun,
                Mosta, Qormi, and Valletta.
              </p>

              <h3>Feast of St. Peter & St. Paul (Mnarja) - 29 June</h3>
              <p>
                <strong>L-Imnarja</strong> is Malta&apos;s most traditional folk
                festival, combining religious devotion with rural festivities at
                Buskett Gardens. Traditional activities include horse and donkey
                races, folk singing (&quot;għana&quot;), and eating rabbit stew.
                The name comes from the Latin &quot;luminaria&quot; (lights).
              </p>

              <h3>Feast of the Assumption - 15 August</h3>
              <p>
                <strong>Santa Marija</strong> celebrates the bodily assumption
                of the Virgin Mary into Heaven. This is one of Malta&apos;s
                biggest festas with celebrations across many villages. Towns
                like Mosta, Għaxaq, and Mqabba hold spectacular celebrations
                with fireworks, band marches, and street decorations.
              </p>

              <h3>Feast of the Immaculate Conception - 8 December</h3>
              <p>
                <strong>Il-Kunċizzjoni</strong> celebrates the Catholic doctrine
                that Mary was conceived without original sin. Celebrations
                include church services, processions, and traditionally marks
                the beginning of the Christmas season in Malta.
              </p>

              <h3>Christmas Day - 25 December</h3>
              <p>
                <strong>Il-Milied</strong> celebrates the birth of Jesus Christ.
                Maltese traditions include midnight mass, nativity scenes
                (&quot;presepju&quot;), and traditional foods like
                &quot;imbuljuta&quot; (chestnut drink) and &quot;qaghaq
                tal-għasel&quot; (honey rings).
              </p>
            </section>

            {/* Weekend Holidays */}
            <section id="weekend-holidays" className="mt-12">
              <h2>Holidays Falling on Weekends in 2026</h2>
              <p>In 2026, three public holidays fall on weekends:</p>

              <div className="not-prose my-6 p-4 bg-orange-500/5 border border-orange-500/20 rounded-xl">
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <span className="w-24 font-semibold">7 June</span>
                    <span className="text-muted-foreground">
                      Sette Giugno - Sunday
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-24 font-semibold">15 August</span>
                    <span className="text-muted-foreground">
                      Santa Marija - Saturday
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-24 font-semibold">13 December</span>
                    <span className="text-muted-foreground">
                      Republic Day - Sunday
                    </span>
                  </li>
                </ul>
              </div>

              <p>
                <strong>Important:</strong> Under Malta&apos;s National Holidays
                Act of 2005, when a public holiday falls on a weekend, employees
                receive an additional 8 hours of vacation leave. This means in
                2026, full-time employees receive{" "}
                <strong>24 extra hours</strong> (3 days) added to their annual
                leave entitlement.
              </p>
            </section>

            {/* Employment Rights */}
            <section id="employment-rights" className="mt-12">
              <h2>Employment Rights on Public Holidays</h2>
              <p>
                Understanding your rights regarding public holidays is
                essential:
              </p>

              <h3>Paid Time Off</h3>
              <ul>
                <li>
                  All 14 public holidays are{" "}
                  <strong>paid non-working days</strong>
                </li>
                <li>
                  Employees receive their normal wage even when not working
                </li>
                <li>Part-time workers receive pro-rata entitlement</li>
              </ul>

              <h3>Working on Public Holidays</h3>
              <ul>
                <li>
                  If required to work, employees are entitled to{" "}
                  <strong>double time pay (2x)</strong>
                </li>
                <li>Alternatively, time off in lieu may be granted</li>
                <li>Agreement must be made between employer and employee</li>
              </ul>

              <h3>Weekend Holiday Compensation</h3>
              <ul>
                <li>
                  Holidays on weekends add 8 hours to annual leave per holiday
                </li>
                <li>
                  2026 total: <strong>216 hours</strong> (192 base + 24 for 3
                  weekend holidays)
                </li>
                <li>
                  This rule applies to full-time employees (40 hours/week)
                </li>
              </ul>
            </section>

            <BlogArticleAuthor
              datePublished="2026-02-01"
              sources={ARTICLE_SOURCES}
            />
            <BlogArticleFooter
              slug="malta-public-holidays-2026-complete-guide"
              title="Malta Public Holidays 2026: All 14 Official Dates"
              ctaTitle="Calculate Your Vacation Days"
              ctaDescription="Use our vacation calculator to see your total 2026 leave entitlement including public holiday additions."
              ctaLink="/calculators/vacation"
              ctaLinkText="Try Vacation Calculator"
            />

            {/* Sources */}
            <section className="mt-12 pt-8 border-t border-border">
              <h2>Official Sources</h2>
              <p>
                For the most up-to-date information, refer to official
                government sources:
              </p>
              <ul>
                <li>
                  <a
                    href="https://www.gov.mt/en/About%20Malta/Pages/Public%20Holidays.aspx"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Malta Government - Public Holidays
                  </a>
                </li>
                <li>
                  <a
                    href="https://legislation.mt/eli/cap/252/eng"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    National Holidays and Other Public Holidays Act (Chapter
                    252)
                  </a>
                </li>
              </ul>
            </section>
          </article>
        </Shell>
      </main>
    </MarketingLayout>
  );
}

export const revalidate = false;
export const dynamic = "force-static";
