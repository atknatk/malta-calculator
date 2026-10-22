import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { TURNSTILE_ACTION, verifyTurnstileToken } from "./turnstile";

const ACTION = TURNSTILE_ACTION.PAYSLIP_VERIFY;

function mockSiteverify(payload: object, ok = true) {
  const fetchMock = vi
    .fn()
    .mockResolvedValue({ ok, status: ok ? 200 : 500, json: async () => payload });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("verifyTurnstileToken", () => {
  it("skips the check when keys are not configured", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "");
    vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "");
    vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(await verifyTurnstileToken(undefined, ACTION)).toBe(true);
  });

  describe("when configured", () => {
    beforeEach(() => {
      vi.stubEnv("TURNSTILE_SECRET_KEY", "secret");
      vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "site");
      vi.spyOn(console, "warn").mockImplementation(() => {});
      vi.spyOn(console, "error").mockImplementation(() => {});
    });

    it("rejects missing, non-string or oversized tokens without calling Cloudflare", async () => {
      const fetchMock = mockSiteverify({ success: true });
      expect(await verifyTurnstileToken(null, ACTION)).toBe(false);
      expect(await verifyTurnstileToken(123, ACTION)).toBe(false);
      expect(await verifyTurnstileToken("x".repeat(2049), ACTION)).toBe(false);
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it("accepts a valid token for the right action and hostname", async () => {
      const fetchMock = mockSiteverify({
        success: true,
        action: ACTION,
        hostname: "maltacalculator.com",
      });
      expect(await verifyTurnstileToken("ok", ACTION, "1.2.3.4")).toBe(true);
      const sent = fetchMock.mock.calls[0][1].body as URLSearchParams;
      expect(sent.get("secret")).toBe("secret");
      expect(sent.get("response")).toBe("ok");
      expect(sent.get("remoteip")).toBe("1.2.3.4");
    });

    it("rejects a token issued for another action", async () => {
      mockSiteverify({
        success: true,
        action: TURNSTILE_ACTION.PAYSLIP_PIN,
        hostname: "maltacalculator.com",
      });
      expect(await verifyTurnstileToken("ok", ACTION)).toBe(false);
    });

    it("rejects hostnames outside the allowlist", async () => {
      mockSiteverify({ success: true, action: ACTION, hostname: "evil.example" });
      expect(await verifyTurnstileToken("ok", ACTION)).toBe(false);
    });

    it("honours TURNSTILE_HOSTNAMES", async () => {
      vi.stubEnv("TURNSTILE_HOSTNAMES", "staging.example.com");
      mockSiteverify({
        success: true,
        action: ACTION,
        hostname: "staging.example.com",
      });
      expect(await verifyTurnstileToken("ok", ACTION)).toBe(true);
    });

    it("fails closed on Cloudflare rejection or HTTP errors", async () => {
      mockSiteverify({ success: false, "error-codes": ["timeout-or-duplicate"] });
      expect(await verifyTurnstileToken("used", ACTION)).toBe(false);
      mockSiteverify({}, false);
      expect(await verifyTurnstileToken("ok", ACTION)).toBe(false);
    });
  });
});
