"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { isChildCountEffective } from "@/config/malta-tax-config";
import { isMidWeekStart, parseDateOnly } from "@/utils/salary-calculator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  PAYSLIP_STATUS,
  calculateEmployerContributions,
  getLastWorkingDay,
  type PayslipStatus,
} from "@/utils/payslip-details";

interface Company {
  id: string;
  name: string;
  plan: "free" | "basic" | "pro";
}

interface Employee {
  id: string;
  name: string;
  position: string | null;
  employee_code: string | null;
}

export interface PayslipDraft {
  /** Düzenlenen taslak */
  payslipId?: string;
  /** Void edilen bordronun yerine çıkarılan düzeltme */
  replacesPayslipId?: string;
  employeeId: string;
  periodMonth: number;
  periodYear: number;
  salaryConfig?: {
    annualGross?: number;
    taxType?: "single" | "married" | "parent";
    childCount?: number;
    sscCategory?: string;
    birthYear?: number;
    startDate?: string;
    previousTaxableIncome?: number;
    previousTaxPaid?: number;
    includeStartWeekSSC?: boolean;
  };
  bonus?: number;
  allowance?: number;
  payDate?: string;
  leaveHoursTaken?: number;
  notes?: string;
}

interface PayslipWizardProps {
  company: Company;
  employees: Employee[];
  selectedEmployeeId?: string;
  /** Düzenlenen taslak (varsa sihirbaz onunla doldurulur) */
  draft?: PayslipDraft;
  /** Aylık limit dolduysa yalnızca taslak kaydedilebilir */
  canIssue?: boolean;
  issueBlockedMessage?: string;
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

export default function PayslipWizard({
  company,
  employees,
  selectedEmployeeId,
  draft,
  canIssue = true,
  issueBlockedMessage,
}: PayslipWizardProps) {
  const router = useRouter();
  const currentDate = new Date();
  const initialEmployeeId = draft?.employeeId ?? selectedEmployeeId;
  const draftConfig = draft?.salaryConfig;

  // Taslak düzenlenirken doğrudan maaş adımından başla
  const [step, setStep] = useState(draft ? 2 : 1);
  const [loading, setLoading] = useState<PayslipStatus | "calculate" | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  // Step 1: Employee selection
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    initialEmployeeId
      ? employees.find((e) => e.id === initialEmployeeId) || null
      : null,
  );

  // Step 2: Salary details - enhanced with all parameters
  const [salaryDetails, setSalaryDetails] = useState({
    month: draft?.periodMonth ?? currentDate.getMonth() + 1, // 1-12
    year: draft?.periodYear ?? currentDate.getFullYear(),
    annualGrossSalary: draftConfig?.annualGross ?? 24000, // Annual salary for API
    taxType: (draftConfig?.taxType ?? "single") as
      | "single"
      | "married"
      | "parent",
    childCount: (draftConfig?.childCount ?? 0) as 0 | 1 | 2, // Number of children (2026+)
    sscCategory: (draftConfig?.sscCategory ?? "C") as "A" | "B" | "C" | "D",
    birthYear: draftConfig?.birthYear ?? 1990,
    bonus: draft?.bonus ?? 0, // One-time bonus for this month
    allowance: draft?.allowance ?? 0, // Monthly allowance
    startDate: draftConfig?.startDate ?? "", // İşe başlama tarihi (YYYY-MM-DD) — kıst bordro için
    previousTaxableIncome: draftConfig?.previousTaxableIncome ?? 0, // Aynı yıl önceki işveren matrahı (FS3)
    previousTaxPaid: draftConfig?.previousTaxPaid ?? 0, // Aynı yıl önceki işverende kesilen vergi (FS3)
    includeStartWeekSSC: draftConfig?.includeStartWeekSSC ?? true, // Başlangıç haftası SSC (Salı–Cuma giriş)
    payDate: draft?.payDate ?? "", // Boşsa ayın son iş günü
    leaveHoursTaken: draft?.leaveHoursTaken ?? 0, // Bu dönemde kullanılan yıllık izin (saat)
    notes: draft?.notes ?? "", // Çalışana not (bordroda görünür)
  });

  const effectivePayDate =
    salaryDetails.payDate ||
    getLastWorkingDay(salaryDetails.year, salaryDetails.month);

  // Show child count for married/parent in 2026+
  const showChildCount = useMemo(
    () =>
      isChildCountEffective(salaryDetails.year) &&
      (salaryDetails.taxType === "married" ||
        salaryDetails.taxType === "parent"),
    [salaryDetails.year, salaryDetails.taxType],
  );

  // Step 3: Calculation results - enhanced
  const [calculationResult, setCalculationResult] = useState<{
    grossSalary: number;
    netSalary: number;
    incomeTax: number;
    sscEmployee: number;
    monthlyGross: number;
    cola: number;
    bonus: number;
    allowance: number;
    employmentRatio: number;
    sscWeeks: number;
    sscBase: number;
  } | null>(null);

  const employerContributions = useMemo(
    () =>
      calculationResult
        ? calculateEmployerContributions({
            sscEmployee: calculationResult.sscEmployee,
            sscBase: calculationResult.sscBase,
            sscWeeks: calculationResult.sscWeeks,
          })
        : null,
    [calculationResult],
  );

  const handleCalculate = async () => {
    setLoading("calculate");
    setError(null);

    try {
      // Validate salary
      if (
        salaryDetails.annualGrossSalary < 0 ||
        salaryDetails.annualGrossSalary > 10000000
      ) {
        setError("Annual salary must be between €0 and €10,000,000");
        return;
      }

      // Validate birth year
      const currentYear = new Date().getFullYear();
      if (
        salaryDetails.birthYear < 1900 ||
        salaryDetails.birthYear > currentYear - 16
      ) {
        setError(`Birth year must be between 1900 and ${currentYear - 16}`);
        return;
      }

      // Validate period is not in the future
      const now = new Date();
      const selectedDate = new Date(
        salaryDetails.year,
        salaryDetails.month - 1,
      );
      if (selectedDate > now) {
        setError("Cannot create payslip for future periods");
        return;
      }

      // İşe başlama tarihinden önceki dönem için bordro hazırlanamaz
      if (salaryDetails.startDate) {
        const [startYear, startMonth] = salaryDetails.startDate
          .split("-")
          .map(Number);
        if (
          startYear > salaryDetails.year ||
          (startYear === salaryDetails.year && startMonth > salaryDetails.month)
        ) {
          setError("This period is before the employee's start date");
          return;
        }
      }

      // Check for API token
      const apiToken = process.env.NEXT_PUBLIC_SALARY_API_TOKEN;
      if (!apiToken) {
        setError("API configuration error. Please contact support.");
        return;
      }

      // Call the existing salary API with all parameters
      const response = await fetch("/api/salary/calculate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiToken}`,
        },
        body: JSON.stringify({
          salary: salaryDetails.annualGrossSalary,
          year: salaryDetails.year,
          taxType: salaryDetails.taxType,
          childCount: salaryDetails.childCount,
          sscCategory: salaryDetails.sscCategory,
          birthYear: salaryDetails.birthYear,
          startDate: salaryDetails.startDate || undefined,
          previousTaxableIncome: salaryDetails.previousTaxableIncome,
          previousTaxPaid: salaryDetails.previousTaxPaid,
          includeStartWeekSSC: salaryDetails.includeStartWeekSSC,
        }),
      });

      const data = await response.json();

      if (data.success && data.data) {
        const monthIndex = salaryDetails.month - 1;

        // Validate monthlyBreakdown exists and has the requested month
        if (
          !data.data.monthlyBreakdown ||
          !Array.isArray(data.data.monthlyBreakdown) ||
          monthIndex >= data.data.monthlyBreakdown.length
        ) {
          setError("Invalid salary calculation response. Please try again.");
          return;
        }

        const monthlyData = data.data.monthlyBreakdown[monthIndex];

        // Calculate total with bonus and allowance
        const baseGross =
          monthlyData?.grossTotal ?? data.data.summary.monthly.gross;
        const totalGross =
          baseGross + salaryDetails.bonus + salaryDetails.allowance;

        setCalculationResult({
          grossSalary: totalGross,
          netSalary:
            (monthlyData?.net || data.data.summary.monthly.net) +
            salaryDetails.bonus +
            salaryDetails.allowance,
          incomeTax: monthlyData?.incomeTax || data.data.summary.monthly.tax,
          sscEmployee: monthlyData?.sscTax || data.data.summary.monthly.ssc,
          monthlyGross:
            monthlyData?.basicSalary ?? data.data.summary.monthly.gross,
          cola: monthlyData?.governmentBonus || 0,
          bonus: salaryDetails.bonus,
          allowance: salaryDetails.allowance,
          employmentRatio: monthlyData?.employmentRatio ?? 1,
          sscWeeks: monthlyData?.sscWeeks ?? 4,
          sscBase: monthlyData?.sscBase ?? 0,
        });
        setStep(3);
      } else {
        setError(data.error || "Calculation failed");
      }
    } catch {
      setError("API error occurred");
    } finally {
      setLoading(null);
    }
  };

  const handleGenerate = async (status: PayslipStatus) => {
    if (!selectedEmployee || !calculationResult) return;

    setLoading(status);
    setError(null);

    try {
      const response = await fetch("/api/payslip/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payslipId: draft?.payslipId,
          replacesPayslipId: draft?.replacesPayslipId,
          status,
          employeeId: selectedEmployee.id,
          periodMonth: salaryDetails.month,
          periodYear: salaryDetails.year,
          grossSalary: calculationResult.grossSalary,
          netSalary: calculationResult.netSalary,
          deductions: {
            incomeTax: calculationResult.incomeTax,
            sscEmployee: calculationResult.sscEmployee,
            cola: calculationResult.cola,
            bonus: calculationResult.bonus,
            allowance: calculationResult.allowance,
            sscWeeks: calculationResult.sscWeeks,
            sscBase: calculationResult.sscBase,
            sscEmployer: employerContributions?.sscEmployer ?? 0,
            maternityFund: employerContributions?.maternityFund ?? 0,
            employmentRatio: calculationResult.employmentRatio,
            payDate: effectivePayDate,
            leaveHoursTaken: salaryDetails.leaveHoursTaken,
            ...(salaryDetails.notes.trim()
              ? { notes: salaryDetails.notes.trim() }
              : {}),
            ...(calculationResult.employmentRatio < 1 && salaryDetails.startDate
              ? { periodStartDate: salaryDetails.startDate }
              : {}),
          },
          salaryConfig: {
            annualGross: salaryDetails.annualGrossSalary,
            taxType: salaryDetails.taxType,
            childCount: salaryDetails.childCount,
            sscCategory: salaryDetails.sscCategory,
            birthYear: salaryDetails.birthYear,
            startDate: salaryDetails.startDate || undefined,
            previousTaxableIncome: salaryDetails.previousTaxableIncome,
            previousTaxPaid: salaryDetails.previousTaxPaid,
            includeStartWeekSSC: salaryDetails.includeStartWeekSSC,
          },
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push(`/payslip/${data.payslipId}`);
      } else {
        setError(data.error || "Failed to save payslip");
      }
    } catch {
      setError("An error occurred");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div>
      <div>
        <div className="mx-auto max-w-2xl">
          <h1 className="mb-6 text-[28px] font-normal leading-9 tracking-tight text-md-on-surface">
            {draft?.payslipId
              ? "Edit draft"
              : draft?.replacesPayslipId
                ? "Corrected payslip"
                : "New payslip"}
          </h1>
          {/* Progress */}
          <div className="mb-8">
            <div className="mb-2 flex justify-between text-sm text-slate-500">
              <span>Step {step} of 3</span>
              <span>
                {step === 1 && "Select Employee"}
                {step === 2 && "Salary Details"}
                {step === 3 && "Preview & Save"}
              </span>
            </div>
            <div className="flex gap-2">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`h-2 flex-1 rounded-full transition ${
                    s <= step
                      ? "bg-md-primary"
                      : "bg-md-surface-container-highest"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Step 1: Employee Selection */}
          {step === 1 && (
            <div className="rounded-2xl border bg-white p-8 shadow-xl dark:bg-slate-800 dark:border-slate-700">
              <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">
                Select Employee
              </h2>
              <div className="space-y-3">
                {employees.map((employee) => (
                  <button
                    key={employee.id}
                    onClick={() => setSelectedEmployee(employee)}
                    className={`w-full rounded-lg border p-4 text-left transition ${
                      selectedEmployee?.id === employee.id
                        ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20"
                        : "border-slate-200 hover:border-amber-300 dark:border-slate-700"
                    }`}
                  >
                    <p className="font-medium text-slate-900 dark:text-white">
                      {employee.name}
                    </p>
                    <p className="text-sm text-slate-500">
                      {employee.position || "No position specified"}
                      {employee.employee_code && ` • ${employee.employee_code}`}
                    </p>
                  </button>
                ))}
              </div>
              <div className="mt-6 flex justify-between">
                <Link
                  href="/dashboard"
                  className="text-sm text-slate-500 hover:text-amber-600"
                >
                  ← Cancel
                </Link>
                <Button
                  onClick={() => setStep(2)}
                  disabled={!selectedEmployee}
                  className="bg-amber-600 hover:bg-amber-700"
                >
                  Continue →
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Salary Details - Enhanced with Shadcn */}
          {step === 2 && (
            <div className="rounded-2xl border bg-white p-8 shadow-xl dark:bg-slate-800 dark:border-slate-700">
              <h2 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">
                Salary Details
              </h2>
              <p className="mb-6 text-slate-500">
                Creating payslip for {selectedEmployee?.name}
              </p>

              <div className="space-y-6">
                {/* Period & Salary Row */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Period</Label>
                    <div className="flex gap-2">
                      <Select
                        value={salaryDetails.month.toString()}
                        onValueChange={(v) =>
                          setSalaryDetails({
                            ...salaryDetails,
                            month: parseInt(v),
                            payDate: "",
                          })
                        }
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {months.map((m, i) => (
                            <SelectItem key={i} value={(i + 1).toString()}>
                              {m}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select
                        value={salaryDetails.year.toString()}
                        onValueChange={(v) =>
                          setSalaryDetails({
                            ...salaryDetails,
                            year: parseInt(v),
                            payDate: "",
                          })
                        }
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from(
                            { length: 3 },
                            (_, i) => currentDate.getFullYear() - 1 + i,
                          ).map((y) => (
                            <SelectItem key={y} value={y.toString()}>
                              {y}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Annual Gross Salary (€)</Label>
                    <Input
                      type="number"
                      value={salaryDetails.annualGrossSalary}
                      onChange={(e) =>
                        setSalaryDetails({
                          ...salaryDetails,
                          annualGrossSalary: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                    <p className="text-xs text-slate-500">
                      Monthly: €
                      {(salaryDetails.annualGrossSalary / 12).toFixed(0)}
                    </p>
                  </div>
                </div>

                {/* Tax Settings Row */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Tax Status</Label>
                    <Select
                      value={salaryDetails.taxType}
                      onValueChange={(v: "single" | "married" | "parent") =>
                        setSalaryDetails({
                          ...salaryDetails,
                          taxType: v,
                          childCount:
                            v === "single" ? 0 : salaryDetails.childCount,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">👤 Single</SelectItem>
                        <SelectItem value="married">💑 Married</SelectItem>
                        <SelectItem value="parent">👨‍👩‍👧 Parent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>SSC Category</Label>
                    <Select
                      value={salaryDetails.sscCategory}
                      onValueChange={(v: "A" | "B" | "C" | "D") =>
                        setSalaryDetails({ ...salaryDetails, sscCategory: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A">Category A (Under 18)</SelectItem>
                        <SelectItem value="B">
                          Category B (Part-time)
                        </SelectItem>
                        <SelectItem value="C">
                          Category C (Full-time)
                        </SelectItem>
                        <SelectItem value="D">Category D</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Child Count (2026+) */}
                {showChildCount && (
                  <div className="space-y-2">
                    <Label>Number of Children</Label>
                    <div className="flex gap-2">
                      {[0, 1, 2].map((count) => (
                        <Button
                          key={count}
                          type="button"
                          variant={
                            salaryDetails.childCount === count
                              ? "default"
                              : "outline"
                          }
                          onClick={() =>
                            setSalaryDetails({
                              ...salaryDetails,
                              childCount: count as 0 | 1 | 2,
                            })
                          }
                          className={
                            salaryDetails.childCount === count
                              ? "bg-amber-600 hover:bg-amber-700"
                              : ""
                          }
                        >
                          {count === 0
                            ? "None"
                            : count === 1
                              ? "1 Child"
                              : "2+ Children"}
                        </Button>
                      ))}
                    </div>
                    <p className="text-xs text-slate-500">
                      From 2026, tax rates vary based on the number of children
                    </p>
                  </div>
                )}

                {/* Birth Year & Extras */}
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Birth Year</Label>
                    <Input
                      type="number"
                      value={salaryDetails.birthYear}
                      onChange={(e) =>
                        setSalaryDetails({
                          ...salaryDetails,
                          birthYear: parseInt(e.target.value) || 1990,
                        })
                      }
                      placeholder="1990"
                    />
                    <p className="text-xs text-slate-500">
                      SSC rates differ for born before/after 1962
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Bonus (€)</Label>
                    <Input
                      type="number"
                      value={salaryDetails.bonus || ""}
                      onChange={(e) =>
                        setSalaryDetails({
                          ...salaryDetails,
                          bonus: parseFloat(e.target.value) || 0,
                        })
                      }
                      placeholder="0"
                    />
                    <p className="text-xs text-slate-500">
                      One-time bonus this month
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Allowance (€)</Label>
                    <Input
                      type="number"
                      value={salaryDetails.allowance || ""}
                      onChange={(e) =>
                        setSalaryDetails({
                          ...salaryDetails,
                          allowance: parseFloat(e.target.value) || 0,
                        })
                      }
                      placeholder="0"
                    />
                    <p className="text-xs text-slate-500">Monthly allowance</p>
                  </div>
                </div>

                {/* Employment start & previous employment (FS3) */}
                <div className="space-y-4 rounded-lg border border-slate-200 p-4 dark:border-slate-700">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label>Employment Start Date</Label>
                      <Input
                        type="date"
                        value={salaryDetails.startDate}
                        onChange={(e) =>
                          setSalaryDetails({
                            ...salaryDetails,
                            startDate: e.target.value,
                          })
                        }
                      />
                      <p className="text-xs text-slate-500">
                        Optional. Start month is paid pro-rata
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label>Taxable Income Earlier This Year (€)</Label>
                      <Input
                        type="number"
                        value={salaryDetails.previousTaxableIncome || ""}
                        onChange={(e) =>
                          setSalaryDetails({
                            ...salaryDetails,
                            previousTaxableIncome:
                              parseFloat(e.target.value) || 0,
                          })
                        }
                        placeholder="0"
                      />
                      <p className="text-xs text-slate-500">
                        From previous employer&apos;s FS3
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label>Tax Already Paid This Year (€)</Label>
                      <Input
                        type="number"
                        value={salaryDetails.previousTaxPaid || ""}
                        onChange={(e) =>
                          setSalaryDetails({
                            ...salaryDetails,
                            previousTaxPaid: parseFloat(e.target.value) || 0,
                          })
                        }
                        placeholder="0"
                      />
                      <p className="text-xs text-slate-500">
                        FSS tax on previous employer&apos;s FS3
                      </p>
                    </div>
                  </div>
                  {isMidWeekStart(parseDateOnly(salaryDetails.startDate)) && (
                    <label className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                      <input
                        type="checkbox"
                        className="mt-0.5 h-4 w-4 accent-amber-600"
                        checked={salaryDetails.includeStartWeekSSC}
                        onChange={(e) =>
                          setSalaryDetails({
                            ...salaryDetails,
                            includeStartWeekSSC: e.target.checked,
                          })
                        }
                      />
                      <span>
                        Pay SSC for the start week
                        <span className="block text-xs text-slate-500">
                          Starts mid-week. Untick if a previous employer already
                          paid SSC for this week.
                        </span>
                      </span>
                    </label>
                  )}
                  <p className="text-xs text-slate-500">
                    Tax uses the FSS cumulative method: income earned this year
                    (including earlier employers) is projected from the months
                    elapsed, so a mid-year starter is not taxed as if they
                    worked the full year.
                  </p>
                </div>

                {/* Payslip details: pay date, leave, note */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Pay Date</Label>
                    <Input
                      type="date"
                      value={effectivePayDate}
                      onChange={(e) =>
                        setSalaryDetails({
                          ...salaryDetails,
                          payDate: e.target.value,
                        })
                      }
                    />
                    <p className="text-xs text-slate-500">
                      Defaults to the last working day of the month
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>Vacation Leave Taken (hours)</Label>
                    <Input
                      type="number"
                      min={0}
                      step={0.5}
                      value={salaryDetails.leaveHoursTaken || ""}
                      onChange={(e) =>
                        setSalaryDetails({
                          ...salaryDetails,
                          leaveHoursTaken: Math.max(
                            0,
                            parseFloat(e.target.value) || 0,
                          ),
                        })
                      }
                      placeholder="0"
                    />
                    <p className="text-xs text-slate-500">
                      Shown with the yearly balance on the payslip
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Note to Employee (optional)</Label>
                  <textarea
                    value={salaryDetails.notes}
                    maxLength={300}
                    rows={2}
                    onChange={(e) =>
                      setSalaryDetails({
                        ...salaryDetails,
                        notes: e.target.value,
                      })
                    }
                    placeholder="e.g. Includes June statutory bonus"
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
              </div>

              {error && (
                <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">
                  {error}
                </div>
              )}

              <div className="mt-6 flex justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setStep(1)}
                >
                  ← Back
                </Button>
                <Button
                  type="button"
                  onClick={handleCalculate}
                  disabled={loading !== null}
                  className="bg-amber-600 hover:bg-amber-700"
                >
                  {loading === "calculate"
                    ? "Calculating..."
                    : "Calculate & Preview →"}
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Preview & Generate - Enhanced */}
          {step === 3 && calculationResult && (
            <div className="rounded-2xl border bg-white p-8 shadow-xl dark:bg-slate-800 dark:border-slate-700">
              <h2 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">
                Payslip Preview
              </h2>
              <p className="mb-6 text-slate-500">
                {selectedEmployee?.name} • {months[salaryDetails.month - 1]}{" "}
                {salaryDetails.year}
              </p>

              {/* Payslip Preview */}
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900">
                <div className="mb-4 border-b border-slate-200 pb-4 dark:border-slate-700">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {company.name}
                  </h3>
                  <p className="text-sm text-slate-500">Payslip</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-slate-500">Employee</p>
                    <p className="font-medium text-slate-900 dark:text-white">
                      {selectedEmployee?.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Period</p>
                    <p className="font-medium text-slate-900 dark:text-white">
                      {months[salaryDetails.month - 1]} {salaryDetails.year}
                    </p>
                  </div>
                </div>

                {/* Earnings */}
                <div className="mt-6 space-y-2 border-t border-slate-200 pt-4 dark:border-slate-700">
                  <p className="text-xs font-semibold uppercase text-slate-500">
                    Earnings
                  </p>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">
                      Basic Salary
                      {calculationResult.employmentRatio < 1 &&
                        ` (pro-rata ${Math.round(calculationResult.employmentRatio * 100)}%)`}
                    </span>
                    <span className="font-medium text-slate-900 dark:text-white">
                      €{calculationResult.monthlyGross.toFixed(2)}
                    </span>
                  </div>
                  {calculationResult.cola > 0 && (
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">
                        COLA
                      </span>
                      <span className="font-medium text-slate-900 dark:text-white">
                        €{calculationResult.cola.toFixed(2)}
                      </span>
                    </div>
                  )}
                  {calculationResult.bonus > 0 && (
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">
                        Bonus
                      </span>
                      <span className="font-medium text-slate-900 dark:text-white">
                        €{calculationResult.bonus.toFixed(2)}
                      </span>
                    </div>
                  )}
                  {calculationResult.allowance > 0 && (
                    <div className="flex justify-between">
                      <span className="text-slate-600 dark:text-slate-400">
                        Allowance
                      </span>
                      <span className="font-medium text-slate-900 dark:text-white">
                        €{calculationResult.allowance.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-slate-200 pt-2 dark:border-slate-700">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      Total Gross
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      €{calculationResult.grossSalary.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Deductions */}
                <div className="mt-4 space-y-2">
                  <p className="text-xs font-semibold uppercase text-slate-500">
                    Deductions
                  </p>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">
                      Income Tax
                    </span>
                    <span className="font-medium text-red-600">
                      -€{calculationResult.incomeTax.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">
                      Social Security (SSC)
                    </span>
                    <span className="font-medium text-red-600">
                      -€{calculationResult.sscEmployee.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-slate-200 pt-2 dark:border-slate-700">
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      Total Deductions
                    </span>
                    <span className="font-bold text-red-600">
                      -€
                      {(
                        calculationResult.incomeTax +
                        calculationResult.sscEmployee
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Net Salary */}
                <div className="mt-4 border-t-2 border-amber-500 pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-slate-900 dark:text-white">
                      Net Salary
                    </span>
                    <span className="text-2xl font-bold text-amber-600">
                      €{calculationResult.netSalary.toFixed(2)}
                    </span>
                  </div>
                </div>

                {employerContributions && employerContributions.total > 0 && (
                  <div className="mt-4 space-y-1 rounded-lg bg-white p-3 text-sm dark:bg-slate-800">
                    <p className="text-xs font-semibold uppercase text-slate-500">
                      Employer contributions
                    </p>
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Employer SSC</span>
                      <span>
                        €{employerContributions.sscEmployer.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Maternity Fund (0.3%)</span>
                      <span>
                        €{employerContributions.maternityFund.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between font-medium text-slate-900 dark:text-white">
                      <span>Total cost to employer</span>
                      <span>
                        €
                        {(
                          calculationResult.grossSalary +
                          employerContributions.total
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}

                {company.plan === "free" && (
                  <div className="mt-4 rounded bg-slate-200/50 p-2 text-center text-xs text-slate-500">
                    Powered by Malta Calculator
                  </div>
                )}
              </div>

              {error && (
                <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">
                  {error}
                </div>
              )}

              {!canIssue && (
                <div className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                  {issueBlockedMessage ||
                    "You have reached your monthly limit of issued payslips."}{" "}
                  You can still save this payslip as a draft and issue it later.
                  {company.plan !== "pro" && (
                    <Link
                      href="/pricing"
                      className="ml-1 font-semibold underline"
                    >
                      Upgrade plan
                    </Link>
                  )}
                </div>
              )}

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                <Button variant="ghost" onClick={() => setStep(2)}>
                  ← Edit
                </Button>
                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    onClick={() => handleGenerate(PAYSLIP_STATUS.DRAFT)}
                    disabled={loading !== null}
                  >
                    {loading === PAYSLIP_STATUS.DRAFT
                      ? "Saving..."
                      : draft?.payslipId
                        ? "Update Draft"
                        : "Save as Draft"}
                  </Button>
                  <Button
                    onClick={() => handleGenerate(PAYSLIP_STATUS.FINAL)}
                    disabled={loading !== null || !canIssue}
                    className="bg-amber-600 hover:bg-amber-700"
                  >
                    {loading === PAYSLIP_STATUS.FINAL
                      ? "Issuing..."
                      : "✓ Issue Payslip"}
                  </Button>
                </div>
              </div>
              <p className="mt-3 text-right text-xs text-slate-500">
                Drafts are private, editable and don&apos;t count towards your
                monthly limit. Issued payslips are locked and visible to the
                employee.
              </p>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link
              href="/dashboard"
              className="text-sm text-slate-500 hover:text-amber-600"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
