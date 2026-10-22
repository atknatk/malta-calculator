/**
 * Cloudflare Turnstile sunucu doğrulaması
 * Env: NEXT_PUBLIC_TURNSTILE_SITE_KEY (widget) + TURNSTILE_SECRET_KEY (sunucu)
 */

const SITEVERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export function isTurnstileEnabled(): boolean {
  return Boolean(
    process.env.TURNSTILE_SECRET_KEY &&
      process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
  );
}

/** Korunan yüzeyler: widget ve sunucu aynı action'ı kullanmalı */
export const TURNSTILE_ACTION = {
  PAYSLIP_VERIFY: "payslip-verify",
  PAYSLIP_PIN: "payslip-pin",
} as const;

export type TurnstileAction =
  (typeof TURNSTILE_ACTION)[keyof typeof TURNSTILE_ACTION];

const DEFAULT_HOSTNAMES = ["maltacalculator.com", "www.maltacalculator.com"];
const MAX_TOKEN_LENGTH = 2048;
const SITEVERIFY_TIMEOUT_MS = 10_000;

/** İzin verilen hostname'ler: TURNSTILE_HOSTNAMES (virgülle) ya da varsayılan */
function getAllowedHostnames(): string[] {
  const configured = (process.env.TURNSTILE_HOSTNAMES || "")
    .split(",")
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean);
  return configured.length > 0 ? configured : DEFAULT_HOSTNAMES;
}

interface SiteverifyResponse {
  success?: boolean;
  action?: string;
  hostname?: string;
  "error-codes"?: string[];
}

/**
 * Turnstile token'ını doğrular (success + action + hostname). Anahtarlar
 * tanımlı değilse doğrulama atlanır (yerel geliştirme) ve uyarı loglanır.
 * Siteverify'a ulaşılamazsa istek reddedilir (fail closed).
 */
export async function verifyTurnstileToken(
  token: unknown,
  expectedAction: TurnstileAction,
  remoteIp?: string | null,
): Promise<boolean> {
  if (!isTurnstileEnabled()) {
    console.warn("Turnstile is not configured; skipping captcha check");
    return true;
  }
  if (
    typeof token !== "string" ||
    token.length === 0 ||
    token.length > MAX_TOKEN_LENGTH
  ) {
    return false;
  }

  const body = new URLSearchParams({
    secret: process.env.TURNSTILE_SECRET_KEY as string,
    response: token,
  });
  if (remoteIp) body.set("remoteip", remoteIp);

  try {
    const response = await fetch(SITEVERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      signal: AbortSignal.timeout(SITEVERIFY_TIMEOUT_MS),
    });
    if (!response.ok) {
      console.error("Turnstile siteverify HTTP error:", response.status);
      return false;
    }
    const data = (await response.json()) as SiteverifyResponse;
    if (data.success !== true) {
      console.warn("Turnstile rejected token:", data["error-codes"]);
      return false;
    }
    if (data.action !== expectedAction) {
      console.warn("Turnstile action mismatch:", data.action);
      return false;
    }
    if (
      !data.hostname ||
      !getAllowedHostnames().includes(data.hostname.toLowerCase())
    ) {
      console.warn("Turnstile hostname not allowed:", data.hostname);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Turnstile verification failed:", error);
    return false;
  }
}

export function getClientIp(headers: Headers): string | null {
  return (
    headers.get("cf-connecting-ip") ||
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    null
  );
}
