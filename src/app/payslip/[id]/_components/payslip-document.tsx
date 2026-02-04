"use client";

import { QRCodeSVG } from "qrcode.react";

interface PayslipDocumentProps {
  company: {
    name: string;
    address: string | null;
    tax_number: string | null;
    logo_url: string | null;
    plan: "free" | "basic" | "pro";
  };
  employee: {
    name: string;
    position: string | null;
    employee_code: string | null;
    email: string | null;
    address?: string | null;
    id_number?: string | null;
    ss_number?: string | null;
    department?: string | null;
    section?: string | null;
    unit?: string | null;
    grade?: string | null;
  };
  periodMonth: number;
  periodYear: number;
  grossSalary: number;
  netSalary: number;
  incomeTax: number;
  sscEmployee: number;
  createdAt: string;
  payslipNumber: string;
  ytdTotals: {
    grossTotal: number;
    taxTotal: number;
    sscTotal: number;
    netTotal: number;
  };
  salaryConfig?: {
    annualGross?: number;
    taxType?: "single" | "married" | "parent";
    childCount?: number;
    sscCategory?: string;
    birthYear?: number;
  };
  earnings?: {
    basicSalary: number;
    cola?: number;
    bonus?: number;
    allowance?: number;
    overtime?: number;
    leavePay?: number;
    fringeBenefits?: number;
  };
  sscWeeks?: number;
  payslipUrl?: string;
  accessToken?: string;
}

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const TAX_TYPE_LABELS: Record<string, string> = {
  single: "Single Rates",
  married: "Married Rates",
  parent: "Parent Rates",
};

export default function PayslipDocument({
  company,
  employee,
  periodMonth,
  periodYear,
  grossSalary,
  netSalary,
  incomeTax,
  sscEmployee,
  createdAt,
  payslipNumber,
  ytdTotals,
  salaryConfig,
  earnings,
  sscWeeks = 4,
  payslipUrl,
  accessToken,
}: PayslipDocumentProps) {
  const period = `${months[periodMonth - 1]} ${periodYear}`;
  const isPaidPlan = company.plan !== "free";

  void createdAt;

  // Calculate dates
  const startDate = new Date(periodYear, periodMonth - 1, 1);
  const endDate = new Date(periodYear, periodMonth, 0);
  const rollPeriod = `${startDate.toLocaleDateString("en-GB")} - ${endDate.toLocaleDateString("en-GB")}`;
  const payDate = endDate.toLocaleDateString("en-GB");

  // Printed timestamp
  const printedDate = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const printedTime = new Date().toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Earnings breakdown
  const basicSalary = earnings?.basicSalary || grossSalary;
  const cola = earnings?.cola || 0;
  const bonus = earnings?.bonus || 0;
  const allowance = earnings?.allowance || 0;

  // Calculate hourly rate (173.33 standard hours)
  const monthlyHours = 173.33;
  const hourlyRate = basicSalary / monthlyHours;

  // Tax type label
  const taxTypeLabel = salaryConfig?.taxType
    ? TAX_TYPE_LABELS[salaryConfig.taxType] || "Single Rates"
    : "Single Rates";

  // Total deductions
  const totalDeductions = incomeTax + sscEmployee;

  // QR Code URL - use short accessToken (8 chars), fallback to payslipNumber
  const baseUrl = "https://maltacalculator.com";
  const verifyToken = accessToken || payslipNumber;
  const qrUrl = payslipUrl || `${baseUrl}/v/${verifyToken}`;

  // Format currency - all black, no color
  const fmt = (amount: number) => {
    return amount.toLocaleString("en-MT", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <div
      data-payslip-document
      className="mx-auto bg-white text-black"
      style={{
        fontFamily: "Arial, Helvetica, sans-serif",
        width: "210mm",
        height: "297mm",
        maxHeight: "297mm",
        padding: "6mm",
        boxSizing: "border-box",
        fontSize: "10px",
        lineHeight: "1.4",
        overflow: "hidden",
      }}
    >
      {/* Main Container - fills A4 */}
      <div
        className="flex flex-col"
        style={{
          height: "calc(297mm - 12mm)",
          maxHeight: "calc(297mm - 12mm)",
        }}
      >
        {/* ============ HEADER ============ */}
        <div className="border-b-2 border-black pb-3 mb-3">
          <div className="flex justify-between items-start">
            {/* Left: Company Info */}
            <div className="flex items-start gap-3">
              {isPaidPlan && company.logo_url && (
                <img
                  src={company.logo_url}
                  alt={company.name}
                  className="h-14 max-w-[240px] object-contain"
                />
              )}
              <div>
                <h1 className="text-xl font-bold">{company.name}</h1>
                {company.address && (
                  <p className="text-xs mt-0.5 whitespace-pre-line">
                    {company.address}
                  </p>
                )}
                {company.tax_number && (
                  <p className="text-xs">PE Number: {company.tax_number}</p>
                )}
              </div>
            </div>

            {/* Right: Title + QR */}
            <div className="text-right flex items-start gap-3">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">PAYSLIP</h2>
                <p className="text-base font-semibold">{period}</p>
                <p className="text-[9px] font-mono">{payslipNumber}</p>
              </div>
              <div className="border border-black p-0.5 bg-white">
                <QRCodeSVG
                  value={qrUrl}
                  size={60}
                  level="M"
                  bgColor="#ffffff"
                  fgColor="#000000"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ============ EMPLOYEE & PERIOD INFO ============ */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Employee Details */}
          <div className="border border-gray-400">
            <div className="border-b border-gray-400 bg-gray-50 px-2 py-1 font-bold text-xs uppercase tracking-wide">
              Employee Details
            </div>
            <div className="p-2">
              <table className="w-full text-xs">
                <tbody>
                  <tr>
                    <td className="py-1 font-semibold w-24">Name</td>
                    <td className="py-1">{employee.name}</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-semibold">Employee Code</td>
                    <td className="py-1">{employee.employee_code || "-"}</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-semibold">Position</td>
                    <td className="py-1">{employee.position || "-"}</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-semibold">ID Number</td>
                    <td className="py-1">{employee.id_number || "-"}</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-semibold">SS Number</td>
                    <td className="py-1">{employee.ss_number || "-"}</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-semibold">Department</td>
                    <td className="py-1">{employee.department || "-"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Pay Period Details */}
          <div className="border border-gray-400">
            <div className="border-b border-gray-400 bg-gray-50 px-2 py-1 font-bold text-xs uppercase tracking-wide">
              Pay Period Details
            </div>
            <div className="p-2">
              <table className="w-full text-xs">
                <tbody>
                  <tr>
                    <td className="py-1 font-semibold w-24">Period</td>
                    <td className="py-1">{period}</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-semibold">Date Range</td>
                    <td className="py-1">{rollPeriod}</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-semibold">Pay Date</td>
                    <td className="py-1">{payDate}</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-semibold">Tax Status</td>
                    <td className="py-1">{taxTypeLabel}</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-semibold">SSC Weeks</td>
                    <td className="py-1">{sscWeeks} weeks</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-semibold">SSC Category</td>
                    <td className="py-1">
                      Category {salaryConfig?.sscCategory || "C"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ============ EARNINGS ============ */}
        <div className="border border-gray-400 mb-4">
          <div className="border-b border-gray-400 bg-gray-50 px-2 py-1 font-bold text-xs uppercase tracking-wide">
            Earnings
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-300 bg-gray-50">
                <th className="py-1.5 px-2 text-left font-semibold">
                  Description
                </th>
                <th className="py-1.5 px-2 text-right font-semibold w-20">
                  Hours
                </th>
                <th className="py-1.5 px-2 text-right font-semibold w-24">
                  Rate (€)
                </th>
                <th className="py-1.5 px-2 text-right font-semibold w-28">
                  Amount (€)
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-400">
                <td className="py-1.5 px-2">Basic Salary</td>
                <td className="py-1.5 px-2 text-right">
                  {monthlyHours.toFixed(2)}
                </td>
                <td className="py-1.5 px-2 text-right">
                  {hourlyRate.toFixed(4)}
                </td>
                <td className="py-1.5 px-2 text-right font-medium">
                  {fmt(basicSalary)}
                </td>
              </tr>
              {cola > 0 && (
                <tr className="border-b border-gray-400">
                  <td className="py-1.5 px-2">
                    Cost of Living Adjustment (COLA)
                  </td>
                  <td className="py-1.5 px-2 text-right">-</td>
                  <td className="py-1.5 px-2 text-right">-</td>
                  <td className="py-1.5 px-2 text-right font-medium">
                    {fmt(cola)}
                  </td>
                </tr>
              )}
              {allowance > 0 && (
                <tr className="border-b border-gray-400">
                  <td className="py-1.5 px-2">Allowance</td>
                  <td className="py-1.5 px-2 text-right">-</td>
                  <td className="py-1.5 px-2 text-right">-</td>
                  <td className="py-1.5 px-2 text-right font-medium">
                    {fmt(allowance)}
                  </td>
                </tr>
              )}
              {bonus > 0 && (
                <tr className="border-b border-gray-400">
                  <td className="py-1.5 px-2">Bonus</td>
                  <td className="py-1.5 px-2 text-right">-</td>
                  <td className="py-1.5 px-2 text-right">-</td>
                  <td className="py-1.5 px-2 text-right font-medium">
                    {fmt(bonus)}
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr className="border-t border-gray-400 bg-gray-50">
                <td colSpan={3} className="py-2 px-2 font-bold text-sm">
                  GROSS PAY
                </td>
                <td className="py-2 px-2 text-right font-bold text-sm">
                  € {fmt(grossSalary)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* ============ DEDUCTIONS ============ */}
        <div className="border border-gray-400 mb-4">
          <div className="border-b border-gray-400 bg-gray-50 px-2 py-1 font-bold text-xs uppercase tracking-wide">
            Deductions
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-300 bg-gray-50">
                <th className="py-1.5 px-2 text-left font-semibold">
                  Description
                </th>
                <th className="py-1.5 px-2 text-right font-semibold w-28">
                  Amount (€)
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-400">
                <td className="py-1.5 px-2">
                  Income Tax (FSS - {taxTypeLabel})
                </td>
                <td className="py-1.5 px-2 text-right font-medium">
                  {fmt(incomeTax)}
                </td>
              </tr>
              <tr className="border-b border-gray-400">
                <td className="py-1.5 px-2">
                  Social Security Contribution ({sscWeeks} weeks)
                </td>
                <td className="py-1.5 px-2 text-right font-medium">
                  {fmt(sscEmployee)}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="border-t border-gray-400 bg-gray-50">
                <td className="py-2 px-2 font-bold text-sm">
                  TOTAL DEDUCTIONS
                </td>
                <td className="py-2 px-2 text-right font-bold text-sm">
                  € {fmt(totalDeductions)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* ============ NET PAY ============ */}
        <div className="border-2 border-black mb-4 bg-gray-100">
          <div className="flex justify-between items-center px-3 py-3">
            <span className="text-lg font-bold">NET PAY</span>
            <span className="text-2xl font-bold">€ {fmt(netSalary)}</span>
          </div>
        </div>

        {/* ============ YEAR TO DATE ============ */}
        <div className="border border-gray-400 mb-4">
          <div className="border-b border-gray-400 bg-gray-50 px-2 py-1 font-bold text-xs uppercase tracking-wide">
            Year to Date Summary ({periodYear})
          </div>
          <div className="grid grid-cols-4 divide-x divide-gray-300">
            <div className="p-2 text-center">
              <div className="text-[10px] font-semibold mb-0.5">
                Gross Earnings
              </div>
              <div className="text-sm font-bold">
                € {fmt(ytdTotals.grossTotal)}
              </div>
            </div>
            <div className="p-2 text-center">
              <div className="text-[10px] font-semibold mb-0.5">Total Tax</div>
              <div className="text-sm font-bold">
                € {fmt(ytdTotals.taxTotal)}
              </div>
            </div>
            <div className="p-2 text-center">
              <div className="text-[10px] font-semibold mb-0.5">Total SSC</div>
              <div className="text-sm font-bold">
                € {fmt(ytdTotals.sscTotal)}
              </div>
            </div>
            <div className="p-2 text-center">
              <div className="text-[10px] font-semibold mb-0.5">
                Net to Date
              </div>
              <div className="text-sm font-bold">
                € {fmt(ytdTotals.netTotal)}
              </div>
            </div>
          </div>
        </div>

        {/* ============ SPACER - pushes footer down ============ */}
        <div className="flex-grow"></div>

        {/* ============ FOOTER ============ */}
        <div className="border-t border-gray-400 pt-3 mt-3">
          <div className="flex justify-between items-end text-[10px]">
            <div>
              {!isPaidPlan && (
                <div className="font-bold text-xs mb-0.5">
                  Generated by Malta Calculator
                </div>
              )}
              <div>
                This payslip is computer generated and does not require a
                signature.
              </div>
              <div className="mt-0.5 font-mono text-[9px]">Verify: {qrUrl}</div>
            </div>
            <div className="text-right">
              <div>Document ID: {payslipNumber}</div>
              <div>
                Printed: {printedDate} at {printedTime}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
