import { Card, CardProps } from "@/components/salary/card";

export default function SalaryPlaygroundCards() {
  return (
    <>
      {playgrounds.map((play, i) => {
        const isFirst = i === 0;
        return (
          <Card
            key={play.href}
            className={isFirst ? "sm:col-span-3" : undefined}
            {...play}
          />
        );
      })}
    </>
  );
}



const playgrounds: CardProps[] = [
  // {
  //   href: "/play/checker",
  //   title: "Speed Checker",
  //   description:
  //     "Get speed insights for your api, website from multiple regions. No account needed.",
  //   icon: Gauge,
  //   variant: "primary",
  // },
  // {
  //   href: "/public/monitors/1",
  //   title: "Public Dashboard",
  //   description: "Get a demo of what data we collect for your monitor.",
  //   icon: Activity,
  // },
  // {
  //   href: "/play/status",
  //   title: "Status Page",
  //   description: "Get a status page for your website or api.",
  //   icon: PanelTop,
  // },
  // {
  //   href: "https://astro.openstat.us",
  //   title: "Custom Astro Status Page",
  //   description:
  //     "Grab your API key and create a custom status page with our Astro starter.",
  //   icon: Palette,
  // },
  // {
  //   href: "https://time.openstatus.dev",
  //   title: "Shadcn UI Time Picker",
  //   description:
  //     "The missing time picker for your next project. Supports 12 hour and 24 hour formats. Fully accessible.",
  //   icon: Clock,
  // },
  // {
  //   href: "https://openstat.us",
  //   title: "All Status Codes",
  //   description:
  //     "Use the endpoint to return the desired error code for testing purposes.",
  //   icon: FileCode,
  // },
];
