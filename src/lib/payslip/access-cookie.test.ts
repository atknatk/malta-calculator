import { describe, it, expect, beforeAll } from "vitest";
import {
  ACCESS_SCOPE,
  createAccessCookieValue,
  isValidAccessCookie,
} from "./access-cookie";

beforeAll(() => {
  process.env.PAYSLIP_ACCESS_SECRET = "test-secret";
});

describe("payslip access cookie", () => {
  const id = "11111111-2222-3333-4444-555555555555";

  it("accepts a freshly signed value", () => {
    const value = createAccessCookieValue(ACCESS_SCOPE.VERIFY, id, 3600);
    expect(isValidAccessCookie(ACCESS_SCOPE.VERIFY, id, value)).toBe(true);
  });

  it("rejects the legacy forgeable 'true' value", () => {
    expect(isValidAccessCookie(ACCESS_SCOPE.EMPLOYEE, id, "true")).toBe(false);
  });

  it("rejects a value signed for another payslip or scope", () => {
    const value = createAccessCookieValue(ACCESS_SCOPE.VERIFY, id, 3600);
    expect(isValidAccessCookie(ACCESS_SCOPE.VERIFY, "other-id", value)).toBe(
      false,
    );
    expect(isValidAccessCookie(ACCESS_SCOPE.EMPLOYEE, id, value)).toBe(false);
  });

  it("rejects an expired or tampered value", () => {
    const now = Date.now();
    const value = createAccessCookieValue(ACCESS_SCOPE.VERIFY, id, 60, now);
    expect(
      isValidAccessCookie(ACCESS_SCOPE.VERIFY, id, value, now + 61_000),
    ).toBe(false);
    const [, signature] = value.split(".");
    const extended = `${now + 10_000_000}.${signature}`;
    expect(isValidAccessCookie(ACCESS_SCOPE.VERIFY, id, extended, now)).toBe(
      false,
    );
  });
});
