import { describe, expect, it } from "vitest";
import { buildArchiveKey, sha256Hex } from "@/lib/payslip/pdf-archive";

describe("buildArchiveKey", () => {
  it("şirket/yıl/ay altında bordro id'siyle anahtar üretir", () => {
    expect(
      buildArchiveKey({
        id: "11111111-2222-3333-4444-555555555555",
        company_id: "cccccccc-0000-0000-0000-000000000000",
        period_year: 2026,
        period_month: 3,
      }),
    ).toBe(
      "payslips/cccccccc-0000-0000-0000-000000000000/2026/03/11111111-2222-3333-4444-555555555555.pdf",
    );
  });
});

describe("sha256Hex", () => {
  it("küçük harfli 64 haneli hex döndürür", () => {
    expect(sha256Hex(Buffer.from("abc"))).toBe(
      "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
    );
  });
});
