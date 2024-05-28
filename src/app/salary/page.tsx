import {
  Gauge,
} from "lucide-react";

import type { CardProps } from "@/components/salary/card";
import { Card } from "@/components/salary/card";
import { BackButton } from "@/components/layout/back-button";
import { SalaryCalculatorForm } from "./_components/salary-input-form";
import { SalaryFormCard } from "@/components/salary/form-card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// import {
//   defaultMetadata,
//   ogMetadata,
//   twitterMetadata,
// } from "../shared-metadata";

// export const metadata: Metadata = {
//   ...defaultMetadata,
//   title: "Free Tools ",
//   openGraph: {
//     ...ogMetadata,
//     title: "Free Tools",
//     url: "https://www.openstatus.dev/play",
//   },
//   twitter: {
//     ...twitterMetadata,
//     title: "Free Tools",
//   },
// };

export default async function SalaryCalculatorPage() {
  return (
    <>
      <BackButton href="/" />
      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3 sm:grid-cols-2">
        <SalaryFormCard
          title="Salary Calculator"
          variant="primary"
          icon={Gauge}
          className={"sm:col-span-3"}
        >
          <SalaryCalculatorForm />
        </SalaryFormCard>
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
        <SalaryFormCard title="Result" className={"sm:col-span-3"}>
          <Table>
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Month</TableHead>
                <TableHead>Gross Wage</TableHead>
                <TableHead>SSI Base Amount</TableHead>
                <TableHead>SSI Base Employee</TableHead>
                <TableHead>SSI UnEmp</TableHead>
                <TableHead>Cumulative Income </TableHead>
                
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.invoice}>
                  <TableCell className="font-medium">
                    {invoice.invoice}
                  </TableCell>
                  <TableCell>{invoice.paymentStatus}</TableCell>
                  <TableCell>{invoice.paymentMethod}</TableCell>
                  <TableCell className="text-right">
                    {invoice.totalAmount}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3}>Total</TableCell>
                <TableCell className="text-right">$2,500.00</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </SalaryFormCard>
      </div>
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

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
 
];
