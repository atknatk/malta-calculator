import { describe, it, expect, vi, afterEach } from "vitest";
import { verifyTurnstileToken } from "./turnstile";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("verifyTurnstileToken", () => {
  it("skips the check when keys are not configured", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "");
    vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "");
    vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(await verifyTurnstileToken(undefined)).toBe(true);
  });

  it("rejects a missing token when configured", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "secret");
    vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "site");
    expect(await verifyTurnstileToken(null)).toBe(false);
  });

  it("returns Cloudflare's verdict", async () => {
    vi.stubEnv("TURNSTILE_SECRET_KEY", "secret");
    vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "site");
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ json: async () => ({ success: true }) })
      .mockResolvedValueOnce({ json: async () => ({ success: false }) });
    vi.stubGlobal("fetch", fetchMock);
    expect(await verifyTurnstileToken("ok", "1.2.3.4")).toBe(true);
    expect(await verifyTurnstileToken("bad")).toBe(false);
    const sent = fetchMock.mock.calls[0][1].body as URLSearchParams;
    expect(sent.get("secret")).toBe("secret");
    expect(sent.get("remoteip")).toBe("1.2.3.4");
  });
});
