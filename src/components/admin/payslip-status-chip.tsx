import { CheckCircle2, CircleDashed, Ban } from "lucide-react";
import { StatusChip } from "./admin-ui";

// Bilinmeyen durumlar (ör. ileride eklenecek "void") nötr chip olarak gösterilir
export default function PayslipStatusChip({
  status,
}: {
  status: string;
}): JSX.Element {
  if (status === "draft") {
    return (
      <StatusChip tone="warning">
        <CircleDashed />
        Draft
      </StatusChip>
    );
  }
  if (status === "final") {
    return (
      <StatusChip tone="success">
        <CheckCircle2 />
        Issued
      </StatusChip>
    );
  }
  if (status === "void" || status === "voided") {
    return (
      <StatusChip tone="error">
        <Ban />
        Void
      </StatusChip>
    );
  }
  return <StatusChip>{status}</StatusChip>;
}
