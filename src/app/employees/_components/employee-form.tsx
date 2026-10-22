"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ChevronDown, Loader2, UserPlus, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { createEmployee, canAddEmployee } from "@/app/actions/payslip-actions";
import { updateEmployee } from "@/app/actions/employee-actions";
import { mdButton, mdInput, mdLabel } from "@/components/admin/admin-ui";

export interface EmployeeFormValues {
  name: string;
  email: string;
  employeeCode: string;
  position: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  idNumber: string;
  ssNumber: string;
  department: string;
  section: string;
  unit: string;
  grade: string;
}

export const EMPTY_EMPLOYEE: EmployeeFormValues = {
  name: "",
  email: "",
  employeeCode: "",
  position: "",
  phone: "",
  dateOfBirth: "",
  address: "",
  idNumber: "",
  ssNumber: "",
  department: "",
  section: "",
  unit: "",
  grade: "",
};

interface FieldDef {
  key: keyof EmployeeFormValues;
  label: string;
  placeholder?: string;
  type?: string;
  half?: boolean;
  hint?: string;
}

const BASIC_FIELDS: FieldDef[] = [
  {
    key: "employeeCode",
    label: "Employee code",
    placeholder: "EMP001",
    half: true,
  },
  { key: "position", label: "Position", placeholder: "Developer", half: true },
  {
    key: "email",
    label: "Email",
    placeholder: "employee@company.com",
    type: "email",
  },
  {
    key: "dateOfBirth",
    label: "Date of birth",
    type: "date",
    hint: "Used to build the employee's PIN for viewing payslips.",
  },
];

const PROFESSIONAL_FIELDS: FieldDef[] = [
  { key: "idNumber", label: "ID number", placeholder: "123456A", half: true },
  {
    key: "ssNumber",
    label: "SS number",
    placeholder: "Social security no.",
    half: true,
  },
  {
    key: "department",
    label: "Department",
    placeholder: "Engineering",
    half: true,
  },
  { key: "section", label: "Section", placeholder: "Backend", half: true },
  { key: "unit", label: "Unit", placeholder: "Platform", half: true },
  { key: "grade", label: "Grade", placeholder: "Senior", half: true },
  { key: "phone", label: "Phone", placeholder: "+356 1234 5678", type: "tel" },
];

interface EmployeeFormProps {
  /** Verilirse düzenleme modunda çalışır */
  employeeId?: string;
  initialValues?: EmployeeFormValues;
  onSaved?: () => void;
}

export default function EmployeeForm({
  employeeId,
  initialValues = EMPTY_EMPLOYEE,
  onSaved,
}: EmployeeFormProps) {
  const router = useRouter();
  const isEdit = Boolean(employeeId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(
    Boolean(initialValues.address) ||
      PROFESSIONAL_FIELDS.some((f) => initialValues[f.key]),
  );
  const [formData, setFormData] = useState<EmployeeFormValues>(initialValues);

  const set = (key: keyof EmployeeFormValues, value: string): void =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!isEdit) {
      // Check if can add more employees
      const canAdd = await canAddEmployee();
      if (!canAdd.allowed) {
        setError(canAdd.message || "Employee limit reached");
        setLoading(false);
        return;
      }
    }

    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) form.append(key, value);
    });

    const result = employeeId
      ? await updateEmployee(employeeId, form)
      : await createEmployee(form);

    if (result.success) {
      toast.success(
        isEdit ? "Employee updated" : `${formData.name.trim()} added`,
      );
      if (!isEdit) setFormData(EMPTY_EMPLOYEE);
      router.refresh();
      onSaved?.();
    } else {
      setError(result.error || "An error occurred");
    }
    setLoading(false);
  };

  const renderField = (field: FieldDef) => (
    <div key={field.key} className={field.half ? "" : "col-span-2"}>
      <label htmlFor={`emp-${field.key}`} className={mdLabel}>
        {field.label}
      </label>
      <input
        id={`emp-${field.key}`}
        type={field.type ?? "text"}
        value={formData[field.key]}
        onChange={(e) => set(field.key, e.target.value)}
        placeholder={field.placeholder}
        className={mdInput}
      />
      {field.hint && (
        <p className="mt-1 text-xs text-md-on-surface-variant">{field.hint}</p>
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="emp-name" className={mdLabel}>
          Full name <span className="text-md-error">*</span>
        </label>
        <input
          id="emp-name"
          type="text"
          name="name"
          required
          minLength={2}
          value={formData.name}
          onChange={(e) => set("name", e.target.value)}
          placeholder="John Smith"
          className={mdInput}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {BASIC_FIELDS.map(renderField)}
      </div>

      <button
        type="button"
        onClick={() => setShowAdvanced(!showAdvanced)}
        aria-expanded={showAdvanced}
        className="flex w-full items-center justify-between rounded-xl px-1 py-1 text-sm font-medium text-md-primary"
      >
        Payslip details (ID, SS no., department…)
        <ChevronDown
          className={cn("size-5 transition", showAdvanced && "rotate-180")}
        />
      </button>

      {showAdvanced && (
        <div className="space-y-3 rounded-2xl bg-md-surface-container p-4">
          <p className="text-xs text-md-on-surface-variant">
            These fields appear on the professional payslip.
          </p>
          <div>
            <label htmlFor="emp-address" className={mdLabel}>
              Address
            </label>
            <textarea
              id="emp-address"
              value={formData.address}
              onChange={(e) => set("address", e.target.value)}
              placeholder="Full address"
              rows={3}
              className={cn(mdInput, "h-auto py-3")}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {PROFESSIONAL_FIELDS.map(renderField)}
          </div>
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="rounded-xl bg-md-error-container px-4 py-3 text-sm text-md-on-error-container"
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading || formData.name.trim().length < 2}
        className={cn(mdButton(), "w-full")}
      >
        {loading ? (
          <Loader2 className="animate-spin" />
        ) : isEdit ? (
          <Save />
        ) : (
          <UserPlus />
        )}
        {loading
          ? isEdit
            ? "Saving…"
            : "Adding…"
          : isEdit
            ? "Save changes"
            : "Add employee"}
      </button>
    </form>
  );
}
