import { afterEach, describe, expect, it, vi } from "vitest";
import { buildRenderUrl } from "@/lib/payslip/pdf-renderer";
import {
  ACCESS_SCOPE,
  isValidAccessCookie,
} from "@/lib/payslip/access-cookie";

describe("buildRenderUrl", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("kısa ömürlü imzalı çizim bağlantısı üretir", () => {
    vi.stubEnv("PAYSLIP_ACCESS_SECRET", "test-secret");
    vi.stubEnv("PAYSLIP_RENDER_BASE_URL", "https://example.com/");
    const now = Date.UTC(2026, 9, 22);
    const url = new URL(buildRenderUrl("abc", now));

    expect(url.origin + url.pathname).toBe(
      "https://example.com/archive-render/abc",
    );
    const token = url.searchParams.get("t") ?? undefined;
    expect(isValidAccessCookie(ACCESS_SCOPE.RENDER, "abc", token, now)).toBe(true);
    // Başka bordro ya da kapsam için geçersiz, 5 dakika sonra süresi dolar
    expect(isValidAccessCookie(ACCESS_SCOPE.RENDER, "xyz", token, now)).toBe(false);
    expect(isValidAccessCookie(ACCESS_SCOPE.VERIFY, "abc", token, now)).toBe(false);
    expect(
      isValidAccessCookie(ACCESS_SCOPE.RENDER, "abc", token, now + 301_000),
    ).toBe(false);
  });
});
