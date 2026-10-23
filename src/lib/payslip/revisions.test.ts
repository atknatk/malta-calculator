import { describe, expect, it } from "vitest";
import {
  baseRevisionNumber,
  buildRevisionPayslipNumber,
  currentVersion,
  orderVersions,
} from "@/lib/payslip/revisions";

const row = (
  id: string,
  status: "final" | "void",
  replaces: string | null,
  finalizedAt: string,
  number: string,
  revision: number | null = null,
) => ({
  id,
  status,
  access_token: `tok-${id}`,
  replaces_payslip_id: replaces,
  finalized_at: finalizedAt,
  voided_at: status === "void" ? finalizedAt : null,
  void_reason: status === "void" ? "wrong tax status" : null,
  payslip_number: number,
  revision_number: revision,
});

describe("revision numbers", () => {
  it("ilk sürümün numarasına -R<n> ekler", () => {
    expect(buildRevisionPayslipNumber("EXA-2026-10-ABCD", 2)).toBe(
      "EXA-2026-10-ABCD-R2",
    );
    expect(buildRevisionPayslipNumber("EXA-2026-10-ABCD-R2", 3)).toBe(
      "EXA-2026-10-ABCD-R3",
    );
    expect(baseRevisionNumber("EXA-2026-10-ABCD-R12")).toBe("EXA-2026-10-ABCD");
  });
});

describe("orderVersions", () => {
  it("replaces zincirini sırayla dizer ve güncel sürümü bulur", () => {
    const versions = orderVersions([
      row("c", "final", "b", "2026-10-25", "N-R3", 3),
      row("a", "void", null, "2026-10-20", "N"),
      row("b", "void", "a", "2026-10-22", "N-R2", 2),
    ]);
    expect(versions.map((v) => v.id)).toEqual(["a", "b", "c"]);
    expect(versions.map((v) => v.revisionNumber)).toEqual([1, 2, 3]);
    expect(currentVersion(versions)?.id).toBe("c");
  });

  it("hepsi void ise güncel sürüm yoktur", () => {
    const versions = orderVersions([row("a", "void", null, "2026-10-20", "N")]);
    expect(currentVersion(versions)).toBeNull();
  });
});
