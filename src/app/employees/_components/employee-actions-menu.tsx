"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteEmployee } from "@/app/actions/employee-actions";
import { mdButton } from "@/components/admin/admin-ui";
import EmployeeForm, { type EmployeeFormValues } from "./employee-form";

const dialogClass =
  "max-h-[90vh] overflow-y-auto rounded-[28px] border-0 bg-md-surface-container-high p-6 text-md-on-surface sm:rounded-[28px]";

interface EmployeeActionsMenuProps {
  employeeId: string;
  employeeName: string;
  values: EmployeeFormValues;
}

export default function EmployeeActionsMenu({
  employeeId,
  employeeName,
  values,
}: EmployeeActionsMenuProps) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDelete = async () => {
    setDeleting(true);
    setDeleteError(null);
    const result = await deleteEmployee(employeeId);
    setDeleting(false);
    if (result.success) {
      toast.success(`${employeeName} deleted`);
      setDeleteOpen(false);
      router.refresh();
    } else {
      setDeleteError(result.error || "Could not delete employee");
    }
  };

  const iconButton =
    "flex size-10 items-center justify-center rounded-full text-md-on-surface-variant transition hover:bg-md-on-surface/[0.08]";

  return (
    <>
      <button
        type="button"
        onClick={() => setEditOpen(true)}
        aria-label={`Edit ${employeeName}`}
        title="Edit"
        className={iconButton}
      >
        <Pencil className="size-[18px]" />
      </button>
      <button
        type="button"
        onClick={() => {
          setDeleteError(null);
          setDeleteOpen(true);
        }}
        aria-label={`Delete ${employeeName}`}
        title="Delete"
        className={`${iconButton} hover:text-md-error`}
      >
        <Trash2 className="size-[18px]" />
      </button>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className={dialogClass}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-normal">
              Edit employee
            </DialogTitle>
            <DialogDescription className="text-md-on-surface-variant">
              Changes apply to new payslips. Issued payslips keep the details
              they were issued with.
            </DialogDescription>
          </DialogHeader>
          <EmployeeForm
            employeeId={employeeId}
            initialValues={values}
            onSaved={() => setEditOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className={`${dialogClass} max-w-md`}>
          <DialogHeader>
            <div className="mb-2 flex size-12 items-center justify-center rounded-2xl bg-md-error-container text-md-on-error-container">
              <Trash2 className="size-6" />
            </div>
            <DialogTitle className="text-2xl font-normal">
              Delete {employeeName}?
            </DialogTitle>
            <DialogDescription className="text-md-on-surface-variant">
              This permanently removes the employee. Employees with payslips on
              record can&apos;t be deleted.
            </DialogDescription>
          </DialogHeader>
          {deleteError && (
            <div
              role="alert"
              className="rounded-xl bg-md-error-container px-4 py-3 text-sm text-md-on-error-container"
            >
              {deleteError}
            </div>
          )}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setDeleteOpen(false)}
              className={mdButton({ variant: "text" })}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className={`${mdButton()} !bg-md-error !text-white dark:!text-black`}
            >
              {deleting && <Loader2 className="animate-spin" />}
              Delete
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
