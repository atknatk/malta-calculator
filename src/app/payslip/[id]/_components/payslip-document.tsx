"use client";

import { QRCodeSVG } from "qrcode.react";
import {
  PAYSLIP_STATUS,
  STANDARD_MONTHLY_HOURS,
  formatOrdinalDate,
  type PayslipStatus,
} from "@/utils/payslip-details";

export interface PayslipDocumentProps {
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
  updatedAt?: string;
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
  periodStartDate?: string; // Kıst ay: işe başlama tarihi (YYYY-MM-DD)
  employmentRatio?: number; // Kıst ayda çalışılan gün oranı (0-1)
  payDate?: string; // YYYY-MM-DD
  employerContributions?: {
    sscEmployer: number;
    maternityFund: number;
  };
  leave?: {
    entitledHours: number;
    takenThisPeriod: number;
    takenToDate: number;
  };
  notes?: string;
  status?: PayslipStatus;
  /** Geçersiz kılınmış bordro: tarih ve gerekçe */
  voided?: {
    at: string;
    reason: string;
  };
  payslipUrl?: string;
  accessToken?: string;
  /** Düzeltilmiş bordro: sürüm no ve yerine geçtiği bordronun numarası */
  revision?: {
    number: number;
    replacesNumber: string;
  };
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
  single: "Single",
  married: "Married",
  parent: "Parent",
};

// Baskı/PDF'te aynı görünmesi için renkler inline tanımlı
const ACCENT = "#c2410c";
const INK = "#1f2937";
const MUTED = "#6b7280";
const RULE = `1px solid ${ACCENT}`;

const fmt = (amount: number): string =>
  `€${amount.toLocaleString("en-MT", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const fmtHours = (hours: number): string => hours.toFixed(2);

function Watermark({ label, color }: { label: string; color: string }) {
  // html2canvas transform'ları destekler; arka plan SVG'si yerine span ızgarası
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: "-20%",
          display: "grid",
          gridTemplateColumns: "repeat(9, 1fr)",
          gap: "18px 0",
          transform: "rotate(-35deg)",
        }}
      >
        {Array.from({ length: 9 * 22 }).map((_, i) => (
          <span
            key={i}
            style={{
              color,
              opacity: 0.28,
              fontSize: "12px",
              fontWeight: 600,
              textAlign: "center",
            }}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

function SectionHeader({
  label,
  columns,
}: {
  label: string;
  columns: string[];
}) {
  return (
    <tr style={{ borderBottom: RULE }}>
      <th
        style={{ color: ACCENT, fontWeight: 400, textAlign: "left" }}
        className="pb-1.5 text-[13px]"
      >
        {label}
      </th>
      {columns.map((col) => (
        <th
          key={col}
          style={{ color: ACCENT, fontWeight: 400, textAlign: "right" }}
          className="pb-1.5 pl-3 text-[13px]"
        >
          {col}
        </th>
      ))}
    </tr>
  );
}

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
  updatedAt,
  payslipNumber,
  ytdTotals,
  salaryConfig,
  earnings,
  sscWeeks = 4,
  periodStartDate,
  employmentRatio = 1,
  payDate,
  employerContributions,
  leave,
  notes,
  status = PAYSLIP_STATUS.FINAL,
  voided,
  payslipUrl,
  accessToken,
  revision,
}: PayslipDocumentProps) {
  const isDraft = status === PAYSLIP_STATUS.DRAFT;
  const isVoid = status === PAYSLIP_STATUS.VOID;
  const isPaidPlan = company.plan !== "free";

  // Dönem: kıst ayda işe başlama tarihinden başlar
  const parsedStart = periodStartDate
    ? new Date(`${periodStartDate}T00:00:00`)
    : null;
  const startDate =
    parsedStart &&
    !isNaN(parsedStart.getTime()) &&
    parsedStart.getFullYear() === periodYear &&
    parsedStart.getMonth() === periodMonth - 1
      ? parsedStart
      : new Date(periodYear, periodMonth - 1, 1);
  const endDate = new Date(periodYear, periodMonth, 0);
  const payPeriod = `${formatOrdinalDate(startDate)} to ${formatOrdinalDate(endDate)}`;
  const payDay = formatOrdinalDate(payDate || endDate);
  const lastUpdated = formatOrdinalDate(updatedAt || createdAt);

  // Earnings
  const basicSalary = earnings?.basicSalary ?? grossSalary;
  const cola = earnings?.cola || 0;
  const bonus = earnings?.bonus || 0;
  const allowance = earnings?.allowance || 0;
  const basicHours = STANDARD_MONTHLY_HOURS * employmentRatio;
  const hourlyRate = basicHours > 0 ? basicSalary / basicHours : 0;

  const earningRows: { label: string; hint?: string; hours?: number; amount: number }[] = [
    {
      label: "Basic Pay",
      hint:
        employmentRatio < 1
          ? `pro-rata ${Math.round(employmentRatio * 100)}% · ${fmt(hourlyRate)}/h`
          : `${fmt(hourlyRate)}/h`,
      hours: basicHours,
      amount: basicSalary,
    },
    ...(cola > 0 ? [{ label: "Statutory Bonus", hint: "COLA", amount: cola }] : []),
    ...(allowance > 0 ? [{ label: "Allowance", amount: allowance }] : []),
    ...(bonus > 0 ? [{ label: "Bonus", amount: bonus }] : []),
  ];

  // Deductions
  const taxTypeLabel = TAX_TYPE_LABELS[salaryConfig?.taxType || "single"];
  const childHint =
    salaryConfig?.taxType !== "single" && (salaryConfig?.childCount ?? 0) > 0
      ? ` · ${salaryConfig?.childCount === 1 ? "1 child" : "2+ children"}`
      : "";
  const sscCategory = salaryConfig?.sscCategory || "C";
  const totalDeductions = incomeTax + sscEmployee;
  const employerTotal = employerContributions
    ? employerContributions.sscEmployer + employerContributions.maternityFund
    : 0;

  const employmentType = sscCategory === "B" ? "PT" : "FT";

  // QR: yalnızca yayınlanmış bordrolar doğrulanabilir
  const baseUrl = "https://maltacalculator.com";
  const verifyToken = accessToken || payslipNumber;
  const qrUrl = payslipUrl || `${baseUrl}/v/${verifyToken}`;

  const leaveRemaining = leave
    ? Math.max(0, leave.entitledHours - leave.takenToDate)
    : 0;

  const companyAddressLines = (company.address || "")
    .split(/\n|,\s*/)
    .map((line) => line.trim())
    .filter(Boolean);
  const employeeAddressLines = (employee.address || "")
    .split(/\n|,\s*/)
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <div
      data-payslip-document
      className="relative mx-auto bg-white"
      style={{
        fontFamily:
          "'Open Sans', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
        color: INK,
        width: "210mm",
        height: "297mm",
        maxHeight: "297mm",
        padding: "14mm 14mm 10mm",
        boxSizing: "border-box",
        fontSize: "12px",
        lineHeight: "1.45",
        overflow: "hidden",
      }}
    >
      {isDraft && <Watermark label="Draft" color="#9ca3af" />}
      {isVoid && <Watermark label="VOID" color="#dc2626" />}

      <div
        className="relative flex flex-col"
        style={{ height: "100%", zIndex: 1 }}
      >
        {/* ============ TOP: QR / LOGO ============ */}
        <div className="flex items-start justify-between">
          {isDraft ? (
            <div
              className="flex h-[88px] w-[88px] items-center justify-center text-center text-[10px] font-bold uppercase leading-tight"
              style={{ border: `2px dashed ${ACCENT}`, color: ACCENT }}
            >
              Draft
              <br />
              not valid
            </div>
          ) : (
            <QRCodeSVG
              value={qrUrl}
              size={88}
              level="M"
              bgColor="#ffffff"
              fgColor="#000000"
            />
          )}
          {isPaidPlan && company.logo_url ? (
            <img
              src={company.logo_url}
              alt={company.name}
              className="max-h-12 max-w-[200px] object-contain"
            />
          ) : (
            <span
              className="text-[15px] font-bold italic"
              style={{ color: ACCENT }}
            >
              {company.name}
            </span>
          )}
        </div>

        {/* ============ PARTIES ============ */}
        <div className="mt-8 flex justify-between gap-8">
          <div>
            <p className="text-[14px] font-bold">{employee.name}</p>
            {employee.position && (
              <p>
                {employee.position} ({employmentType})
              </p>
            )}
            {employeeAddressLines.map((line) => (
              <p key={line}>{line}</p>
            ))}
            {employee.id_number && <p>ID: {employee.id_number}</p>}
            {employee.ss_number && <p>SSC No: {employee.ss_number}</p>}
            {(employee.employee_code || employee.department) && (
              <p style={{ color: MUTED }}>
                {[employee.employee_code, employee.department]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="text-[14px] font-bold">{company.name}</p>
            {companyAddressLines.map((line) => (
              <p key={line}>{line}</p>
            ))}
            {company.tax_number && <p>PE No: {company.tax_number}</p>}
          </div>
        </div>

        {/* ============ TITLE ============ */}
        <div className="mt-10 flex items-end justify-between">
          <div>
            <h1
              className="font-bold leading-none tracking-tight"
              style={{ fontSize: "44px" }}
            >
              Payslip
            </h1>
            <p className="mt-2 text-[11px]" style={{ color: MUTED }}>
              {months[periodMonth - 1]} {periodYear} · No. {payslipNumber}
            </p>
            {revision && (
              <p className="mt-0.5 text-[11px]" style={{ color: MUTED }}>
                Revision {revision.number} · replaces No.{" "}
                {revision.replacesNumber}
              </p>
            )}
          </div>
          <div className="text-right text-[14px]">
            <p style={{ color: ACCENT }}>Pay Day</p>
            <p>{payDay}</p>
            <p style={{ color: ACCENT }}>Pay Period</p>
            <p>{payPeriod}</p>
          </div>
        </div>

        {/* ============ EARNINGS & DEDUCTIONS ============ */}
        <div className="mt-3 grid grid-cols-2 gap-10">
          <table className="w-full self-start text-[13px]">
            <thead>
              <SectionHeader label="Earnings" columns={["Hours", "Amount"]} />
            </thead>
            <tbody>
              {earningRows.map((row) => (
                <tr key={row.label} style={{ borderBottom: RULE }}>
                  <td className="py-2.5">
                    {row.label}
                    {row.hint && (
                      <span className="ml-1 text-[9px]" style={{ color: MUTED }}>
                        {row.hint}
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 pl-3 text-right">
                    {row.hours !== undefined ? fmtHours(row.hours) : ""}
                  </td>
                  <td className="py-2.5 pl-3 text-right">{fmt(row.amount)}</td>
                </tr>
              ))}
              <tr>
                <td className="pt-3 font-bold" colSpan={2}>
                  Total Earnings
                </td>
                <td className="pt-3 text-right font-bold">
                  {fmt(grossSalary)}
                </td>
              </tr>
            </tbody>
          </table>

          <div className="self-start">
            <table className="w-full text-[13px]">
              <thead>
                <SectionHeader label="Deductions" columns={["Amount"]} />
              </thead>
              <tbody>
                <tr style={{ borderBottom: RULE }}>
                  <td className="py-2.5">
                    SSC {sscCategory}
                    <span className="ml-1 text-[9px]" style={{ color: MUTED }}>
                      {sscWeeks} weeks
                    </span>
                  </td>
                  <td className="py-2.5 pl-3 text-right">
                    {fmt(sscEmployee)}
                  </td>
                </tr>
                <tr style={{ borderBottom: RULE }}>
                  <td className="py-2.5">
                    FSS {taxTypeLabel}
                    <span className="ml-1 text-[9px]" style={{ color: MUTED }}>
                      Taxable {fmt(grossSalary)}
                      {childHint}
                    </span>
                  </td>
                  <td className="py-2.5 pl-3 text-right">{fmt(incomeTax)}</td>
                </tr>
                <tr>
                  <td className="pt-3 font-bold">Total Deductions</td>
                  <td className="pt-3 text-right font-bold">
                    {fmt(totalDeductions)}
                  </td>
                </tr>
              </tbody>
            </table>

            {employerContributions && employerTotal > 0 && (
              <div className="mt-6 text-right text-[10px] leading-snug">
                <p>Your employer has contributed:</p>
                <p>{fmt(employerContributions.sscEmployer)} in SSC,</p>
                <p>
                  {fmt(employerContributions.maternityFund)} in Maternity Fund
                </p>
                <p className="mt-1" style={{ color: MUTED }}>
                  Total cost to employer: {fmt(grossSalary + employerTotal)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ============ NOTES ============ */}
        {notes && (
          <div
            className="mt-8 rounded-sm px-3 py-2 text-[11px]"
            style={{ borderLeft: `3px solid ${ACCENT}`, background: "#fff7ed" }}
          >
            <span className="font-semibold">Note: </span>
            <span className="whitespace-pre-line">{notes}</span>
          </div>
        )}

        {/* ============ VOID NOTICE ============ */}
        {isVoid && voided && (
          <div
            className="mt-6 rounded-sm px-3 py-2 text-[11px]"
            style={{ borderLeft: "3px solid #dc2626", background: "#fef2f2" }}
          >
            <span className="font-semibold" style={{ color: "#dc2626" }}>
              Voided on {formatOrdinalDate(voided.at)}:{" "}
            </span>
            <span className="whitespace-pre-line">{voided.reason}</span>
          </div>
        )}

        <div className="flex-grow" />

        {/* ============ TAKE-HOME PAY ============ */}
        <div
          className="flex items-center justify-between py-4"
          style={{ borderTop: `1.5px solid ${ACCENT}` }}
        >
          <span className="text-[26px] font-bold">TAKE-HOME PAY</span>
          <span className="text-[28px] font-bold">{fmt(netSalary)}</span>
        </div>

        {/* ============ TOTALS TO DATE & LEAVE ============ */}
        <div
          className="grid grid-cols-2 gap-10 pb-2 text-[12px]"
          style={{ borderBottom: RULE }}
        >
          <div>
            <p className="mb-1 text-[12px]" style={{ color: ACCENT }}>
              Totals to Date ({periodYear})
            </p>
            {[
              ["Gross", ytdTotals.grossTotal],
              ["FSS", ytdTotals.taxTotal],
              ["SSC", ytdTotals.sscTotal],
              ["Total Take-Home Pay", ytdTotals.netTotal],
            ].map(([label, value]) => (
              <div key={label as string} className="flex justify-between">
                <span>{label}</span>
                <span>{fmt(value as number)}</span>
              </div>
            ))}
          </div>
          {leave && (
            <div>
              <p
                className="mb-1 text-right text-[12px]"
                style={{ color: ACCENT }}
              >
                Vacation Leave (hours)
              </p>
              {[
                ["Entitled this year", leave.entitledHours],
                ["Taken this period", leave.takenThisPeriod],
                ["Taken to date", leave.takenToDate],
                ["Remaining", leaveRemaining],
              ].map(([label, value]) => (
                <div key={label as string} className="flex justify-between">
                  <span>{label}</span>
                  <span>{fmtHours(value as number)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ============ FOOTER ============ */}
        <div
          className="mt-2 flex items-start justify-between gap-4 text-[9.5px]"
          style={{ color: ACCENT }}
        >
          <div>
            <p>
              © {periodYear} {company.name}
            </p>
            {!isPaidPlan && (
              <p style={{ color: MUTED }}>Generated by Malta Calculator</p>
            )}
          </div>
          <div className="text-center" style={{ color: MUTED }}>
            {isDraft ? (
              <p className="font-semibold uppercase" style={{ color: ACCENT }}>
                Draft — not issued, subject to change
              </p>
            ) : isVoid ? (
              <p className="font-semibold" style={{ color: "#dc2626" }}>
                VOID — cancelled
                {voided ? ` on ${formatOrdinalDate(voided.at)}` : ""}. Not
                valid.
              </p>
            ) : (
              <>
                <p>Computer generated, no signature required.</p>
                <p className="font-mono">Verify: {qrUrl}</p>
              </>
            )}
          </div>
          <p className="text-right">
            This payslip was last updated on {lastUpdated}
          </p>
        </div>
      </div>
    </div>
  );
}
