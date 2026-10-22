import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { FilePlus2, Mail, UserPlus, Users } from "lucide-react";
import {
  getCompany,
  getEmployees,
  getUsageLimits,
} from "@/app/actions/payslip-actions";
import {
  Avatar,
  CardHeader,
  EmptyState,
  LinearProgress,
  MdCard,
  PageHeader,
  mdButton,
} from "@/components/admin/admin-ui";
import EmployeeForm from "./_components/employee-form";
import { getEmployeeAppStatuses } from "@/app/actions/employee-app-actions";
import EmployeeActionsMenu from "./_components/employee-actions-menu";
import EmployeeAppAccess from "./_components/employee-app-access";

export default async function EmployeesPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const company = await getCompany();

  if (!company) {
    redirect("/onboarding");
  }

  const [employees, usage, appStatuses] = await Promise.all([
    getEmployees(),
    getUsageLimits(),
    getEmployeeAppStatuses(),
  ]);
  const atLimit = usage.employees.used >= usage.employees.limit;

  return (
    <>
      <PageHeader
        title="Employees"
        description={`${employees.length} employee${employees.length !== 1 ? "s" : ""} registered`}
      />

      <div className="grid items-start gap-6 lg:grid-cols-5">
        {/* Employee list */}
        <MdCard className="overflow-hidden lg:col-span-3">
          <CardHeader
            title="Team"
            subtitle={`${usage.employees.used} of ${usage.employees.limit} seats used on your plan`}
          />
          <div className="px-6 pb-4">
            <LinearProgress
              value={usage.employees.used}
              max={usage.employees.limit}
            />
          </div>

          {employees.length === 0 ? (
            <EmptyState
              icon={<Users />}
              title="No employees yet"
              description="Add your first employee with the form. You can generate their payslip right after."
            />
          ) : (
            <ul className="divide-y divide-md-outline-variant/50 border-t border-md-outline-variant/50">
              {employees.map((employee) => (
                <li
                  key={employee.id}
                  className="flex items-center gap-4 px-5 py-4 transition hover:bg-md-on-surface/[0.03]"
                >
                  <Avatar name={employee.name} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-md-on-surface">
                      {employee.name}
                    </p>
                    <p className="truncate text-[13px] text-md-on-surface-variant">
                      {employee.position || "No position"}
                      {employee.employee_code && ` · ${employee.employee_code}`}
                      {employee.department && ` · ${employee.department}`}
                    </p>
                    {employee.email && (
                      <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-md-on-surface-variant/80">
                        <Mail className="size-3" />
                        {employee.email}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center">
                    <EmployeeAppAccess
                      employeeId={employee.id}
                      employeeName={employee.name}
                      email={employee.email}
                      status={appStatuses[employee.id] ?? "none"}
                      planAllows={company.plan === "pro"}
                    />
                    <EmployeeActionsMenu
                      employeeId={employee.id}
                      employeeName={employee.name}
                      values={{
                        name: employee.name,
                        email: employee.email ?? "",
                        employeeCode: employee.employee_code ?? "",
                        position: employee.position ?? "",
                        phone: employee.phone ?? "",
                        dateOfBirth: employee.date_of_birth ?? "",
                        address: employee.address ?? "",
                        idNumber: employee.id_number ?? "",
                        ssNumber: employee.ss_number ?? "",
                        department: employee.department ?? "",
                        section: employee.section ?? "",
                        unit: employee.unit ?? "",
                        grade: employee.grade ?? "",
                      }}
                    />
                    <Link
                      href={`/payslip/new?employeeId=${employee.id}`}
                      className={`${mdButton({ variant: "tonal", size: "sm" })} ml-2`}
                    >
                      <FilePlus2 />
                      <span className="hidden sm:inline">Payslip</span>
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </MdCard>

        {/* Add employee */}
        <MdCard className="lg:sticky lg:top-10 lg:col-span-2">
          <CardHeader
            title="Add employee"
            subtitle="Only the name is required"
            icon={<UserPlus />}
          />
          <div className="px-6 pb-6 pt-3">
            {atLimit ? (
              <div className="rounded-2xl bg-md-warning-container p-4 text-sm text-md-on-warning-container">
                <p className="font-medium">
                  You&apos;ve reached your plan&apos;s employee limit.
                </p>
                <p className="mt-1 opacity-80">
                  Upgrade to add more people to your payroll.
                </p>
                <Link
                  href="/pricing"
                  className={`${mdButton({ size: "sm" })} mt-3`}
                >
                  See plans
                </Link>
              </div>
            ) : (
              <EmployeeForm />
            )}
          </div>
        </MdCard>
      </div>
    </>
  );
}
