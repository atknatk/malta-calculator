import { describe, it, expect } from "vitest";
import {
  canonicalJson,
  createSnapshot,
  formatFingerprint,
  hashSnapshot,
  verifySnapshot,
  type PayslipSnapshot,
} from "./snapshot";
import type { PayslipDocumentProps } from "@/app/payslip/[id]/_components/payslip-document";

const document = {
  company: {
    name: "Example Ltd",
    address: null,
    tax_number: "123",
    logo_url: null,
    plan: "basic",
  },
  employee: {
    name: "Jane Doe",
    position: "Developer",
    employee_code: null,
    email: null,
  },
  periodMonth: 10,
  periodYear: 2026,
  grossSalary: 4166.67,
  netSalary: 3170.12,
  incomeTax: 716.9,
  sscEmployee: 279.65,
  createdAt: "2026-10-22T10:00:00.000Z",
  updatedAt: "2026-10-22T10:00:00.000Z",
  payslipNumber: "EXA-2026-10-ABCD",
  ytdTotals: { grossTotal: 1, taxTotal: 2, sscTotal: 3, netTotal: 4 },
  notes: undefined,
  status: "final",
} as unknown as PayslipDocumentProps;

describe("canonicalJson", () => {
  it("is independent of key order and drops undefined", () => {
    expect(canonicalJson({ b: 1, a: { d: undefined, c: [2, 1] } })).toBe(
      canonicalJson({ a: { c: [2, 1] }, b: 1 }),
    );
    expect(canonicalJson({ b: 1, a: 2 })).toBe('{"a":2,"b":1}');
  });
});

describe("payslip snapshot", () => {
  it("survives a database round trip that reorders keys", () => {
    const { snapshot, contentHash } = createSnapshot(
      document,
      "2026-10-22T10:00:00.000Z",
    );
    // jsonb anahtar sırasını korumaz: ters sırayla yeniden kur
    const reordered = JSON.parse(
      JSON.stringify(snapshot, Object.keys(snapshot).reverse()),
    ) as PayslipSnapshot;
    const fromDb = { ...reordered, document: snapshot.document };
    expect(verifySnapshot(fromDb, contentHash)).toBe(true);
    expect(snapshot.document).not.toHaveProperty("notes");
  });

  it("detects any change to the frozen content", () => {
    const { snapshot, contentHash } = createSnapshot(
      document,
      "2026-10-22T10:00:00.000Z",
    );
    const tampered: PayslipSnapshot = {
      ...snapshot,
      document: { ...snapshot.document, netSalary: 3200 },
    };
    expect(verifySnapshot(tampered, contentHash)).toBe(false);
    expect(verifySnapshot(snapshot, null)).toBe(false);
    expect(hashSnapshot(snapshot)).toBe(contentHash);
  });

  it("formats a short fingerprint", () => {
    expect(formatFingerprint("a1b2c3d4e5f60718293a4b5c6d7e8f90")).toBe(
      "A1B2 C3D4 E5F6 0718",
    );
  });
});
