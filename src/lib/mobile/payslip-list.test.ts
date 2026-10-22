import { describe, expect, it } from "vitest";
import {
  buildPayslipList,
  summarizeYear,
  type MobilePayslipRow,
} from "@/lib/mobile/payslip-list";

function row(overrides: Partial<MobilePayslipRow>): MobilePayslipRow {
  return {
    id: "aaaa0000-0000-0000-0000-000000000000",
    employee_id: "emp-1",
    company_id: "co-1",
    period_month: 1,
    period_year: 2026,
    gross_salary: 2000,
    net_salary: 1650,
    deductions: { incomeTax: 150, sscEmployee: 200 },
    status: "final",
    finalized_at: "2026-01-31T10:00:00Z",
    voided_at: null,
    void_reason: null,
    replaces_payslip_id: null,
    companyName: "Acme Ltd",
    ...overrides,
  };
}

describe("buildPayslipList", () => {
  it("sorts newest period first and links void payslips to their replacement", () => {
    const list = buildPayslipList([
      row({ id: "jan-0000", period_month: 1 }),
      row({
        id: "feb-void",
        period_month: 2,
        status: "void",
        voided_at: "2026-03-01T00:00:00Z",
        void_reason: "Wrong hours",
      }),
      row({
        id: "feb-new0",
        period_month: 2,
        finalized_at: "2026-03-02T00:00:00Z",
        replaces_payslip_id: "feb-void",
      }),
    ]);

    expect(list.map((item) => item.id)).toEqual([
      "feb-new0",
      "feb-void",
      "jan-0000",
    ]);
    expect(list[1].replacedByPayslipId).toBe("feb-new0");
    expect(list[0].replacesPayslipId).toBe("feb-void");
    expect(list[2].payslipNumber).toBe("ACM-2026-01-JAN-");
  });

  it("reads numeric strings and missing deductions safely", () => {
    const [item] = buildPayslipList([
      row({ gross_salary: "2500.50", net_salary: "2000.25", deductions: null }),
    ]);
    expect(item.grossSalary).toBe(2500.5);
    expect(item.netSalary).toBe(2000.25);
    expect(item.incomeTax).toBe(0);
    expect(item.sscEmployee).toBe(0);
  });
});

describe("summarizeYear", () => {
  it("totals only final payslips of the year, per employer", () => {
    const summary = summarizeYear(
      [
        row({ period_month: 1 }),
        row({ period_month: 2, gross_salary: 2000.1 }),
        row({ period_month: 3, status: "void" }),
        row({ period_month: 12, period_year: 2025 }),
        row({ employee_id: "emp-2", company_id: "co-2", companyName: "Beta" }),
      ],
      2026,
    );

    expect(summary).toHaveLength(2);
    expect(summary[0]).toMatchObject({
      employeeId: "emp-1",
      payslipCount: 2,
      grossTotal: 4000.1,
      netTotal: 3300,
      taxTotal: 300,
      sscTotal: 400,
    });
    expect(summary[1]).toMatchObject({ companyName: "Beta", payslipCount: 1 });
  });
});
